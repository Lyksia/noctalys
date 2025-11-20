"use client";

import Link from "next/link";
import { siteConfig } from "@/config";
import { Logo } from "@/ui";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/utils";

export function Header() {
  return (
    <header className="border-moon-800 bg-moon-950/95 supports-[backdrop-filter]:bg-moon-950/80 shadow-moonlight sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo avec effet float et glow */}
        <Link
          href="/"
          className="group flex items-center transition-all duration-300 hover:opacity-90"
        >
          <Logo size="md" />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.public.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-200",
                "text-moon-300 hover:text-moon-100",
                "relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0",
                "after:bg-accent-glow after:transition-all after:duration-300 hover:after:w-full",
                "hover:drop-shadow-[0_0_8px_rgba(226,232,240,0.2)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
