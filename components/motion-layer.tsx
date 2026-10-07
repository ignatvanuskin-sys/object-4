"use client";

import { useEffect } from "react";

/** Glyph pool for the decode effect — reads as a technical readout, not noise. */
const GLYPHS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789/#*+";

type SpotItem = { el: HTMLElement; light: HTMLElement; rect: DOMRect };

/**
 * One client module for every scroll- and pointer-driven effect on the page.
 *
 * Why a single component instead of an effect per section: the site has no
 * business shipping several independent scroll listeners and frame loops. This
 * keeps one passive listener, one rAF, and two IntersectionObservers, and it
 * degrades to plain content — the server renders ordinary markup, JS only adds
 * movement on top, and everything is skipped outright for
 * `prefers-reduced-motion`.
 *
 * Contract: all motion is `transform`/`opacity` only, so it composites. Each
 * frame reads every rect first and writes every transform after, so no layout
 * is invalidated mid-loop, and every observed element is unobserved once it
 * has fired.
 */
export function MotionLayer() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let frame = 0;
    let queued = false;
    let pointerX = 0;
    let pointerY = 0;

    // ---------------------------------------------------------------- parallax
    const parallax =
      reduce ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const onScreen = new Set<HTMLElement>();
    const lastShift = new WeakMap<HTMLElement, number>();

    function applyParallax() {
      if (parallax.length === 0) return;
      const vh = window.innerHeight;
      const rects: Array<[HTMLElement, DOMRect]> = [];
      for (const el of onScreen) rects.push([el, el.getBoundingClientRect()]);
      // Reads finished — writes only from here on.
      for (const [el, rect] of rects) {
        if (rect.bottom < -240 || rect.top > vh + 240) continue;
        const progress =
          (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const shift = -progress * Number(el.dataset.parallax ?? "10");
        if (Math.abs((lastShift.get(el) ?? Infinity) - shift) < 0.1) continue;
        lastShift.set(el, shift);
        el.style.transform = `translate3d(0, ${shift.toFixed(2)}%, 0)`;
      }
    }

    let viewObserver: IntersectionObserver | undefined;
    if (parallax.length) {
      viewObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) onScreen.add(el);
            else onScreen.delete(el);
          }
          queue();
        },
        { rootMargin: "20% 0px 20% 0px" },
      );
      parallax.forEach((el) => viewObserver!.observe(el));
    }

    // --------------------------------------------------------------- spotlight
    const spots: SpotItem[] = [];
    if (fine && !reduce) {
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>("[data-spotlight]"),
      )) {
        const light = el.querySelector<HTMLElement>(".spotlight");
        if (light) spots.push({ el, light, rect: el.getBoundingClientRect() });
      }
    }

    function refreshSpotRects() {
      for (const spot of spots) spot.rect = spot.el.getBoundingClientRect();
    }

    function applySpots() {
      for (const spot of spots) {
        const inside =
          pointerX >= spot.rect.left &&
          pointerX <= spot.rect.right &&
          pointerY >= spot.rect.top &&
          pointerY <= spot.rect.bottom;
        if (!inside) {
          spot.light.removeAttribute("data-active");
          continue;
        }
        spot.light.style.transform = `translate3d(${(pointerX - spot.rect.left).toFixed(
          1,
        )}px, ${(pointerY - spot.rect.top).toFixed(1)}px, 0)`;
        spot.light.dataset.active = "on";
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      queue();
    }
    if (spots.length) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ---------------------------------------------------------- count & decode
    function runCount(el: HTMLElement) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const to = Number(el.dataset.count ?? "0");
      const decimals = Number(el.dataset.countDecimals ?? "0");
      const suffix = el.dataset.countSuffix ?? "";
      const render = (value: number) => value.toFixed(decimals).replace(".", ",") + suffix;

      if (reduce) {
        el.textContent = render(to);
        return;
      }
      const started = performance.now();
      const duration = 1200;
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        el.textContent = render(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = render(to);
      };
      requestAnimationFrame(step);
    }

    function runDecode(el: HTMLElement) {
      if (el.dataset.decoded) return;
      el.dataset.decoded = "1";
      // `data-decode` is a marker, not a payload. A bare JSX attribute reaches
      // the DOM as `data-decode="true"`, so treating the attribute as the text
      // replaced every label with the literal string "true". The element's own
      // text is the only source; the marker stays a marker.
      const final = el.textContent || "";
      el.dataset.decode = "1";
      if (reduce) {
        el.textContent = final;
        return;
      }
      const started = performance.now();
      const duration = 640;
      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        const settled = Math.floor(t * final.length);
        let out = "";
        for (let i = 0; i < final.length; i += 1) {
          const ch = final[i];
          out += i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    }

    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count], [data-decode]"),
    );
    let triggerObserver: IntersectionObserver | undefined;

    if (triggers.length) {
      if (reduce) {
        // No movement, but the values still have to end up correct on screen.
        for (const el of triggers) {
          if (el.hasAttribute("data-count")) runCount(el);
          else {
            // Same trap as runDecode: never echo the marker attribute back into
            // the DOM as text. Reduced motion just means no shuffle — the label
            // is already correct as server-rendered.
            el.dataset.decoded = "1";
          }
        }
      } else {
        triggerObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const el = entry.target as HTMLElement;
              if (el.hasAttribute("data-count")) runCount(el);
              if (el.hasAttribute("data-decode")) runDecode(el);
              triggerObserver!.unobserve(el);
            }
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0 },
        );
        triggers.forEach((el) => triggerObserver!.observe(el));
      }
    }

    // ------------------------------------------------------------- frame loop
    function queue() {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        refreshSpotRects();
        applyParallax();
        applySpots();
      });
    }

    const onScroll = () => queue();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    queue();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (spots.length) window.removeEventListener("pointermove", onPointerMove);
      viewObserver?.disconnect();
      triggerObserver?.disconnect();
    };
  }, []);

  return null;
}
