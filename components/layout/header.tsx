"use client";

import Link from "next/link";
import { siteConfig } from "@/config";
import { cn } from "@/utils";

export function Header() {
  return (
    <header className="border-moon-800 bg-moon-950/95 supports-[backdrop-filter]:bg-moon-950/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="text-moon-100 font-serif text-xl font-bold">{siteConfig.name}</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.public.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                "text-moon-300 hover:text-moon-100",
                "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0",
                "after:bg-accent-glow after:transition-all hover:after:w-full"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="border-moon-800 bg-moon-900 text-moon-100 hover:bg-moon-800 flex h-10 w-10 items-center justify-center rounded-md border transition-colors md:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
