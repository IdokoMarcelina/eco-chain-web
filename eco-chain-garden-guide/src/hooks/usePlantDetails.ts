/**
 * hooks/usePlantDetails.ts
 * -------------------------
 * Fetches full details for a single plant by ID.
 * Fires automatically whenever the `plantId` argument changes.
 *
 * Usage in a component:
 *   const { plant, isLoading, error } = usePlantDetails(selectedPlantId);
 *
 * Pass null/undefined to skip the fetch (e.g. when no plant is selected).
 */

import { useState, useEffect } from "react";
import { apiGetPlantDetails, Plant } from "@/services/greenMatchApi";

export function usePlantDetails(plantId: string | null | undefined) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if no ID was given
    if (!plantId) {
      setPlant(null);
      return;
    }

    let cancelled = false;

    const fetchPlant = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiGetPlantDetails(plantId);
        if (!cancelled) setPlant(data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load plant details.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPlant();

    // Cleanup: ignore stale responses if plantId changes mid-flight
    return () => { cancelled = true; };
  }, [plantId]); // re-runs whenever the selected plant ID changes

  return { plant, isLoading, error };
}
