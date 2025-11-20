"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
  id: string;
  slug: string;
  title: string;
  audioUrl: string;
  coverImage: string | null;
  duration: number;
}

interface AudioContextType {
  // State
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: Track[];

  // Actions
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  setPlaylist: (tracks: Track[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    // Load volume from localStorage
    const savedVolume = localStorage.getItem("audio-volume");
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolumeState(vol);
      audioRef.current.volume = vol;
    } else {
      audioRef.current.volume = 0.7;
    }

    // Event listeners
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track
      next();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // If same track, just toggle play/pause
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // Load new track
    setCurrentTrack(track);
    audio.src = track.audioUrl;
    audio.load();
    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolumeState(vol);
      localStorage.setItem("audio-volume", vol.toString());
    }
  };

  const next = () => {
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < playlist.length) {
      playTrack(playlist[nextIndex]);
    } else {
      // End of playlist
      pause();
    }
  };

  const previous = () => {
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      playTrack(playlist[prevIndex]);
    } else {
      // Go to start of current track
      seek(0);
    }
  };

  const value: AudioContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    playTrack,
    pause,
    resume,
    togglePlay,
    seek,
    setVolume,
    next,
    previous,
    setPlaylist,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}
