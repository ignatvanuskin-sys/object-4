"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole document.
 *
 * Server components mark elements with `data-reveal` (fade + lift) or
 * `data-reveal-clip` (image curtain). Both markers sit on unclipped elements —
 * the curtain itself lives on a `.clip-target` child, because clipping the
 * observed element collapses its intersection rectangle and the reveal would
 * deadlock. Optional `style={{ "--reveal-delay": "120ms" }}` staggers children.
 *
 * `threshold: 0` with a negative bottom rootMargin is used deliberately: it
 * fires as soon as an element crosses ~88% of the viewport height, and it keeps
 * working for elements taller than the viewport.
 */
export function RevealManager() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-clip]"),
    );
    if (nodes.length === 0) return;

    const show = (el: Element) => {
      if (el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "in");
      if (el.hasAttribute("data-reveal-clip")) el.setAttribute("data-reveal-clip", "in");
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    nodes.forEach((el) => observer.observe(el));

    // Safety net: if the visitor lands on a deep link (/#contacts, /#faq) the
    // jump is instant, so anything already on screen is revealed explicitly
    // instead of waiting for a scroll event that may never come.
    const sweep = () => {
      const limit = window.innerHeight * 0.94;
      for (const el of nodes) {
        if (!el.isConnected) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) show(el);
      }
    };
    const t1 = window.setTimeout(sweep, 120);
    const t2 = window.setTimeout(sweep, 700);

    return () => {
      observer.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return null;
}
