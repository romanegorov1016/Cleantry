import Link from "next/link";
import { navigationItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-emerald-700"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button href="#contact" className="hidden sm:inline-flex text-sm px-5">
              {siteConfig.ctaQuote}
            </Button>
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
