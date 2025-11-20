"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, Input, Label } from "@/ui";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Erreur lors de la connexion");
        return;
      }

      if (data) {
        toast.success("Connexion réussie !");
        router.push(redirect);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="border-moon-800 bg-moon-900 w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-heading-2 font-serif font-semibold">Connexion</h1>
              <p className="text-moon-400 text-sm">
                Connectez-vous pour accéder à votre bibliothèque
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="border-moon-700 bg-moon-800"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-moon-700 bg-moon-800"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="mt-2">
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Footer */}
            <div className="flex flex-col gap-2 text-center text-sm">
              <p className="text-moon-400">
                Pas encore de compte ?{" "}
                <Link
                  href={`/auth/signup${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                  className="text-electric-blue hover:underline"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-moon-400">Chargement...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
