"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui";
import { processSteps } from "@/lib/site";

export function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const index = nodes.indexOf(visible[0].target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const progress = ((active + 1) / processSteps.length) * 100;

  return (
    <section id="how" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="06">Как записаться</Eyebrow>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <h2
            className="display text-[clamp(1.9rem,4.4vw,3.5rem)] text-paper lg:col-span-7"
            data-reveal
          >
            От сообщения до закрытой двери — шесть шагов.
          </h2>
          <p
            className="measure text-[0.9375rem] leading-relaxed text-paper/55 lg:col-span-4 lg:col-start-9"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Никакой регистрации и личного кабинета. Запись идёт через телефон, WhatsApp или заявку —
            администратор подтверждает время и состав.
          </p>
        </div>

        {/* Scroll-linked progress: six ticks, one fills. */}
        <div className="mt-12 lg:mt-16" aria-hidden="true">
          <div className="flex gap-1.5">
            {processSteps.map((s, i) => (
              <span key={s.index} className="h-px flex-1 bg-white/15">
                <span
                  className="block h-px bg-signal transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: i <= active ? "100%" : "0%" }}
                />
              </span>
            ))}
          </div>
          <p className="label mt-3 text-paper/55">
            Этап {String(active + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
            <span className="sr-only"> — прогресс {Math.round(progress)}%</span>
          </p>
        </div>

        <ol className="mt-8">
          {processSteps.map((step, i) => {
            const isActive = i === active;
            return (
              <li
                key={step.index}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                // Dimming is done with colour, not row opacity: `opacity-45`
                // multiplied into the child text and dropped it to ~2:1, which
                // axe flagged on 10 nodes. Colour-only dimming keeps the
                // hierarchy and stays above 4.5:1.
                className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/12 py-6 sm:gap-x-10 sm:py-8"
              >
                <span
                  className={`num pt-1 text-[0.875rem] transition-colors duration-500 ${
                    isActive ? "text-ember" : "text-paper/55"
                  }`}
                >
                  {step.index}
                </span>
                <div
                  className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive ? "translate-x-0 lg:translate-x-2" : "translate-x-0"
                  }`}
                >
                  <h3
                    className={`display text-[clamp(1.25rem,2.8vw,2rem)] transition-colors duration-500 ${
                      isActive ? "text-paper" : "text-paper/70"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`measure mt-3 text-[0.9375rem] leading-relaxed transition-colors duration-500 ${
                      isActive ? "text-paper/85" : "text-paper/60"
                    }`}
                  >
                    {step.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
