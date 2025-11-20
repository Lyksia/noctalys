"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Card, CardHeader, CardContent } from "@/ui";
import { Logo } from "@/ui";
import { signIn } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Vérifier le rate limit avant de tenter la connexion
      const rateLimitResponse = await fetch("/api/auth/check-rate-limit", {
        method: "POST",
      });

      const rateLimitData = await rateLimitResponse.json();

      // Si rate limit dépassé
      if (!rateLimitData.allowed) {
        setError(rateLimitData.error || "Trop de tentatives de connexion");
        setIsLoading(false);
        return;
      }

      // Tenter la connexion
      const response = await signIn.email({
        email,
        password,
      });

      if (response.error) {
        setError("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Redirection vers le dashboard admin
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <div className="from-moon-900 to-moon-950 flex min-h-screen items-center justify-center bg-gradient-to-b p-4">
      {/* Orbe lunaire décoratif */}
      <div className="pointer-events-none fixed top-[20vh] left-1/2 z-[-1] h-[600px] w-[600px] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[80px]" />

      <div className="w-full max-w-md">
        <Card className="bg-moon-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              {/* Logo */}
              <Logo size="lg" />

              {/* Titre */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-moon-50 font-serif text-2xl font-semibold">
                  Administration Noctalys
                </h1>
                <p className="text-moon-400 text-sm">
                  Connectez-vous pour accéder au tableau de bord
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@noctalys.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-moon-900 border-moon-700"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-moon-900 border-moon-700"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-status-error/10 border-status-error/30 text-status-error rounded-lg border p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info footer */}
        <p className="text-moon-500 mt-6 text-center text-sm">
          Accès réservé aux administrateurs uniquement
        </p>
      </div>
    </div>
  );
}
