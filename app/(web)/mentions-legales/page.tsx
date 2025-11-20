import type { Metadata } from "next";
import { Card, CardContent } from "@/ui";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et informations juridiques de Noctalys.",
};

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Orbe lunaire décoratif */}
      <div className="pointer-events-none fixed top-[10vh] right-[10vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* En-tête */}
            <div className="mb-12 flex flex-col gap-4">
              <h1 className="text-heading-1 text-moon-50 font-serif font-semibold">
                Mentions légales
              </h1>
              <p className="text-moon-400 text-sm">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>

            {/* Contenu */}
            <div className="flex flex-col gap-8">
              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    1. Éditeur du site
                  </h2>
                  <p className="text-moon-300 leading-relaxed">Le site Noctalys est édité par :</p>
                  <ul className="text-moon-300 list-disc pl-6">
                    <li>Nom : Noctalys</li>
                    <li>Email : contact@noctalys.fr</li>
                    <li>Siège social : France</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    2. Hébergement
                  </h2>
                  <p className="text-moon-300 leading-relaxed">Le site est hébergé par :</p>
                  <ul className="text-moon-300 list-disc pl-6">
                    <li>Vercel Inc.</li>
                    <li>340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                    <li>Site web : https://vercel.com</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    3. Propriété intellectuelle
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    L&apos;ensemble des contenus présents sur le site Noctalys (textes, fictions,
                    musiques, images, graphismes, logo, etc.) sont protégés par le droit
                    d&apos;auteur.
                  </p>
                  <p className="text-moon-300 leading-relaxed">
                    Toute reproduction, représentation, modification, publication, transmission ou
                    dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé
                    que ce soit, sans autorisation écrite préalable de Noctalys est interdite.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    4. Données personnelles
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous
                    disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
                    données personnelles.
                  </p>
                  <p className="text-moon-300 leading-relaxed">
                    Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse email :
                    contact@noctalys.fr
                  </p>
                  <p className="text-moon-300 leading-relaxed">
                    Les données collectées sur ce site sont uniquement utilisées pour la gestion de
                    votre compte utilisateur et l&apos;administration du site. Elles ne sont en
                    aucun cas transmises à des tiers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    5. Cookies
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Le site utilise des cookies essentiels au fonctionnement technique
                    (authentification, préférences utilisateur). Aucun cookie de tracking ou
                    publicitaire n&apos;est utilisé.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    6. Responsabilité
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Noctalys s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
                    informations diffusées sur ce site. Toutefois, Noctalys ne peut garantir
                    l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à
                    disposition.
                  </p>
                  <p className="text-moon-300 leading-relaxed">
                    Noctalys décline toute responsabilité pour toute imprécision, inexactitude ou
                    omission portant sur des informations disponibles sur le site.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="prose-reading py-8">
                  <h2 className="text-moon-100 mb-4 font-serif text-2xl font-semibold">
                    7. Droit applicable
                  </h2>
                  <p className="text-moon-300 leading-relaxed">
                    Les présentes mentions légales sont régies par le droit français. En cas de
                    litige, les tribunaux français seront seuls compétents.
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
