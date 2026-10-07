import { Photo } from "@/components/photo";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="cta" className="relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <Photo
          id="mask"
          kind="wide"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover"
          position="50% 42%"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/45"
        aria-hidden="true"
      />
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="vignette absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-[min(100%,54rem)]">
          <p className="label text-paper/55" data-reveal>
            Запись · {site.city} · {site.hoursShort}
          </p>

          <h2
            className="display mt-6 text-[clamp(2.1rem,6.6vw,5.25rem)] text-paper"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Выберите вечер — дверь мы откроем.
          </h2>

          <p
            className="measure mt-7 text-[1.0625rem] leading-relaxed text-paper/85"
            data-reveal
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            Позвоните, напишите в WhatsApp или отправьте заявку. Администратор подтвердит время
            для вашего состава и назовёт итоговую сумму.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            data-reveal
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="label flex min-h-[56px] items-center justify-center gap-3 bg-signal px-8 text-white transition-colors duration-300 hover:bg-signal-deep"
            >
              Написать в WhatsApp
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={site.phoneHref}
              className="label flex min-h-[56px] items-center justify-center border border-white/30 px-8 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              {site.phoneLabel}
            </a>
          </div>

          <p className="label mt-8 text-paper/55">
            {site.addressFull}
          </p>
        </div>
      </div>
    </section>
  );
}
