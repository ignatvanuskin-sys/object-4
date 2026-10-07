import { Eyebrow } from "@/components/ui";
import { featuredReview, reviews, site } from "@/lib/site";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className}`} aria-label="Оценка 5 из 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-3 w-3 fill-ember" aria-hidden="true">
          <path d="M6 0l1.6 3.9 4.2.35-3.2 2.8.98 4.1L6 9.02 2.42 11.15l.98-4.1-3.2-2.8 4.2-.35z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="bg-shale text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="05">
            Отзывы гостей
          </Eyebrow>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* Rating block */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="flex items-baseline gap-4" data-reveal>
                <span className="num text-[clamp(3.5rem,9vw,6rem)] leading-none text-paper">
                  {site.rating}
                </span>
                <span className="label pb-2 text-paper/55">из 5,0</span>
              </p>
              <Stars className="mt-4" />
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-paper/65" data-reveal>
                {site.ratingsCount} оценок и {site.reviewsCount} отзывов на 2ГИС. Каждый отзыв ниже
                помечен сервисом как подтверждённый посещением, оплатой или бронью.
              </p>
              <p className="label mt-5 text-paper/50">Источник — 2ГИС</p>
              <a
                href={site.twoGisReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="label wipe mt-6 inline-block text-paper"
              >
                Читать все {site.reviewsCount} отзывов →
              </a>
            </div>
          </div>

          {/* Featured + list */}
          <div className="lg:col-span-7 lg:col-start-6">
            <figure
              className="border-t border-white/14 pt-8"
              data-reveal
            >
              <Stars />
              <blockquote className="display mt-6 text-[clamp(1.5rem,3.4vw,2.5rem)] text-paper">
                «{featuredReview.text}»
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[0.9375rem] text-paper">{featuredReview.author}</span>
                <span className="label text-paper/55">{featuredReview.date}</span>
                <span className="label text-paper/55">· {featuredReview.visits}</span>
                <span className="label border border-white/14 px-2.5 py-1 text-paper/55">
                  Отзыв подтверждён
                </span>
              </figcaption>
            </figure>

            <ul className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {reviews.map((r, i) => (
                <li
                  key={`${r.author}-${r.date}`}
                  className="border-t border-white/12 py-6"
                  data-reveal
                  style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}
                >
                  <Stars className="mb-4" />
                  <p className="text-[0.9375rem] leading-relaxed text-paper/65">«{r.text}»</p>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[0.875rem] text-paper">{r.author}</span>
                    <span className="label text-paper/50">{r.date}</span>
                    {r.visits ? <span className="label text-paper/50">· {r.visits}</span> : null}
                    {r.meta ? <span className="label text-ember">{r.meta}</span> : null}
                  </p>
                </li>
              ))}
            </ul>

            <p className="label mt-8 text-paper/50">
              Тексты и имена авторов приведены без правок. Отзывы с оскорблениями и без текста в
              выборку не включены.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
