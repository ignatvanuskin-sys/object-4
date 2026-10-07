import Link from "next/link";
import type { ReactNode } from "react";

/** Micro technical label: `[ 02 ] ЛОКАЦИИ` with a hairline running to the edge. */
export function Eyebrow({
  index,
  children,
  tone = "dark",
  className = "",
}: {
  index?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const line = tone === "dark" ? "bg-white/15" : "bg-ink/15";
  const dim = tone === "dark" ? "text-white/45" : "text-ink/45";
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <span className={`label ${dim} shrink-0`}>
        {index ? `[ ${index} ]` : null} {children}
      </span>
      <span className={`h-px flex-1 ${line}`} aria-hidden="true" />
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light" | "ghost";
  className?: string;
  ariaLabel?: string;
  external?: boolean;
};

const base =
  "group relative inline-flex min-h-[52px] items-center justify-center gap-3 px-7 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300";

const variants: Record<string, string> = {
  solid: "bg-signal text-white hover:bg-signal-deep",
  outline: "border border-white/25 text-paper hover:border-transparent hover:bg-paper hover:text-ink",
  light: "bg-ink text-paper hover:bg-signal",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

/** Buttons are links by design: the two conversions are call and WhatsApp. */
export function ActionLink({
  href,
  children,
  variant = "solid",
  className = "",
  ariaLabel,
  external,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** Arrow glyph used across interactive rows — a bare dash that extends on hover. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      className={`h-3 w-6 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M0 6h22M17 1.2 22.2 6 17 10.8" />
    </svg>
  );
}
