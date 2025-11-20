import Link from "next/link";
import { Logo } from "@/ui";
import { LogoutButton } from "./_components/logout-button";

const navigation = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Fictions", href: "/admin/fictions" },
  { label: "Musiques", href: "/admin/music" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-moon-950 flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-moon-800 bg-moon-900 flex w-64 flex-col border-r">
        {/* Logo */}
        <div className="border-moon-800 flex flex-col items-start gap-2 border-b p-6">
          <Logo size="md" animated={false} />
          <span className="text-moon-400 text-xs font-medium tracking-wider uppercase">
            Administration
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-moon-300 hover:text-moon-100 hover:bg-moon-800 hover:shadow-glow-sm flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-moon-800 border-t p-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
