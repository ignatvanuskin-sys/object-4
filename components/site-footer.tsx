import Link from "next/link";
import { navItems, site, year } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="flex items-baseline gap-2">
              <span className="display text-[2rem] text-paper">{site.mark}</span>
              <span className="num text-[1.25rem] text-ember">{site.markIndex}</span>
            </p>
            <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-paper/55">
              {site.tagline} в {site.city}, {site.region}. Две локации — «Дом проклятых» и «Пила».
            </p>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-7 inline-flex min-h-[50px] items-center bg-signal px-6 text-white transition-colors duration-300 hover:bg-signal-deep"
            >
              WhatsApp
            </a>
          </div>

          <nav aria-label="Навигация в подвале" className="lg:col-span-3">
            <p className="label text-paper/55">Разделы</p>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="wipe text-[0.9375rem] text-paper/75">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="label text-paper/55">Контакты</p>
            <ul className="mt-5 space-y-4">
              <li>
                <a href={site.phoneHref} className="wipe text-[0.9375rem] text-paper/90">
                  {site.phoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wipe text-[0.9375rem] text-paper/75"
                >
                  {site.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={site.twoGisCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wipe text-[0.9375rem] text-paper/75"
                >
                  2ГИС · {site.rating}
                </a>
              </li>
              <li className="text-[0.9375rem] leading-relaxed text-paper/55">
                {site.addressFull}
              </li>
              <li className="text-[0.9375rem] text-paper/55">{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[0.75rem] leading-relaxed text-paper/55">
            Рейтинг, отзывы, адрес, режим работы, способы оплаты, прайс-листы и фотографии взяты из
            открытой карточки компании на 2ГИС. Стоимость указана по опубликованным прайс-листам и
            не является публичной офертой: итоговую сумму для конкретного состава подтверждает
            администратор. Ссылки на Instagram — на официальный аккаунт {site.instagramHandle}.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="label text-paper/55">
              © {year} {site.mark} {site.markIndex} · {site.city}
            </p>
            <p className="label text-paper/55">Запись ежедневно {site.hoursShort}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
