"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "./card";
import { Button } from "./button";
import { cn } from "@/utils";
import { useAudioPlayer } from "@/lib/audio-context";

interface TrackCardProps {
  track: {
    id: string;
    slug: string;
    title: string;
    audioUrl: string;
    coverImage: string | null;
    duration: number;
  };
  className?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function CardTrack({ track, className }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack } = useAudioPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    playTrack(track);
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-glow overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-6 p-4">
        {/* Pochette avec overlay play */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          {track.coverImage ? (
            <Image
              src={track.coverImage}
              alt={`Pochette de ${track.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="96px"
            />
          ) : (
            <div className="from-moon-800 to-moon-900 flex h-full w-full items-center justify-center bg-gradient-to-br">
              <span className="text-4xl opacity-20">🎵</span>
            </div>
          )}

          {/* Overlay avec bouton play */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                handlePlay();
              }}
              className={cn(
                "h-12 w-12 rounded-full bg-white/90 text-black shadow-lg transition-all duration-300 hover:bg-white",
                isThisPlaying
                  ? "scale-100 opacity-100"
                  : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              )}
              aria-label={isThisPlaying ? "Pause" : "Lecture"}
            >
              {isThisPlaying ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </Button>
          </div>

          {/* Indicateur de lecture */}
          {isThisPlaying && (
            <div className="absolute right-2 bottom-2">
              <div className="flex gap-0.5">
                <div className="bg-accent-glow h-3 w-0.5 animate-[pulse_0.8s_ease-in-out_infinite] rounded-full" />
                <div className="bg-accent-glow h-3 w-0.5 animate-[pulse_0.8s_ease-in-out_0.2s_infinite] rounded-full" />
                <div className="bg-accent-glow h-3 w-0.5 animate-[pulse_0.8s_ease-in-out_0.4s_infinite] rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3
            className={cn(
              "text-lg font-medium transition-colors",
              isThisPlaying
                ? "text-accent-primary"
                : "text-moon-100 group-hover:text-accent-primary"
            )}
          >
            {track.title}
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-moon-400 font-mono text-sm">{formatDuration(track.duration)}</p>
            <span className="text-moon-600">•</span>
            <p className="text-moon-500 text-sm">Noctalys</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
