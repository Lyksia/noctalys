"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config";
import { Logo, Button } from "@/ui";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/utils";
import { authClient } from "@/lib/auth-client";

export function Header() {
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setUser(data?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
        <nav className="hidden items-center gap-6 md:flex">
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

          {/* Bibliothèque (visible uniquement si connecté) */}
          {user && (
            <Link
              href="/library"
              className={cn(
                "text-sm font-medium transition-all duration-200",
                "text-moon-300 hover:text-moon-100",
                "relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0",
                "after:bg-accent-glow after:transition-all after:duration-300 hover:after:w-full",
                "hover:drop-shadow-[0_0_8px_rgba(226,232,240,0.2)]"
              )}
            >
              Bibliothèque
            </Link>
          )}

          {/* Authentification */}
          <div className="ml-2 flex items-center gap-3">
            {isLoading ? null : user ? (
              <div className="flex items-center gap-3">
                <span className="text-moon-400 text-sm">{user.name || user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-moon-400 hover:text-moon-100"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Inscription</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
