"use client";

import { useAudioPlayer } from "@/lib/audio-context";
import { Button } from "./button";
import { cn } from "@/utils";
import Image from "next/image";

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    seek,
    setVolume,
    next,
    previous,
  } = useAudioPlayer();

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = x / bounds.width;
    seek(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="border-moon-700 bg-moon-800/95 fixed right-0 bottom-0 left-0 z-40 border-t shadow-[0_-4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="container flex h-20 items-center gap-4">
        {/* Track Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Album Art */}
          <div className="border-moon-700 relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border">
            {currentTrack.coverImage ? (
              <Image
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                fill
                className={cn("object-cover transition-transform", isPlaying && "animate-pulse")}
              />
            ) : (
              <div className="bg-moon-900 text-moon-500 flex h-full w-full items-center justify-center">
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <p className="text-moon-100 truncate text-sm font-medium">{currentTrack.title}</p>
            <p className="text-moon-500 text-xs">Noctalys</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex max-w-2xl flex-1 flex-col items-center gap-2">
          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={previous}
              className="h-8 w-8 p-0"
              title="Précédent"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </Button>

            <Button
              size="sm"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full p-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={next}
              className="h-8 w-8 p-0"
              title="Suivant"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex w-full items-center gap-2">
            <span className="text-moon-500 w-10 text-right text-xs">{formatTime(currentTime)}</span>
            <div
              className="bg-moon-700 group relative h-1 flex-1 cursor-pointer rounded-full"
              onClick={handleProgressClick}
            >
              <div
                className="bg-accent-primary group-hover:bg-accent-primary-hover absolute h-full rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-moon-500 w-10 text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <svg className="text-moon-400 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            {volume === 0 ? (
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : volume < 0.5 ? (
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0118 10a9.972 9.972 0 01-1.929 5.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0016 10c0-1.636-.492-3.156-1.343-4.414a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0118 10a9.972 9.972 0 01-1.929 5.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0016 10c0-1.636-.492-3.156-1.343-4.414a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0114 10a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.984 3.984 0 0012 10a3.983 3.983 0 00-.172-1.414 1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="bg-moon-700 [&::-webkit-slider-thumb]:bg-accent-primary hover:[&::-webkit-slider-thumb]:bg-accent-primary-hover h-1 w-24 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
