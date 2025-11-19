import { siteConfig } from "@/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-moon-800 bg-moon-950 w-full border-t">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-moon-400 text-sm">
              © {currentYear} {siteConfig.name}. Tous droits réservés.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-moon-400 text-sm">
              Créé avec <span className="text-accent-glow">✦</span> par {siteConfig.author}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
