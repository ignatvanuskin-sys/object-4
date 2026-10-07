"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, site } from "@/lib/site";

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5 leading-none">
      <span
        className={`display text-paper ${compact ? "text-[1.05rem]" : "text-[1.25rem]"} tracking-[0.02em]`}
      >
        {site.mark}
      </span>
      <span className="num text-ember text-[0.9rem] leading-none">{site.markIndex}</span>
    </span>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-white/10 bg-ink/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
          <Link
            href="#top"
            aria-label={`${site.mark} ${site.markIndex} — на начало страницы`}
            className="flex min-h-11 items-center"
          >
            <Wordmark />
          </Link>

          <nav aria-label="Основная навигация" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label wipe text-paper/65 transition-colors duration-300 hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={site.phoneHref}
              className="label hidden text-paper/70 transition-colors duration-300 hover:text-paper md:inline-block"
            >
              {site.phoneLabel}
            </a>
            <Link
              href="#contacts"
              className="label inline-flex min-h-[44px] items-center border border-signal bg-signal px-4 text-white transition-colors duration-300 hover:bg-signal-deep sm:px-5"
            >
              Записаться
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`block h-px w-6 bg-paper transition-transform duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-paper transition-transform duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu — full screen, not a reduced desktop bar. */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-ink transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="grid-lines flex h-full flex-col justify-between pt-24 pb-8">
          <nav aria-label="Мобильная навигация" className="px-5 sm:px-8">
            <ul>
              {navItems.map((item, i) => (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <span className="label num text-ember w-8 shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-[1.75rem] text-paper sm:text-[2.25rem]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-5 sm:px-8">
            <div className="mb-6 space-y-2">
              <a
                href={site.phoneHref}
                className="display inline-flex min-h-11 items-center text-[1.5rem] text-paper"
                onClick={() => setOpen(false)}
              >
                {site.phoneLabel}
              </a>
              <p className="label text-paper/60">
                {site.city} · {site.hoursShort}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex min-h-[52px] items-center justify-center bg-signal text-white"
                onClick={() => setOpen(false)}
              >
                WhatsApp
              </a>
              <Link
                href="#contacts"
                className="label flex min-h-[52px] items-center justify-center border border-white/25 text-paper"
                onClick={() => setOpen(false)}
              >
                Заявка
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
