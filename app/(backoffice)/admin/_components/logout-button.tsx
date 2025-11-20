"use client";

import { Button } from "@/ui";
import { signOut } from "@/lib/auth-client";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
      Déconnexion
    </Button>
  );
}
