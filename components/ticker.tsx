import { site } from "@/lib/site";

const items = [
  `Хоррор-квест · ${site.city}`,
  `Две локации — «Дом проклятых» и «Пила»`,
  `Оценка ${site.rating} в 2ГИС · ${site.ratingsCount} оценок`,
  "Живые актёры внутри игры",
  `Ежедневно ${site.hoursShort}`,
  `${site.addressShort}`,
  "Настольные игры · мафия",
  "День рождения внутри локации",
];

/**
 * Technical ticker. Purely decorative, so it is hidden from assistive tech and
 * frozen for reduced-motion users.
 */
export function Ticker() {
  const row = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-white/10 bg-ink py-4"
      aria-hidden="true"
    >
      <div className="ticker-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="label flex items-center gap-10 text-paper/65">
            {item}
            <span className="inline-block h-1 w-1 bg-signal" />
          </span>
        ))}
      </div>
    </div>
  );
}
