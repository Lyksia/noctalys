import { Card, CardHeader, CardTitle, CardDescription } from "@/ui";

export default function FictionsPage() {
  return (
    <div className="section">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-moon-100">
              Fictions
            </h1>
            <p className="text-lg text-moon-400 max-w-2xl">
              Découvrez nos histoires captivantes. Chaque fiction est organisée en chapitres pour
              une lecture immersive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder pour les fictions */}
            <Card className="glow-card bg-moon-900 border-moon-800">
              <CardHeader>
                <CardTitle className="text-moon-100">Aucune fiction disponible</CardTitle>
                <CardDescription className="text-moon-400">
                  Les fictions seront bientôt disponibles. Revenez plus tard !
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
