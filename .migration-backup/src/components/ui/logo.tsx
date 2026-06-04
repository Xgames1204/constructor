"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** light = светлый фон (тёмный знак), dark = тёмный фон (светлый знак), auto = по теме сайта */
export type LogoSurface = "light" | "dark" | "auto";

interface LogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
  /** На каком фоне показывается логотип */
  surface?: LogoSurface;
}

const LOGO_LIGHT = "/logo-light.png";
const LOGO_DARK = "/logo-dark.png";

export function Logo({
  size = 40,
  showText = true,
  href = "/",
  className,
  surface = "auto",
}: LogoProps) {
  const img =
    surface === "dark" ? (
      <Image
        src={LOGO_DARK}
        alt="Constructor"
        width={size}
        height={size}
        className={cn("object-contain", className)}
        priority
      />
    ) : surface === "light" ? (
      <Image
        src={LOGO_LIGHT}
        alt="Constructor"
        width={size}
        height={size}
        className={cn("object-contain", className)}
        priority
      />
    ) : (
      <>
        <Image
          src={LOGO_LIGHT}
          alt="Constructor"
          width={size}
          height={size}
          className={cn("object-contain dark:hidden", className)}
          priority
        />
        <Image
          src={LOGO_DARK}
          alt=""
          width={size}
          height={size}
          aria-hidden
          className={cn("hidden object-contain dark:block", className)}
        />
      </>
    );

  const content = (
    <div className="flex items-center gap-2.5">
      <span
        className="relative inline-flex shrink-0"
        style={{ width: size, height: size }}
      >
        {img}
      </span>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-constructor-charcoal dark:text-white">
          Constructor
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
