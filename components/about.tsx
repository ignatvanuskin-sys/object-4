import { Eyebrow } from "@/components/ui";
import { Photo } from "@/components/photo";
import { site } from "@/lib/site";

const facts = [
  { label: "Город", value: `${site.city}, ${site.region}` },
  { label: "Адрес", value: `${site.addressShort} · индекс ${site.postalCode}` },
  { label: "Режим работы", value: site.hours },
  { label: "Оплата", value: site.payment.join(" · ") },
  { label: "Кроме квеста", value: site.extras.slice(0, 2).join(" · ") },
  { label: "Рядом", value: "Автостанция — 2 мин · 250 м · 16 парковок" },
];

export function About() {
  return (
    <section
      id="object"
      className="grid-lines relative isolate bg-paper text-ink"
      style={{ "--grid-color": "rgba(11,11,12,0.055)" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="01" tone="light">
            Объект
          </Eyebrow>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Statement */}
          <div className="lg:col-span-7">
            <h2
              className="display text-[clamp(1.9rem,4.6vw,3.75rem)] text-ink"
              data-reveal
              style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
            >
              Мы не показываем страшилки.
              <span className="text-ink/45"> Мы ставим вас внутрь них.</span>
            </h2>

            <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-10">
              <p
                className="text-[1.0625rem] leading-relaxed text-graphite"
                data-reveal
                style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              >
                {site.mark} {site.markIndex} — хоррор-квест в {site.city}, {site.region}. Две локации:
                «Дом проклятых» на 2–8 человек и «Пила» — одна команда до десяти. Внутри работают
                живые актёры: в отзывах на 2ГИС гости называют их по именам и отдельно благодарят
                администраторов.
              </p>
              <p
                className="text-[1.0625rem] leading-relaxed text-graphite"
                data-reveal
                style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
              >
                Помимо квестов в карточке компании указаны настольные игры и мафия, а гости
                отмечали здесь день рождения. Работаем ежедневно: записаться можно с полудня до
                полуночи — по телефону, в WhatsApp или заявкой с этой страницы.
              </p>
            </div>

            <dl
              className="mt-12 grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2"
              data-reveal
              style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
            >
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex flex-col gap-1.5 border-b border-ink/15 py-4 sm:py-5 ${
                    i % 2 === 0 ? "sm:border-r sm:pr-6" : "sm:pl-6"
                  }`}
                >
                  <dt className="label text-ink/45">{f.label}</dt>
                  <dd className="text-[0.9375rem] leading-snug text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Portrait of the location, deliberately dropped below the baseline of the text */}
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-24">
            <figure className="relative">
              <div data-reveal-clip>
                <div className="clip-target">
                  <Photo
                    id="about"
                    kind="tall"
                    alt="Лестница внутри локации «Объект №4»: тёмный пролёт, настенный светильник и рамы с кадрами на стене"
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    className="aspect-4/5 w-full object-cover"
                    position="50% 42%"
                  />
                </div>
              </div>
              <figcaption className="label mt-4 flex items-center gap-3 text-ink/40">
                <span className="h-px w-8 bg-ink/25" aria-hidden="true" />
                Локация объекта · фото опубликовано на 2ГИС
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
