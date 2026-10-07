import { Eyebrow } from "@/components/ui";
import { Lightbox } from "@/components/lightbox";
import { Photo } from "@/components/photo";
import type { MediaKey, MediaKind } from "@/lib/media";
import { site } from "@/lib/site";

type Tile = {
  id: MediaKey;
  kind: MediaKind;
  /** Mobile aspect ratio; the desktop row supplies the height instead. */
  aspect: string;
  caption: string;
  sizes: string;
};

/**
 * Frames published on the venue's own 2GIS card. One further candidate was
 * dropped outright: roughly a third of every possible crop of it is dead
 * black, which read as a hole in the grid rather than as a dark room.
 */
const rowOne: Tile[] = [
  {
    id: "stairs",
    kind: "wide",
    aspect: "aspect-16/10",
    caption: "Стена с кадрами вдоль лестницы",
    sizes: "(max-width: 1023px) 100vw, 66vw",
  },
  {
    id: "mask",
    kind: "tall",
    aspect: "aspect-3/4",
    caption: "Голубая подсветка, маска и часы на полке",
    sizes: "(max-width: 1023px) 100vw, 33vw",
  },
];

const rowTwo: Tile[] = [
  {
    id: "posters",
    kind: "tall",
    aspect: "aspect-3/4",
    caption: "Стена с кадрами и печатными листами",
    sizes: "(max-width: 1023px) 100vw, 33vw",
  },
  {
    id: "hall",
    kind: "wide",
    aspect: "aspect-16/10",
    caption: "Зал в красном свете — кадр сделан во время игры",
    sizes: "(max-width: 1023px) 100vw, 66vw",
  },
];

function Tile({ tile, delay = 0 }: { tile: Tile; delay?: number }) {
  return (
    <div className="flex h-full flex-col">
      {/* The curtain lives here; the observed marker is the grid cell above. */}
      <div
        className={`clip-target relative min-h-0 ${tile.aspect} lg:aspect-auto lg:flex-1`}
        style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      >
        <Lightbox
          id={tile.id}
          kind={tile.kind}
          title={tile.caption}
          caption="Фотография опубликована на карточке компании в 2ГИС."
          trigger={
            <span className="push group relative block h-full w-full overflow-hidden bg-ink-soft">
              <Photo
                id={tile.id}
                kind={tile.kind}
                alt={`${tile.caption} — локация «Объект №4» в Рудном`}
                sizes={tile.sizes}
                className="h-full w-full object-cover"
                position="50% 45%"
              />
              <span
                className="absolute inset-0 bg-ink/25 transition-opacity duration-500 group-hover:opacity-0"
                aria-hidden="true"
              />
              <span className="label absolute bottom-4 left-5 flex items-center gap-3 text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="h-px w-6 bg-signal" aria-hidden="true" />
                Увеличить
              </span>
            </span>
          }
          triggerClassName="block h-full w-full cursor-zoom-in"
        />
      </div>
      <p className="label mt-3 hidden shrink-0 text-paper/55 lg:block">{tile.caption}</p>
    </div>
  );
}

export function Atmosphere() {
  return (
    <section id="atmosphere" className="bg-shale text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal>
          <Eyebrow index="03">
            Атмосфера
          </Eyebrow>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="display max-w-[26ch] text-[clamp(1.9rem,4.4vw,3.5rem)] text-paper"
            data-reveal
          >
            Фотографии сделаны внутри объекта — не в студии.
          </h2>
          <p
            className="measure text-[0.9375rem] leading-relaxed text-paper/65 lg:max-w-[36ch]"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            Все кадры — из фотоальбома компании на 2ГИС: без стоковых фотографий и рендеров. Здесь
            показана сама локация; остальные снимки — по ссылке ниже.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:gap-6 lg:mt-16 lg:h-[clamp(400px,43vw,620px)] lg:grid-cols-12">
          <div className="lg:col-span-8" data-reveal-clip>
            <Tile tile={rowOne[0]} />
          </div>
          <div className="lg:col-span-4" data-reveal-clip>
            <Tile tile={rowOne[1]} delay={90} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:gap-6 lg:mt-6 lg:h-[clamp(340px,37vw,520px)] lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal-clip>
            <Tile tile={rowTwo[0]} />
          </div>
          <div className="lg:col-span-8" data-reveal-clip>
            <Tile tile={rowTwo[1]} delay={90} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-paper/55">{site.galleryPhotos} фотографий · фотоальбом 2ГИС</p>
          <a
            href={site.twoGisGallery}
            target="_blank"
            rel="noopener noreferrer"
            className="label wipe self-start text-paper sm:self-auto"
          >
            Смотреть весь альбом на 2ГИС →
          </a>
        </div>
      </div>
    </section>
  );
}
