import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-moon-800 bg-moon-950 w-full border-t">
      <div className="container py-12">
        <div className="flex flex-col gap-8">
          {/* Logo et description */}
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <div className="relative h-12 drop-shadow-[0_0_12px_rgba(226,232,240,0.3)]">
              <Image
                src="/logo.svg"
                alt="Noctalys"
                width={622}
                height={362}
                className="h-full w-auto"
              />
            </div>
            <p className="text-moon-400 max-w-md text-sm">
              Une plateforme dédiée à la création et au partage de fictions et musiques nocturnes.
            </p>
          </div>

          {/* Liens de navigation */}
          <nav className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-6">
            {siteConfig.nav.footer.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-moon-400 hover:text-moon-100 text-sm transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Séparateur */}
          <div className="bg-moon-800 h-px" />

          {/* Copyright */}
          <div className="flex items-center justify-center">
            <p className="text-moon-500 text-sm">
              © {currentYear} Noctalys. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
