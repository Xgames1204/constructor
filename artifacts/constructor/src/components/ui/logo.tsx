import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export type LogoSurface = "light" | "dark" | "auto";

interface LogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const logoSrc =
    surface === "dark"
      ? LOGO_LIGHT
      : surface === "light"
        ? LOGO_DARK
        : isDark
          ? LOGO_LIGHT
          : LOGO_DARK;

  const content = (
    <div className="flex items-center gap-2.5">
      <span
        className="relative inline-flex shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src={logoSrc}
          alt="Constructor"
          width={size}
          height={size}
          className={cn("object-contain", className)}
        />
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
