import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Musiques",
  description:
    "Compositions musicales nocturnes originales. Plongez dans des ambiances sonores envoûtantes qui accompagnent vos lectures.",
  openGraph: {
    title: "Musiques | Noctalys",
    description:
      "Compositions musicales nocturnes originales. Plongez dans des ambiances sonores envoûtantes qui accompagnent vos lectures.",
  },
  twitter: {
    title: "Musiques | Noctalys",
    description:
      "Compositions musicales nocturnes originales. Plongez dans des ambiances sonores envoûtantes qui accompagnent vos lectures.",
  },
};

export default function MusiquesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
