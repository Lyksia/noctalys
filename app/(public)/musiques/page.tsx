import { Card, CardHeader, CardTitle, CardDescription } from "@/ui";

export default function MusiquesPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-moon-100">
              Musiques Nocturnes
            </h1>
            <p className="text-lg text-moon-400 max-w-2xl">
              Écoutez nos compositions originales. Des mélodies créées pour accompagner vos moments
              de lecture et de détente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder pour les musiques */}
            <Card className="glow-card bg-moon-900 border-moon-800">
              <CardHeader>
                <CardTitle className="text-moon-100">Aucune musique disponible</CardTitle>
                <CardDescription className="text-moon-400">
                  Les musiques seront bientôt disponibles. Revenez plus tard !
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
