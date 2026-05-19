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
            Ready for a space that feels brand new?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-emerald-50">
            Book your first clean today or request a free quote. Our team responds
            quickly and makes scheduling simple.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              Book cleaning
            </Button>
            <Button
              href={`mailto:${siteConfig.email}`}
              variant="outline"
              className="border-white/50 text-white hover:border-white hover:bg-white/10"
            >
              Get a free quote
            </Button>
          </div>

          <ul className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <Phone className="h-4 w-4 shrink-0" />
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="hover:text-white"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-emerald-50">
              <MapPin className="h-4 w-4 shrink-0" />
              {siteConfig.location}
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
