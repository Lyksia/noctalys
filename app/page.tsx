import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardDescription } from "@/ui";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="section from-moon-950 via-moon-900 to-moon-950 bg-gradient-to-b">
        <div className="container">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
            <div className="animate-fade-in flex flex-col gap-4">
              <h1 className="text-moon-100 font-serif text-4xl font-bold tracking-tight md:text-6xl">
                Bienvenue sur{" "}
                <span className="from-accent-glow to-accent-primary bg-gradient-to-r bg-clip-text text-transparent">
                  Noctalys
                </span>
              </h1>
              <p className="text-moon-300 text-lg leading-relaxed md:text-xl">
                Explorez un univers de fictions et de musiques nocturnes. Plongez dans des récits
                captivants et laissez-vous porter par des mélodies lunaires.
              </p>
            </div>
            <div className="animate-slide-up flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="glow-card">
                <Link href="/fictions">Découvrir les Fictions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glow-card">
                <Link href="/musiques">Écouter les Musiques</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-moon-950">
        <div className="container">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-moon-100 font-serif text-3xl font-bold md:text-4xl">
                Un Univers Nocturne
              </h2>
              <p className="text-moon-400 mx-auto max-w-2xl">
                Noctalys est une plateforme dédiée à la création et au partage de contenus
                artistiques dans une atmosphère élégante et apaisante.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="glow-card bg-moon-900 border-moon-800">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="bg-moon-800 flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
                      📖
                    </div>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-moon-100">Fictions Immersives</CardTitle>
                      <CardDescription className="text-moon-400">
                        Découvrez des histoires captivantes organisées en chapitres. Lisez à votre
                        rythme et explorez différents genres littéraires.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glow-card bg-moon-900 border-moon-800">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="bg-moon-800 flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
                      🎵
                    </div>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-moon-100">Musiques Nocturnes</CardTitle>
                      <CardDescription className="text-moon-400">
                        Écoutez des compositions originales créées pour accompagner vos moments de
                        lecture ou de détente nocturne.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glow-card bg-moon-900 border-moon-800">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="bg-moon-800 flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
                      🌙
                    </div>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-moon-100">Design Élégant</CardTitle>
                      <CardDescription className="text-moon-400">
                        Une interface pensée pour offrir une expérience de lecture et d'écoute
                        confortable, avec une esthétique lunaire apaisante.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glow-card bg-moon-900 border-moon-800">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="bg-moon-800 flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
                      ✨
                    </div>
                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-moon-100">Contenu Original</CardTitle>
                      <CardDescription className="text-moon-400">
                        Tous les contenus sont créés et publiés exclusivement sur Noctalys. Une
                        expérience unique et authentique.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section from-moon-950 to-moon-900 bg-gradient-to-b">
        <div className="container">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-moon-100 font-serif text-3xl font-bold md:text-4xl">
              Prêt à explorer ?
            </h2>
            <p className="text-moon-300 text-lg">
              Commencez votre voyage dans l'univers Noctalys dès maintenant.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="glow-card">
                <Link href="/fictions">Explorer les Fictions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glow-card">
                <Link href="/musiques">Découvrir les Musiques</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
