"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardTrack } from "@/ui";
import { useAudioPlayer } from "@/lib/audio-context";
import { toast } from "sonner";

interface Track {
  id: string;
  slug: string;
  title: string;
  audioUrl: string;
  coverImage: string | null;
  duration: number;
}

export default function MusiquesPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setPlaylist } = useAudioPlayer();

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      setPlaylist(tracks);
    }
  }, [tracks, setPlaylist]);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/music");
      if (!res.ok) {
        toast.error("Erreur lors du chargement des musiques");
        return;
      }
      const data = await res.json();
      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col">
      {/* Orbe décoratif */}
      <div className="pointer-events-none fixed top-[10vh] left-[15vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      {/* Hero Section */}
      <section className="section pt-20 pb-12">
        <div className="container">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            {/* En-tête avec icône */}
            <div className="flex items-center gap-4">
              <div className="bg-moon-800 border-moon-700/50 shadow-glow-sm flex h-16 w-16 items-center justify-center rounded-2xl border">
                <span className="text-4xl">🎵</span>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-heading-1 font-serif font-semibold">Musiques Nocturnes</h1>
                <p className="text-moon-400 text-sm">
                  Compositions originales pour vos instants de contemplation
                </p>
              </div>
            </div>

            {/* Description narrative */}
            <div className="text-moon-300 flex max-w-3xl flex-col gap-4 leading-relaxed">
              <p>
                Fermez les yeux. Laissez les notes vous envelopper comme un voile de brume nocturne.
                Chaque composition est née dans l&apos;intimité de la nuit, pour accompagner vos
                instants de contemplation.
              </p>
              <p className="text-moon-400">
                Des mélodies douces qui ne cherchent pas à remplir le silence, mais à le sublimer.
                Une bande sonore pour vos lectures, vos rêveries, vos errances nocturnes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contenu */}
      <section className="section pt-0">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            {/* Séparateur décoratif */}
            <div className="mb-12 flex items-center gap-4">
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-r from-transparent" />
              <div className="flex gap-1">
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
                <div className="bg-moon-500 h-1 w-1 rounded-full" />
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
              </div>
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-l from-transparent" />
            </div>

            {/* Grille de musiques */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                // Skeleton loading
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-moon-800/30 border-moon-700/20 h-64 animate-pulse rounded-lg border"
                    />
                  ))}
                </>
              ) : tracks.length === 0 ? (
                // État vide
                <div className="col-span-full">
                  <Card className="bg-moon-800/50 border-moon-700/30 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex flex-col items-center gap-6 py-12 text-center">
                        <div className="bg-moon-900/50 border-moon-700/30 flex h-20 w-20 items-center justify-center rounded-full border">
                          <svg
                            className="text-moon-500 h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-3">
                          <CardTitle className="font-serif text-2xl">
                            Les notes s&apos;éveillent bientôt
                          </CardTitle>
                          <CardDescription className="mx-auto max-w-md text-base">
                            Les premières compositions sont en cours de création. Elles
                            s&apos;élèveront ici comme des lueurs dans l&apos;obscurité, douces et
                            progressives.
                          </CardDescription>
                        </div>
                        <p className="text-moon-500 mt-4 text-sm italic">
                          &quot;La musique est le silence entre les notes.&quot;
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              ) : (
                // Liste des musiques
                tracks.map((track) => <CardTrack key={track.id} track={track} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
