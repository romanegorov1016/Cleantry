"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/config/navigation";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-emerald-50"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 border-b border-emerald-100 bg-white shadow-lg transition-all duration-200",
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-slate-100 pt-2">
            <Button href="#contact" className="w-full">
              Get a Quote
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
