import { fallback, media, srcSet, type MediaKey, type MediaKind } from "@/lib/media";

type PhotoProps = {
  id: MediaKey;
  kind?: MediaKind;
  alt: string;
  /** Layout width descriptor. Be precise — this is what keeps LCP and bandwidth low. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** CSS object-position, e.g. "50% 30%". */
  position?: string;
};

/**
 * Responsive <picture>-equivalent for pre-rendered WebP variants.
 * Server component: zero JS shipped. Width/height are always set, and the
 * variant's dominant colour is painted as a background so there is no
 * white flash and no layout shift while the image decodes.
 */
export function Photo({
  id,
  kind = "wide",
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  style,
  position,
}: PhotoProps) {
  const entry = media[id];
  const fb = fallback(entry, kind);

  return (
    <img
      src={fb.src}
      srcSet={srcSet(entry, kind)}
      sizes={sizes}
      width={fb.w}
      height={fb.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      draggable={false}
      className={className}
      style={{
        backgroundColor: entry.color,
        objectPosition: position,
        ...style,
      }}
    />
  );
}
