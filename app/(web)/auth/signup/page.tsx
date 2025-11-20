"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, Input, Label } from "@/ui";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Erreur lors de l'inscription");
        return;
      }

      if (data) {
        toast.success("Compte créé avec succès !");
        router.push(redirect);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Erreur lors de l'inscription");
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
              <h1 className="text-heading-2 font-serif font-semibold">Créer un compte</h1>
              <p className="text-moon-400 text-sm">
                Rejoignez Noctalys et commencez votre aventure littéraire
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="border-moon-700 bg-moon-800"
                  disabled={isLoading}
                />
              </div>

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
                <p className="text-moon-500 text-xs">Minimum 8 caractères</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-moon-700 bg-moon-800"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="mt-2">
                {isLoading ? "Création..." : "Créer mon compte"}
              </Button>
            </form>

            {/* Footer */}
            <div className="flex flex-col gap-2 text-center text-sm">
              <p className="text-moon-400">
                Déjà un compte ?{" "}
                <Link
                  href={`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                  className="text-electric-blue hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-moon-400">Chargement...</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
