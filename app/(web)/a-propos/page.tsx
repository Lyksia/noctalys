import type { Metadata } from "next";
import { Card, CardContent } from "@/ui";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez Noctalys, une plateforme dédiée à la création et au partage de fictions et musiques nocturnes.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Orbe lunaire décoratif */}
      <div className="pointer-events-none fixed top-[10vh] right-[10vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* En-tête */}
            <div className="mb-12 flex flex-col gap-4">
              <h1 className="text-heading-1 text-moon-50 font-serif font-semibold">À propos</h1>
              <p className="text-moon-400 text-lg">
                Quand la nuit tombe, les histoires s&apos;éveillent...
              </p>
            </div>

            {/* Contenu */}
            <div className="flex flex-col gap-8">
              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    L&apos;essence de Noctalys
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Noctalys est né d&apos;une passion pour les récits nocturnes et les ambiances
                    sonores envoûtantes. Cette plateforme est un espace de création et de partage où
                    les histoires prennent vie sous le voile de la nuit.
                  </p>
                  <p className="text-moon-300 leading-relaxed">
                    Chaque fiction, chaque composition musicale est conçue pour vous transporter
                    dans un univers contemplatif et mystérieux, où l&apos;imagination n&apos;a pas
                    de limites.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    Notre mission
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Créer un sanctuaire numérique dédié à l&apos;art narratif et musical nocturne.
                    Offrir aux lecteurs et auditeurs des expériences immersives qui éveillent
                    l&apos;imaginaire et invitent à la contemplation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    L&apos;univers Noctalys
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-moon-200 mb-2 font-medium">📖 Fictions</h3>
                      <p className="text-moon-300 leading-relaxed">
                        Des récits captivants publiés chapitre par chapitre, explorant des univers
                        fantastiques, science-fiction, horreur et bien plus encore.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-moon-200 mb-2 font-medium">🎵 Musiques</h3>
                      <p className="text-moon-300 leading-relaxed">
                        Des compositions originales créées pour accompagner vos lectures et plonger
                        dans des ambiances nocturnes uniques.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">Contact</h2>
                  <p className="text-moon-300 leading-relaxed">
                    Pour toute question, suggestion ou collaboration, n&apos;hésitez pas à nous
                    contacter à{" "}
                    <a
                      href="mailto:contact@noctalys.fr"
                      className="text-accent-primary hover:text-accent-glow transition-colors"
                    >
                      contact@noctalys.fr
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
