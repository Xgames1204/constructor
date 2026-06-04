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
  const img =
    surface === "dark" ? (
      <img
        src={LOGO_LIGHT}
        alt="Constructor"
        width={size}
        height={size}
        className={cn("object-contain", className)}
      />
    ) : surface === "light" ? (
      <img
        src={LOGO_DARK}
        alt="Constructor"
        width={size}
        height={size}
        className={cn("object-contain", className)}
      />
    ) : (
      <>
        <img
          src={LOGO_DARK}
          alt="Constructor"
          width={size}
          height={size}
          className={cn("object-contain dark:hidden", className)}
        />
        <img
          src={LOGO_LIGHT}
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
