"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui";
import { faq, site } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="07" tone="light">
            Что обычно спрашивают
          </Eyebrow>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2
                className="display text-[clamp(1.75rem,3.6vw,2.75rem)] text-ink"
                data-reveal
              >
                Отвечаем прямо. Где данных нет — так и говорим.
              </h2>
              <p
                className="measure mt-6 text-[0.9375rem] leading-relaxed text-graphite"
                data-reveal
                style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              >
                Цены и состав групп взяты из прайс-листов компании. Возрастные ограничения,
                хронометраж и условия переноса в открытых источниках не опубликованы — их
                подтверждает администратор.
              </p>

              <div
                className="mt-8 flex flex-col gap-3 border-t border-ink/15 pt-8"
                data-reveal
                style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              >
                <a href={site.phoneHref} className="display text-[1.5rem] text-ink">
                  {site.phoneLabel}
                </a>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label wipe self-start text-graphite"
                >
                  Написать в WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul>
              {faq.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li key={item.q} className="border-t border-ink/15 last:border-b">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-control-${i}`}
                        className="flex w-full items-center gap-5 py-5 text-left"
                      >
                        <span
                          className={`label num w-6 shrink-0 transition-colors duration-300 ${
                            isOpen ? "text-signal" : "text-ink/35"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[1.0625rem] leading-snug text-ink">
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`relative h-3 w-3 shrink-0 transition-transform duration-400 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        >
                          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-ink" />
                          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-ink" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-control-${i}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="measure pr-8 pb-6 pl-11 text-[0.9375rem] leading-relaxed text-graphite">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
