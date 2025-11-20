"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardHeader, CardContent, Badge, Input } from "@/ui";
import { toast } from "sonner";

interface Fiction {
  id: string;
  title: string;
  slug: string;
  genre: string;
  status: string;
  publishedAt: string | null;
  _count: {
    chapters: number;
  };
}

export default function FictionsAdminPage() {
  const [fictions, setFictions] = useState<Fiction[]>([]);
  const [filteredFictions, setFilteredFictions] = useState<Fiction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchFictions();
  }, []);

  useEffect(() => {
    filterFictions();
  }, [fictions, searchQuery, statusFilter]);

  const fetchFictions = async () => {
    try {
      const res = await fetch("/api/admin/fictions");
      if (!res.ok) {
        toast.error("Erreur lors du chargement des fictions");
        return;
      }
      const data = await res.json();
      setFictions(data);
    } catch (error) {
      console.error("Error fetching fictions:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const filterFictions = () => {
    let filtered = [...fictions];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((fiction) =>
        fiction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((fiction) => fiction.status === statusFilter);
    }

    setFilteredFictions(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-moon-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 font-serif font-semibold">Fictions</h1>
          <p className="text-moon-400">Gérez vos fictions et chapitres</p>
        </div>
        <Link href="/admin/fictions/new">
          <Button>+ Nouvelle fiction</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher une fiction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-moon-900 border-moon-700"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "ALL" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("ALL")}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "DRAFT" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("DRAFT")}
              >
                Brouillons
              </Button>
              <Button
                variant={statusFilter === "PUBLISHED" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("PUBLISHED")}
              >
                Publiées
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fictions Table */}
      {filteredFictions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-moon-400">
              {searchQuery || statusFilter !== "ALL"
                ? "Aucune fiction trouvée"
                : "Aucune fiction. Créez-en une !"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-moon-900 border-b border-moon-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-moon-200">
                      Titre
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-moon-200">
                      Genre
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-moon-200">
                      Statut
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-moon-200">
                      Chapitres
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-moon-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFictions.map((fiction) => (
                    <tr
                      key={fiction.id}
                      className="border-b border-moon-800 hover:bg-moon-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/admin/fictions/${fiction.id}`}
                            className="font-medium text-moon-100 hover:text-accent-primary transition-colors"
                          >
                            {fiction.title}
                          </Link>
                          <span className="text-xs text-moon-500">/{fiction.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{fiction.genre}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            fiction.status === "PUBLISHED" ? "success" : "default"
                          }
                        >
                          {fiction.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-moon-300">
                        {fiction._count.chapters}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/fictions/${fiction.id}`}>
                            <Button variant="ghost" size="sm">
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Button>
                          </Link>
                          <Link href={`/admin/fictions/${fiction.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Button>
                          </Link>
                          {fiction.status === "PUBLISHED" && (
                            <Link
                              href={`/fictions/${fiction.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm">
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
