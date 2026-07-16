import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Flexible media panel for marketing sections.
 * Supports image, video, placeholder, custom React node / slot.
 *
 * @param {{
 *   media?: {
 *     type?: 'image' | 'video' | 'placeholder' | 'component',
 *     src?: string,
 *     alt?: string,
 *     poster?: string,
 *     title?: string,
 *     description?: string,
 *     component?: import('react').ReactNode,
 *   },
 *   children?: import('react').ReactNode,
 *   className?: string,
 * }} props
 */
export function MediaSlot({ media, children, className }) {
  if (children) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  const type = media?.type ?? "placeholder";

  if (type === "component" && media?.component) {
    return <div className={cn("relative", className)}>{media.component}</div>;
  }

  if (type === "image" && media?.src) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl",
          className
        )}
      >
        <Image
          src={media.src}
          alt={media.alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  if (type === "video" && media?.src) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-2xl",
          className
        )}
      >
        <video
          className="h-full w-full object-cover"
          controls
          playsInline
          poster={media.poster}
          aria-label={media.alt || media.title || "Видео"}
        >
          <source src={media.src} />
        </video>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-cleantry-mint to-teal-50 p-8",
        className
      )}
    >
      {media?.title && (
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          {media.title}
        </p>
      )}
      {media?.description && (
        <p className="mt-3 text-2xl font-bold leading-snug text-slate-900">
          {media.description}
        </p>
      )}
      {!media?.title && !media?.description && (
        <p className="text-sm text-slate-500">Медиа появится позже</p>
      )}
    </div>
  );
}
