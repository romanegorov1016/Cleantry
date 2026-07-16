import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { siteConfig } from "@/config/site";
import {
  SECTION_IDS,
  SECTION_PADDING,
  SECTION_SCROLL_MARGIN,
} from "@/lib/constants";

export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.hero}
      className={`relative overflow-hidden bg-gradient-to-b from-cleantry-mint/60 via-white to-cleantry-beige/30 ${SECTION_PADDING} ${SECTION_SCROLL_MARGIN}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-xl lg:max-w-none">
            <Badge>Профессиональная уборка без лишней суеты</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.1rem]">
              Уборка, после которой{" "}
              <span className="text-emerald-600">дома снова легко дышится</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Cleantry помогает с уборкой квартир, домов и офисов, берёт на себя
              уборку после ремонта и регулярное поддержание чистоты — с понятным
              расчётом, аккуратной командой и вниманием к деталям.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#calculator">{siteConfig.ctaQuote}</Button>
              <Button href="#services" variant="outline">
                Посмотреть услуги
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
