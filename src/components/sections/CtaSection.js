import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { SECTION_PADDING } from "@/lib/constants";

export function CtaSection() {
  return (
    <section
      id="contact"
      className={`relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 ${SECTION_PADDING}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Хотите вернуться в чистое пространство без лишних забот?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-emerald-50">
            Оставьте заявку, и мы поможем подобрать формат уборки, рассчитать
            стоимость и выбрать удобное время.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="#contact"
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              {siteConfig.ctaQuote}
            </Button>
            <Button
              href="#services"
              variant="outline"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              Посмотреть услуги
            </Button>
          </div>

          <ul className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-8">
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Телефон:</span>
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="hover:text-white"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Email:</span>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {siteConfig.location}
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
