import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import { Toaster, AudioPlayer } from "@/ui";
import { AudioPlayerProvider } from "@/lib/audio-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://noctalys.vercel.app"),
  title: {
    default: "Noctalys - Fictions & Musiques Nocturnes",
    template: "%s | Noctalys",
  },
  description:
    "Plateforme de publication de fictions et musiques par Noctalys. Explorez un univers nocturne et lunaire où les histoires prennent vie.",
  keywords: ["fictions", "musiques", "nocturne", "littérature", "lecture", "compositions"],
  authors: [{ name: "Noctalys" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Noctalys",
    title: "Noctalys - Fictions & Musiques Nocturnes",
    description:
      "Plateforme de publication de fictions et musiques par Noctalys. Explorez un univers nocturne et lunaire où les histoires prennent vie.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noctalys - Fictions & Musiques Nocturnes",
    description:
      "Plateforme de publication de fictions et musiques par Noctalys. Explorez un univers nocturne et lunaire.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}>
        <AudioPlayerProvider>
          {children}
          <AudioPlayer />
          <Toaster />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
