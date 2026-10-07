"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const items = [
  `Хоррор-квест · ${site.city}`,
  `Две локации — «Дом проклятых» и «Пила»`,
  `Оценка ${site.rating} в 2ГИС · ${site.ratingsCount} оценок`,
  "Живые актёры внутри игры",
  `Ежедневно ${site.hoursShort}`,
  `${site.addressShort}`,
  "Настольные игры · мафия",
  "День рождения внутри локации",
];

/**
 * Technical ticker with a pause control.
 *
 * The strip loops for 46 seconds, which puts it squarely inside WCAG 2.2.2:
 * motion that starts automatically and runs for more than five seconds needs a
 * mechanism to stop it. `prefers-reduced-motion` honours a preference, but a
 * preference is not a control, so the button exists for everyone else.
 *
 * The scrolling track stays `aria-hidden`, and the button deliberately lives
 * outside that subtree — inside it, the control would be hidden from assistive
 * tech as well.
 */
export function Ticker() {
  const [paused, setPaused] = useState(false);
  const row = [...items, ...items];

  return (
    <div className="relative border-y border-white/10 bg-ink">
      <div className="overflow-hidden py-4 pr-16" aria-hidden="true">
        <div
          className="ticker-track flex w-max items-center gap-10 whitespace-nowrap"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {row.map((item, i) => (
            <span key={i} className="label flex items-center gap-10 text-paper/55">
              {item}
              <span className="inline-block h-1 w-1 bg-ember" />
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? "Возобновить бегущую строку" : "Остановить бегущую строку"}
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center border-l border-white/10 text-paper/70 transition-colors hover:bg-white/5 hover:text-paper active:bg-white/10"
      >
        <span aria-hidden="true" className="flex h-3.5 items-center justify-center">
          {paused ? (
            <svg viewBox="0 0 10 12" className="h-3 w-2.5 fill-current">
              <path d="M0 0l10 6-10 6z" />
            </svg>
          ) : (
            <span className="flex gap-[3px]">
              <span className="block h-3 w-[3px] bg-current" />
              <span className="block h-3 w-[3px] bg-current" />
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
