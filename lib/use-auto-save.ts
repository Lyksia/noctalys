"use client";

import { useEffect, useRef, useState } from "react";

interface UseAutoSaveOptions {
  onSave: () => void | Promise<void>;
  delay?: number; // in milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  timeSinceLastSave: string;
  forceSave: () => Promise<void>;
}

export function useAutoSave({
  onSave,
  delay = 10000, // 10 seconds by default
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const contentRef = useRef<string>("");

  const performSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      await onSave();
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const forceSave = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await performSave();
  };

  // Update "time since last save" display
  useEffect(() => {
    if (!lastSaved) {
      setTimeSinceLastSave("");
      return;
    }

    const updateTimeSince = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000); // seconds

      if (diff < 60) {
        setTimeSinceLastSave(`Il y a ${diff}s`);
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeSinceLastSave(`Il y a ${minutes}min`);
      } else {
        const hours = Math.floor(diff / 3600);
        setTimeSinceLastSave(`Il y a ${hours}h`);
      }
    };

    updateTimeSince();
    const interval = setInterval(updateTimeSince, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [lastSaved]);

  // Auto-save logic
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, delay, onSave]);

  return {
    isSaving,
    lastSaved,
    timeSinceLastSave,
    forceSave,
  };
}
