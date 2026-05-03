/**
 * hooks/useGreenMatch.ts
 * -----------------------
 * Sends user's garden conditions to the backend and returns
 * a list of matched plants.
 *
 * Usage in a component:
 *   const { results, isLoading, error, runMatch } = useGreenMatch();
 *   // call runMatch(payload) when the user hits "Match My Garden"
 */

import { useState } from "react";
import {
  apiGreenMatch,
  GreenMatchPayload,
  Plant,
} from "@/services/greenMatchApi";

export function useGreenMatch() {
  // The list of plants returned by the backend
  const [results, setResults] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * runMatch
   * Call this with the current form values when the user clicks
   * "Match My Garden". It sends a POST to /api/v1/green-match/
   * and stores the returned plant list in `results`.
   */
  const runMatch = async (payload: GreenMatchPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const raw = await apiGreenMatch(payload);

      // 🔍 DEBUG — open browser console to see the exact response shape
      console.log("[useGreenMatch] raw response:", raw);

      // The backend may return a bare array OR a wrapped object like:
      //   { results: [...] }  /  { plants: [...] }  /  { data: [...] }
      // Normalize to always be an array so results.map() never throws.
      let plants: Plant[];
      if (Array.isArray(raw)) {
        plants = raw;
      } else {
        const obj = raw as any;
        // Log the keys so we can see which one holds the array
        console.log("[useGreenMatch] response keys:", Object.keys(obj));
        plants = obj.results ?? obj.plants ?? obj.data ?? obj.matches ?? [];
      }

      console.log("[useGreenMatch] extracted plants:", plants);
      setResults(plants);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to find matching plants. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, success, runMatch };
}
