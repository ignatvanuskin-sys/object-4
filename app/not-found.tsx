import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Такой страницы на сайте нет.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center bg-ink text-paper">
      <div
        className="grid-lines absolute inset-0"
        style={{ "--grid-color": "rgba(231,227,219,0.04)" } as React.CSSProperties}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 py-28 sm:px-8 lg:px-12">
        <p className="label text-ember">Ошибка 404</p>

        <h1 className="display mt-6 max-w-[18ch] text-[clamp(2rem,6.4vw,4.75rem)] text-paper">
          Этой страницы нет.
        </h1>

        <p className="measure mt-7 text-[1.0625rem] leading-relaxed text-paper/85">
          Ссылка устарела или адрес набран с ошибкой. Сам объект на месте: {site.cityIn},{" "}
          {site.addressShort}. Работаем ежедневно, {site.hoursShort}.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="label flex min-h-[54px] items-center justify-center bg-signal px-8 text-white transition-colors duration-300 hover:bg-signal-deep"
          >
            На главную
          </Link>
          <a
            href={site.phoneHref}
            className="label flex min-h-[54px] items-center justify-center border border-white/25 px-8 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
          >
            {site.phoneLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
