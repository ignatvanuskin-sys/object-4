import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.mark} ${site.markIndex} — ${site.tagline} в ${site.cityIn}`,
    short_name: `${site.mark} ${site.markIndex}`,
    description:
      `Хоррор-квест с живыми актёрами в ${site.cityIn}. Две локации: «Дом проклятых» и «Пила». ` +
      `Запись ежедневно ${site.hoursShort}.`,
    lang: "ru",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050506",
    theme_color: "#050506",
    categories: ["entertainment", "games"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
