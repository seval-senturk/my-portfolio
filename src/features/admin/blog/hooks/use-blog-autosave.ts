"use client";

import { useEffect, useRef } from "react";

interface UseBlogAutosaveOptions {
  enabled: boolean;
  postId?: string;
  getPayload: () => FormData;
  onSave: (formData: FormData) => Promise<{ success: boolean }>;
  intervalMs?: number;
}

/**
 * Autosave architecture hook — debounced draft persistence.
 * Wire to `autosaveBlogPostAction` when enabling full autosave UX.
 */
export function useBlogAutosave({
  enabled,
  postId,
  getPayload,
  onSave,
  intervalMs = 30000,
}: UseBlogAutosaveOptions) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !postId) return undefined;

    timerRef.current = window.setInterval(() => {
      void onSave(getPayload());
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [enabled, postId, getPayload, onSave, intervalMs]);
}
