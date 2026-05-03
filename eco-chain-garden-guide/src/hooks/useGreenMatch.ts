/**
 * hooks/useGreenMatch.ts
 */

import { useState } from "react";
import {
  apiGreenMatch,
  GreenMatchPayload,
  Plant,
} from "@/services/greenMatchApi";

export function useGreenMatch() {
  const [results, setResults] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const runMatch = async (payload: GreenMatchPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // 🔍 DEBUG — see exactly what we're sending to the backend
    console.log("[useGreenMatch] sending payload:", JSON.stringify(payload, null, 2));

    try {
      const raw = await apiGreenMatch(payload);

      // 🔍 DEBUG — see the exact shape the backend returns
      console.log("[useGreenMatch] raw response:", raw);

      // Normalize: backend may return a bare array OR wrapped object
      let plants: Plant[];
      if (Array.isArray(raw)) {
        plants = raw;
      } else {
        const obj = raw as any;
        console.log("[useGreenMatch] response keys:", Object.keys(obj));
        plants = obj.results ?? obj.plants ?? obj.data ?? obj.matches ?? [];
      }

      console.log("[useGreenMatch] extracted plants:", plants);
      setResults(plants);
      setSuccess(true);
    } catch (err: any) {
      // 🔍 DEBUG — log the backend's exact 400 error message
      console.error("[useGreenMatch] request failed:", err.message);
      setError(err.message ?? "Failed to find matching plants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, success, runMatch };
}
