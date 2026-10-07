"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Photo } from "@/components/photo";
import type { MediaKey, MediaKind } from "@/lib/media";

type Props = {
  id: MediaKey;
  kind?: MediaKind;
  title: string;
  caption?: string;
  sizes?: string;
  trigger: ReactNode;
  triggerClassName?: string;
};

/**
 * Full-screen viewer for a single photograph. Used for the published price
 * sheets and the atmosphere frames. Keeps the untouched 2GIS rendering — the
 * numbers on screen always match the original document.
 */
export function Lightbox({
  id,
  kind = "tall",
  title,
  caption,
  sizes = "(max-width: 1023px) 100vw, 50vw",
  trigger,
  triggerClassName = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {trigger}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          // Solid: the viewer covers the page, so transparency buys nothing and
          // color-mix() would drop the background on an older WebView.
          className="overscroll-contain safe-top fixed inset-0 z-[70] flex flex-col bg-ink"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/12 pad-x py-4">
            <p className="label text-paper/60">{title}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="label flex min-h-[44px] items-center gap-2 px-2 text-paper/85 transition-colors hover:text-paper"
            >
              Закрыть
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-auto pad-x py-6">
            <Photo
              id={id}
              kind={kind}
              alt={title}
              sizes="(max-width: 1023px) 92vw, 640px"
              className="mx-auto h-auto w-full max-w-[640px] object-contain"
            />
            {caption ? (
              <p className="measure mx-auto mt-5 text-[0.875rem] leading-relaxed text-paper/65">
                {caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
