/**
 * Responsive image manifest.
 * Every entry is a pre-rendered WebP variant produced by _tools/build-media.py
 * from the venue's own photographs published on the company's 2GIS card.
 * `color` is the dominant tone, used as the placeholder background so the
 * layout never flashes white / never shifts (CLS = 0).
 */

export type MediaVariant = { src: string; w: number; h: number };

export type MediaEntry = {
  color: string;
  wide?: MediaVariant[];
  tall?: MediaVariant[];
};

const v = (src: string, w: number, h: number): MediaVariant => ({ src, w, h });
const base = "/media";

export const media = {
  hero: {
    color: "#320208",
    wide: [
      v(`${base}/hero-wide-1920.webp`, 1920, 1080),
      v(`${base}/hero-wide-1280.webp`, 1280, 720),
      v(`${base}/hero-wide-820.webp`, 820, 461),
    ],
    tall: [
      v(`${base}/hero-tall-1200.webp`, 1200, 1680),
      v(`${base}/hero-tall-760.webp`, 760, 1064),
    ],
  },
  hall: {
    color: "#370308",
    wide: [
      v(`${base}/hall-wide-1600.webp`, 1600, 1000),
      v(`${base}/hall-wide-1100.webp`, 1100, 688),
      v(`${base}/hall-wide-700.webp`, 700, 438),
    ],
    tall: [
      v(`${base}/hall-tall-1200.webp`, 1200, 1600),
      v(`${base}/hall-tall-800.webp`, 800, 1067),
      v(`${base}/hall-tall-500.webp`, 500, 667),
    ],
  },
  stairs: {
    color: "#1a1614",
    wide: [
      v(`${base}/stairs-wide-1600.webp`, 1600, 1000),
      v(`${base}/stairs-wide-1100.webp`, 1100, 688),
      v(`${base}/stairs-wide-700.webp`, 700, 438),
    ],
    tall: [
      v(`${base}/stairs-tall-1200.webp`, 1200, 1600),
      v(`${base}/stairs-tall-800.webp`, 800, 1067),
      v(`${base}/stairs-tall-500.webp`, 500, 667),
    ],
  },
  corridor: {
    color: "#252320",
    wide: [
      v(`${base}/corridor-wide-1600.webp`, 1600, 1000),
      v(`${base}/corridor-wide-1100.webp`, 1100, 688),
      v(`${base}/corridor-wide-700.webp`, 700, 438),
    ],
    tall: [
      v(`${base}/corridor-tall-1200.webp`, 1200, 1600),
      v(`${base}/corridor-tall-800.webp`, 800, 1067),
      v(`${base}/corridor-tall-500.webp`, 500, 667),
    ],
  },
  mask: {
    color: "#181820",
    wide: [
      v(`${base}/mask-wide-1600.webp`, 1600, 1000),
      v(`${base}/mask-wide-1100.webp`, 1100, 688),
      v(`${base}/mask-wide-700.webp`, 700, 438),
    ],
    tall: [
      v(`${base}/mask-tall-1200.webp`, 1200, 1600),
      v(`${base}/mask-tall-800.webp`, 800, 1067),
      v(`${base}/mask-tall-500.webp`, 500, 667),
    ],
  },
  posters: {
    color: "#272321",
    wide: [
      v(`${base}/posters-wide-1600.webp`, 1600, 1000),
      v(`${base}/posters-wide-1100.webp`, 1100, 688),
      v(`${base}/posters-wide-700.webp`, 700, 438),
    ],
    tall: [
      v(`${base}/posters-tall-1200.webp`, 1200, 1600),
      v(`${base}/posters-tall-800.webp`, 800, 1067),
      v(`${base}/posters-tall-500.webp`, 500, 667),
    ],
  },
  about: {
    color: "#322b27",
    tall: [
      v(`${base}/about-tall-1100.webp`, 1100, 1375),
      v(`${base}/about-tall-700.webp`, 700, 875),
    ],
  },
  priceDom: {
    color: "#b48c69",
    tall: [
      v(`${base}/price-dom-1200.webp`, 1200, 2133),
      v(`${base}/price-dom-700.webp`, 700, 1244),
    ],
  },
  pricePilaA: {
    color: "#a58060",
    tall: [
      v(`${base}/price-pila-a-1200.webp`, 1200, 2133),
      v(`${base}/price-pila-a-700.webp`, 700, 1244),
    ],
  },
  pricePilaB: {
    color: "#a88262",
    tall: [
      v(`${base}/price-pila-b-1200.webp`, 1200, 2133),
      v(`${base}/price-pila-b-700.webp`, 700, 1244),
    ],
  },
} satisfies Record<string, MediaEntry>;

export type MediaKey = keyof typeof media;
export type MediaKind = "wide" | "tall";

export function srcSet(entry: MediaEntry, kind: MediaKind): string {
  const list = entry[kind] ?? entry.wide ?? entry.tall ?? [];
  return list.map((i) => `${i.src} ${i.w}w`).join(", ");
}

export function fallback(entry: MediaEntry, kind: MediaKind): MediaVariant {
  const list = entry[kind] ?? entry.wide ?? entry.tall ?? [];
  return list[Math.min(1, list.length - 1)];
}
