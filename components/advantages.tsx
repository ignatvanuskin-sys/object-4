import { Eyebrow } from "@/components/ui";
import { advantages, site } from "@/lib/site";

const spec = [
  { value: site.rating, label: "рейтинг в 2ГИС" },
  { value: String(site.ratingsCount), label: "оценок" },
  { value: String(site.reviewsCount), label: "отзывов" },
  { value: "2", label: "локации" },
];

export function Advantages() {
  return (
    <section id="why" className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="04">Почему объект</Eyebrow>
        </div>

        {/* Numbers only from the company's 2GIS card. */}
        <dl
          className="mt-12 grid grid-cols-2 border-t border-white/12 lg:mt-16 lg:grid-cols-4"
          data-reveal
        >
          {spec.map((s, i) => (
            <div
              key={s.label}
              className={`border-b border-white/12 px-0 py-6 lg:border-b-0 lg:py-8 ${
                i < spec.length - 1 ? "lg:border-r lg:border-white/12 lg:pr-8" : ""
              } ${i % 2 === 0 ? "pr-4 lg:pr-8" : "pl-4 lg:pl-8"} ${
                i === 1 ? "lg:border-r lg:pl-8" : ""
              }`}
            >
              <dd className="num text-[clamp(2.25rem,5.4vw,3.75rem)] leading-none text-paper">
                {s.value}
              </dd>
              <dt className="label mt-3 text-paper/55">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2
                className="display text-[clamp(1.75rem,3.6vw,2.75rem)] text-paper"
                data-reveal
              >
                Шесть причин, каждая — из открытой карточки компании.
              </h2>
              <p
                className="measure mt-6 text-[0.9375rem] leading-relaxed text-paper/55"
                data-reveal
                style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
              >
                Ни одного пункта «мы лучшие на рынке». Только то, что можно проверить: карточка на
                2ГИС, опубликованные прайс-листы и отзывы гостей с подтверждённым посещением.
              </p>
            </div>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {advantages.map((a, i) => (
              <li
                key={a.index}
                className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-white/12 py-6 last:border-b sm:gap-x-8 sm:py-7"
                data-reveal
                style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}
              >
                <span className="num pt-1.5 text-[0.875rem] text-ember">{a.index}</span>
                <div>
                  <h3 className="display text-[clamp(1.25rem,2.6vw,1.75rem)] text-paper">
                    {a.title}
                  </h3>
                  <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-paper/60">
                    {a.text}
                  </p>
                  {a.source ? (
                    <p className="label mt-3 text-paper/50">Источник: {a.source}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
