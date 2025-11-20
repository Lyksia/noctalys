export const siteConfig = {
  name: "Noctalys",
  description: "Fictions & Musiques Nocturnes",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: "Noctalys",
  links: {
    github: "",
    twitter: "",
  },
  nav: {
    public: [
      { label: "Accueil", href: "/" },
      { label: "Fictions", href: "/fictions" },
      { label: "Musiques", href: "/musiques" },
      { label: "À propos", href: "/a-propos" },
    ],
    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "Fictions", href: "/admin/fictions" },
      { label: "Musiques", href: "/admin/musiques" },
    ],
    footer: [
      { label: "À propos", href: "/a-propos" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
} as const;
