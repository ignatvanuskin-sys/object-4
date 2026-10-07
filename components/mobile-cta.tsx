"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Mobile-only sticky conversion bar: call or WhatsApp in one tap.
 * It appears once the hero is behind the user and retracts as soon as the
 * contacts block is on screen, so it never covers the form or the footer.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contacts = document.getElementById("contacts");
    const footer = document.querySelector("footer");

    const onScroll = () => {
      // Only once the hero — including its two CTAs — is completely behind the
      // visitor. A scroll-offset rule would let the bar cover them on short phones.
      const pastHero = hero
        ? hero.getBoundingClientRect().bottom <= 0
        : window.scrollY > window.innerHeight;
      if (!pastHero) {
        setVisible(false);
        return;
      }
      const viewport = window.innerHeight;
      const blocked = [contacts, footer].some((el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < viewport - 120 && r.bottom > 120;
      });
      setVisible(!blocked);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      // Solid background on purpose — see the note in site-header.tsx.
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/12 bg-ink px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={site.phoneHref}
          className="label flex min-h-[52px] items-center justify-center gap-2 border border-white/25 text-paper"
          tabIndex={visible ? 0 : -1}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M3.6 1.5 5.4 4.2 4 5.8c.7 1.5 2.7 3.5 4.2 4.2l1.6-1.4 2.7 1.8v2.2c0 .6-.6 1.1-1.2 1C6.6 13.1 2.9 9.4 1.6 3.6c-.2-.6.3-1.2 1-1.2h1z" />
          </svg>
          Позвонить
        </a>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="label flex min-h-[52px] items-center justify-center gap-2 bg-signal text-white"
          tabIndex={visible ? 0 : -1}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M8 1a7 7 0 0 0-6 10.6L1 15l3.5-.9A7 7 0 1 0 8 1Zm0 1.3a5.7 5.7 0 1 1-2.9 10.6l-.3-.2-2 .5.5-1.9-.2-.3A5.7 5.7 0 0 1 8 2.3Zm-2.2 3c-.2 0-.4.1-.6.3-.2.2-.7.7-.7 1.6s.7 1.9.8 2c.1.2 1.4 2.2 3.4 3 .5.2 1 .3 1.3.3.6 0 1-.1 1.3-.3.3-.2.6-.6.7-.9.1-.3.1-.6 0-.7l-1-.5c-.2-.1-.4-.1-.6.1l-.5.7c-.1.2-.3.2-.5.1a4.6 4.6 0 0 1-2.2-2c-.1-.2 0-.3.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.5-1.1c-.1-.3-.2-.3-.4-.3h-.5Z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
