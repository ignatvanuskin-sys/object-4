import { BookingForm } from "@/components/booking-form";
import { Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

const osmEmbed =
  "https://www.openstreetmap.org/export/embed.html?bbox=63.147533%2C52.966144%2C63.153533%2C52.969144&layer=mapnik&marker=52.967644%2C63.150533";

const links = [
  { label: "Карточка на 2ГИС", href: site.twoGisCard },
  { label: "Построить маршрут", href: site.twoGisRoute },
  { label: "Отзывы на 2ГИС", href: site.twoGisReviews },
  { label: "Фотоальбом", href: site.twoGisGallery },
];

export function Contacts() {
  return (
    <section id="contacts" className="bg-shale text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="08">
            Контакты
          </Eyebrow>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <h2
              className="display text-[clamp(1.9rem,4.4vw,3.25rem)] text-paper"
              data-reveal
            >
              Связаться — один шаг.
            </h2>

            <a
              href={site.phoneHref}
              className="display mt-8 inline-flex min-h-11 items-center text-[clamp(1.75rem,4.4vw,2.75rem)] text-paper transition-colors duration-300 hover:text-ember"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              {site.phoneLabel}
            </a>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex min-h-[52px] flex-1 items-center justify-center bg-signal px-6 text-white transition-colors duration-300 hover:bg-signal-deep"
              >
                WhatsApp
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex min-h-[52px] flex-1 items-center justify-center border border-white/20 px-6 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-paper"
              >
                Instagram
              </a>
            </div>

            <dl className="mt-12 border-t border-white/12" data-reveal>
              {[
                { label: "Адрес", value: site.addressFull },
                { label: "Режим работы", value: site.hours },
                { label: "Оплата", value: site.payment.join(" · ") },
                { label: "Рядом", value: site.surroundings.map((s) => `${s.label} — ${s.value}`).join(" · ") },
                { label: "Координаты", value: `${site.coords.lat}, ${site.coords.lon}` },
                { label: "Instagram", value: `${site.instagramHandle} · ${site.instagramFollowers} подписчиков` },
                { label: "Кроме квеста", value: site.extras.join(" · ") },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`grid gap-1.5 py-4 sm:grid-cols-[minmax(140px,1fr)_2fr] sm:gap-6 sm:py-5 ${
                    i < arr.length - 1 ? "border-b border-white/12" : ""
                  }`}
                >
                  <dt className="label text-paper/55">{row.label}</dt>
                  <dd className="text-[0.9375rem] leading-relaxed text-paper">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label wipe inline-flex min-h-11 items-center text-paper/85"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal>
              <BookingForm />
            </div>
          </div>
        </div>

        {/* Real map, real coordinates. Highlighted with a light grade so it sits in the layout. */}
        <div className="mt-14 border-t border-white/12 pt-8" data-reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-4">
              <p className="display text-[1.5rem] text-paper">
                {site.city}, {site.addressShort}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper/65">
                Ориентир по 2ГИС — автостанция: 2 минуты, 250 метров. Парковка — 16 мест. Режим
                работы: {site.hours}.
              </p>
              <a
                href={site.twoGisRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-6 inline-flex min-h-[50px] items-center border border-white/20 px-6 transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-paper"
              >
                Открыть в 2ГИС →
              </a>
            </div>

            <div className="relative aspect-16/10 border border-white/12 lg:col-span-7 lg:col-start-6 lg:aspect-16/9">
              {/* Designed fallback: visible while the tiles stream in, and it stays
                  readable if the tile server is slow or blocked. */}
              <div
                className="grid-lines absolute inset-0 flex flex-col items-start justify-end gap-3 bg-shale-2 p-6"
                style={{ "--grid-color": "rgba(231,227,219,0.06)" } as React.CSSProperties}
                aria-hidden="true"
              >
                <span className="label flex items-center gap-3 text-paper/55">
                  <span className="inline-block h-2 w-2 bg-signal" />
                  Координаты · {site.coords.lat}, {site.coords.lon}
                </span>
                <p className="display text-[1.25rem] text-paper">
                  {site.city}, {site.addressShort}
                </p>
              </div>
              <iframe
                src={osmEmbed}
                title={`Карта: ${site.city}, ${site.addressShort}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-10 h-full w-full grayscale-[0.25]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
