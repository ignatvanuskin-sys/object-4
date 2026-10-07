import { About } from "@/components/about";
import { Advantages } from "@/components/advantages";
import { Atmosphere } from "@/components/atmosphere";
import { Contacts } from "@/components/contacts";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { Locations } from "@/components/locations";
import { Process } from "@/components/process";
import { Reviews } from "@/components/reviews";
import { Ticker } from "@/components/ticker";
import { faq } from "@/lib/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Locations />
      <Atmosphere />
      <Advantages />
      <Reviews />
      <Process />
      <Faq />
      <FinalCta />
      <Contacts />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
