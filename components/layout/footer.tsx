import { siteConfig } from "@/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-moon-800 bg-moon-950 w-full border-t">
      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-center">
          <p className="text-moon-400 text-sm">
            © {currentYear} {siteConfig.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
