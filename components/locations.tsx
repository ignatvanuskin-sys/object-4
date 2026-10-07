"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow, Eyebrow } from "@/components/ui";
import { Lightbox } from "@/components/lightbox";
import { Photo } from "@/components/photo";
import { locations, site, type Location } from "@/lib/site";

function priceMax(loc: Location) {
  return Math.max(...loc.prices.map((p) => Number(p.price.replace(/\D/g, ""))));
}

/** Price grid: composition, a proportional rule, and the price itself. */
function PriceTable({ loc }: { loc: Location }) {
  const max = priceMax(loc);

  return (
    <div className="border-t border-white/12">
      <div className="flex items-baseline justify-between py-3">
        <span className="label text-paper/55">Состав</span>
        <span className="label text-paper/55">Стоимость</span>
      </div>
      <ul>
        {loc.prices.map((row) => {
          const value = Number(row.price.replace(/\D/g, ""));
          return (
            <li
              key={row.players}
              className={`flex items-center gap-4 border-t border-white/10 py-3 ${
                row.highlight ? "text-paper" : "text-paper/75"
              }`}
            >
              <span className="w-24 shrink-0 text-[0.9375rem] sm:w-30">{row.players}</span>
              <span className="hidden h-px flex-1 sm:block" aria-hidden="true">
                <span
                  className={`block h-px ${row.highlight ? "bg-signal" : "bg-white/25"}`}
                  style={{ width: `${Math.round((value / max) * 100)}%` }}
                />
              </span>
              <span className="num ml-auto shrink-0 text-[1.0625rem] tracking-wide sm:ml-0">
                {row.price}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LocationDetail({ loc }: { loc: Location }) {
  return (
    <div className="grid gap-6 lg:gap-8">
      <p className="measure text-[0.9375rem] leading-relaxed text-paper/85">{loc.lead}</p>

      <dl className="grid grid-cols-1 gap-px overflow-hidden border-y border-white/12 sm:grid-cols-3">
        {loc.facts.map((f) => (
          <div key={f.label} className="bg-white/[0.02] px-4 py-3.5">
            <dt className="label text-paper/55">{f.label}</dt>
            <dd className="mt-1.5 text-[0.875rem] text-paper/90">{f.value}</dd>
          </div>
        ))}
      </dl>

      <PriceTable loc={loc} />

      <div className="grid gap-2">
        <p className="text-[0.8125rem] leading-relaxed text-paper/55">{loc.priceNote}</p>
        {loc.priceCaveat ? (
          <p className="text-[0.8125rem] leading-relaxed text-ember/80">{loc.priceCaveat}</p>
        ) : null}
        <p className="text-[0.75rem] leading-relaxed text-paper/55">
          Прайс-лист опубликован компанией на 2ГИС. Итоговую сумму подтверждает администратор.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="#contacts"
          className="label flex min-h-[50px] items-center justify-center bg-signal px-6 text-white transition-colors duration-300 hover:bg-signal-deep"
        >
          Записаться
        </Link>
        <Lightbox
          id={loc.priceSheet.mediaKey}
          kind="tall"
          title={loc.priceSheet.label}
          caption="Прайс-лист в том виде, в котором он опубликован компанией на 2ГИС."
          trigger={
            <span className="label flex min-h-[50px] items-center justify-center gap-3 border border-white/25 px-6 transition-colors duration-300 group-hover:border-paper">
              Показать прайс-лист
            </span>
          }
          triggerClassName="group flex-1"
        />
      </div>
    </div>
  );
}

export function Locations() {
  const [active, setActive] = useState(0);
  const current = locations[active];

  return (
    <section id="locations" className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="02">Локации и цены</Eyebrow>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="display max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.5rem)] text-paper"
            data-reveal
          >
            Две локации. Разная вместимость — разная цена.
          </h2>
          <p
            className="measure text-[0.9375rem] leading-relaxed text-paper/55 lg:max-w-[34ch]"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Обе цены ниже — из прайс-листов, опубликованных компанией на 2ГИС.
          </p>
        </div>

        {/* ------------------------------------------------------------------
            Mobile and tablet: both locations are laid out in full. No tabs,
            no hidden prices, no hover-only behaviour.
            ------------------------------------------------------------------ */}
        <div className="mt-12 grid gap-16 lg:hidden">
          {locations.map((loc) => (
            <article key={loc.id}>
              <div className="relative aspect-3/2 overflow-hidden bg-ink-soft">
                <Photo
                  id={loc.mediaKey}
                  kind="wide"
                  alt={`Локация «${loc.name}» — интерьер «Объекта №4»`}
                  sizes="100vw"
                  className="h-full w-full object-cover"
                  position="50% 45%"
                />
              </div>
              <p className="label mt-6 text-ember">
                {loc.index} · {loc.kind}
              </p>
              <h3 className="display mt-2 text-[clamp(1.75rem,6vw,2.25rem)] text-paper">
                {loc.name}
              </h3>
              <div className="mt-6">
                <LocationDetail loc={loc} />
              </div>
            </article>
          ))}
        </div>

        {/* ------------------------------------------------------------------
            Desktop: switcher on the left, one shared detail panel on the right.
            ------------------------------------------------------------------ */}
        <div className="mt-16 hidden gap-14 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="border-t border-white/12">
              {locations.map((loc, i) => {
                const isActive = i === active;
                return (
                  <li key={loc.id} className="border-b border-white/12">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-expanded={isActive}
                        aria-controls="loc-detail"
                        className="group flex w-full items-center gap-5 py-6 text-left"
                      >
                        <span
                          className={`label num w-8 shrink-0 transition-colors duration-300 ${
                            isActive ? "text-ember" : "text-paper/55"
                          }`}
                        >
                          {loc.index}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`display block text-[clamp(1.5rem,3.4vw,2.25rem)] transition-colors duration-300 ${
                              isActive ? "text-paper" : "text-paper/55 group-hover:text-paper"
                            }`}
                          >
                            {loc.name}
                          </span>
                          <span className="label mt-2 block text-paper/55">
                            {loc.kind} · {loc.capacity}
                          </span>
                        </span>

                        <span className="hidden shrink-0 text-right sm:block">
                          <span className="label block text-paper/55">от</span>
                          <span className="num block text-[1.0625rem] text-paper">{loc.from}</span>
                        </span>

                        <Arrow
                          className={`shrink-0 transition-[transform,color] duration-400 ${
                            isActive
                              ? "translate-x-0 text-ember"
                              : "-translate-x-2 text-paper/65 group-hover:translate-x-0 group-hover:text-paper"
                          }`}
                        />
                      </button>
                    </h3>
                  </li>
                );
              })}
            </ul>

            <div
              id="loc-detail"
              aria-live="polite"
              className="mt-10 border-t border-white/12 pt-10"
            >
              <LocationDetail loc={current} />
            </div>

            <p className="mt-8 text-[0.8125rem] leading-relaxed text-paper/55">
              Все {site.galleryPhotos} фотографий объекта, включая прайс-листы, опубликованы в{" "}
              <a
                href={site.twoGisGallery}
                target="_blank"
                rel="noopener noreferrer"
                className="wipe text-paper/85"
              >
                фотоальбоме на 2ГИС
              </a>
              .
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative aspect-3/4 overflow-hidden bg-ink-soft">
                {locations.map((loc, i) => (
                  <Photo
                    key={loc.id}
                    id={loc.mediaKey}
                    kind="tall"
                    alt={`Локация «${loc.name}» — интерьер «Объекта №4»`}
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                    position="50% 45%"
                  />
                ))}
                <span
                  className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent"
                  aria-hidden="true"
                />
                <span className="label absolute bottom-5 left-5 text-paper/75">
                  {current.index} · {current.name}
                </span>
              </div>
              <p className="label mt-4 text-paper/55">
                Интерьер локации · фото из альбома 2ГИС
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
