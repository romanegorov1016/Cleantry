"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const HERO_IMAGE = "/images/hero/clean-bedroom.webp";

export function HeroVisual() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-100/80 to-teal-50/60 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white p-3 pb-10 shadow-xl shadow-emerald-900/10 sm:pb-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-cleantry-beige to-teal-50">
          {!imageError ? (
            <Image
              src={HERO_IMAGE}
              alt="Светлое чистое пространство после профессиональной уборки"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Здесь будет фото
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  public/images/hero/clean-bedroom.webp
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-emerald-100/80 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Для квартир, домов и офисов
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            Чистота, которую не нужно перепроверять
          </p>
        </div>
      </div>
    </div>
  );
}
