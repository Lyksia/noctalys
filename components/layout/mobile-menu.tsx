"use client";

import * as React from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/ui";
import { siteConfig } from "@/config";
import { Logo } from "@/ui";
import { cn } from "@/utils";

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Burger Button */}
      <button
        className="border-moon-700 bg-moon-800 text-moon-100 hover:bg-moon-700 hover:shadow-glow-sm flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Menu de navigation"
        aria-expanded={isOpen}
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

      {/* Mobile Menu Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-full w-full max-w-full flex-col rounded-none border-0 p-0 sm:max-w-md">
          <DialogTitle className="sr-only">Menu de navigation</DialogTitle>

          {/* Header */}
          <div className="border-moon-700 flex items-center border-b p-6">
            <Logo size="md" animated={false} />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 p-6">
            {siteConfig.nav.public.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                  "text-moon-300 hover:text-moon-100",
                  "hover:bg-moon-800 hover:shadow-glow-sm"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-moon-700 mt-auto border-t p-6">
            <p className="text-moon-500 text-center text-sm">
              © {new Date().getFullYear()} {siteConfig.name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
