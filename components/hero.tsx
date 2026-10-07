import Link from "next/link";
import { Photo } from "@/components/photo";
import { media, srcSet } from "@/lib/media";
import { site } from "@/lib/site";

const strip = [
  { label: "2ГИС", value: `${site.rating} · ${site.ratingsCount} оценок`, href: site.twoGisReviews },
  { label: "Адрес", value: `${site.city}, ${site.addressShort}`, href: site.twoGisRoute },
  // Non-breaking spaces bind the time range together so that on a narrow phone
  // the line breaks after "Ежедневно," instead of leaving a dangling dash.
  { label: "Режим", value: site.hours.replace(" — ", "\u00a0—\u00a0"), href: null },
  { label: "Телефон", value: site.phoneLabel, href: site.phoneHref },
];

export function Hero() {
  return (
    // The section, not the inner wrapper, owns the viewport height: with the
    // min-height on both, the info strip was pushed 107px past the fold and
    // only became visible after a scroll. Here the hero copy flexes to fill
    // whatever the strip leaves over.
    <section id="top" className="screen-h relative isolate flex flex-col overflow-hidden bg-ink">
      {/* Art direction: a portrait crop for phones, the cinematic 16:9 for desktop. */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={srcSet(media.hero, "tall")}
          sizes="100vw"
          type="image/webp"
        />
        <img
          src={media.hero.wide![0].src}
          srcSet={srcSet(media.hero, "wide")}
          sizes="100vw"
          width={media.hero.wide![0].w}
          height={media.hero.wide![0].h}
          alt="Красный свет в зале локации «Объект №4» — силуэты гостей сняты со вспышкой"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="absolute inset-0 h-full w-full object-cover object-[52%_44%]"
          style={{ backgroundColor: media.hero.color }}
        />
      </picture>

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/55"
        aria-hidden="true"
      />
      {/* Stronger scrim on the text side: the second half of the H1 sits on a
          busy, bright part of the photograph. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent"
        aria-hidden="true"
      />
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="vignette absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="flex-1" />

        {/* Tightened so that the hero plus the info strip fit inside one
            viewport on a 1440x900 laptop — at the old scale the strip was cut
            to a 10px sliver at the bottom edge, which read as a broken layout. */}
        <div className="max-w-[min(100%,60rem)] pb-8 lg:pb-10">
          <p
            className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/60"
            data-reveal
          >
            <span className="text-ember">{site.city}</span>
            <span aria-hidden="true" className="h-px w-6 bg-white/25" />
            <span>{site.region}</span>
            <span aria-hidden="true" className="h-px w-6 bg-white/25" />
            <span>{site.tagline}</span>
          </p>

          <h1
            className="display mt-5 text-[clamp(2.1rem,6.2vw,5.5rem)] text-paper"
            data-reveal
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            Вход добровольный.
            <br />
            <span className="text-paper/75">Выход — по правилам объекта.</span>
          </h1>

          <p
            className="measure mt-6 text-[1.0625rem] leading-relaxed text-paper/85 lg:text-[1.125rem]"
            data-reveal
            style={{ "--reveal-delay": "170ms" } as React.CSSProperties}
          >
            Иммерсивный хоррор-квест в Рудном. Две локации — «Дом проклятых» и «Пила»,
            актёры внутри игры и оценка {site.rating} в 2ГИС при {site.ratingsCount} оценках.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            data-reveal
            style={{ "--reveal-delay": "250ms" } as React.CSSProperties}
          >
            <Link
              href="#contacts"
              className="label flex min-h-[56px] items-center justify-center bg-signal px-8 text-white transition-colors duration-300 hover:bg-signal-deep"
            >
              Записаться на квест
            </Link>
            <Link
              href="#locations"
              className="label flex min-h-[56px] items-center justify-center border border-white/30 px-8 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              Локации и цены
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll affordance — a hairline, not a bouncing arrow. */}
      <div
        className="pointer-events-none absolute right-8 bottom-40 z-10 hidden flex-col items-center gap-4 lg:flex xl:right-12"
        aria-hidden="true"
      >
        <span className="label [writing-mode:vertical-rl] text-paper/70">Листать</span>
        <span className="block h-20 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* Solid, for the same WebView reason as the header: this strip sits on
          top of the photograph, so it must not depend on color-mix(). */}
      <div className="relative z-10 border-t border-white/12 bg-ink">
        <dl className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
          {strip.map((item, i) => (
            <div
              key={item.label}
              className={`min-w-0 border-white/12 pad-x py-5 ${
                i % 2 === 0 ? "border-r" : ""
              } ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 2 ? "lg:border-r" : ""}`}
            >
              <dt className="label text-paper/55">{item.label}</dt>
              {/* No `truncate`: at 320px it cut the address down to
                  "Рудный, Район Авто…". The cell wraps instead. */}
              <dd className="mt-2 text-[0.9375rem] leading-snug text-paper/90">
                {item.href ? (
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="wipe inline-flex min-h-11 items-center "
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
