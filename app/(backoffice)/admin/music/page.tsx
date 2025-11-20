"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@/ui";
import { toast } from "sonner";

interface Track {
  id: string;
  slug: string;
  title: string;
  audioUrl: string;
  coverImage: string | null;
  duration: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formater la durée en MM:SS
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Formater la date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/admin/music");
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return;
    }

    setIsDeleting(id);

    try {
      const res = await fetch("/api/admin/music", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de la suppression");
        return;
      }

      toast.success("Morceau supprimé avec succès");
      // Retirer le track de la liste
      setTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 font-serif font-semibold">Musiques</h1>
          <p className="text-moon-400">
            Gérez votre bibliothèque de morceaux ({tracks.length}{" "}
            {tracks.length > 1 ? "musiques" : "musique"})
          </p>
        </div>
        <Link href="/admin/music/new">
          <Button variant="default" size="default">
            + Upload musique
          </Button>
        </Link>
      </div>

      {/* Liste des musiques */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-moon-400">Chargement...</div>
        </div>
      ) : tracks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
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
            <div className="flex flex-col gap-2 text-center">
              <CardTitle className="font-serif text-xl">Aucune musique</CardTitle>
              <CardDescription>Commencez par uploader votre première composition</CardDescription>
            </div>
            <Link href="/admin/music/new">
              <Button variant="default" size="default">
                + Upload musique
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-moon-900/50 border-moon-700 overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-moon-700 border-b">
                <tr className="text-moon-400 text-left text-sm">
                  <th className="px-6 py-4 font-medium">Titre</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell">Durée</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">Date</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-moon-700/50 divide-y">
                {tracks.map((track) => (
                  <tr
                    key={track.id}
                    className="hover:bg-moon-800/30 text-moon-100 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {track.coverImage ? (
                          <div className="border-moon-700 relative h-10 w-10 overflow-hidden rounded border">
                            <Image
                              src={track.coverImage}
                              alt={track.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="bg-moon-800 border-moon-700 flex h-10 w-10 items-center justify-center rounded border">
                            <span className="text-sm">🎵</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{track.title}</span>
                          <span className="text-moon-500 text-xs">/{track.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <span className="text-moon-400 text-sm">
                        {formatDuration(track.duration)}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <span className="text-moon-400 text-sm">{formatDate(track.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Écouter */}
                        <a
                          href={track.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-moon-400 hover:text-electric-blue transition-colors"
                          title="Écouter"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </a>

                        {/* Éditer */}
                        <Link
                          href={`/admin/music/${track.id}/edit`}
                          className="text-moon-400 hover:text-electric-blue transition-colors"
                          title="Éditer"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        {/* Supprimer */}
                        <button
                          onClick={() => handleDelete(track.id, track.title)}
                          disabled={isDeleting === track.id}
                          className="text-moon-400 transition-colors hover:text-red-400 disabled:opacity-50"
                          title="Supprimer"
                        >
                          {isDeleting === track.id ? (
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
