/**
 * hooks/useUserPlants.ts
 * -----------------------
 * Manages the current user's saved garden plants.
 *
 * • Fetches the plant list on mount automatically
 * • Provides addPlant() to save a new plant (optimistic update)
 *
 * Usage in a component:
 *   const { userPlants, isLoading, error, addPlant, isAdding } = useUserPlants();
 *   // To add: await addPlant({ plant_id: "abc", nickname: "My Aloe" });
 */

import { useState, useEffect } from "react";
import {
  apiGetUserPlants,
  apiAddUserPlant,
  AddUserPlantPayload,
  UserPlant,
} from "@/services/greenMatchApi";

export function useUserPlants() {
  // List of the user's saved plants
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);

  // States for the initial GET request
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for the POST (add) request — kept separate so the UI
  // can show a spinner only on the "Add" button without blocking the list
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // ── Fetch saved plants on mount ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchPlants = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const plants = await apiGetUserPlants();
        if (!cancelled) setUserPlants(plants);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load your plants.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPlants();
    return () => { cancelled = true; };
  }, []);

  // ── Add a new plant ─────────────────────────────────────────────────────────
  /**
   * addPlant
   * Sends a POST request to save a plant to the user's garden.
   * Uses an optimistic update — the plant is appended to the local list
   * immediately, then replaced with the server response on success.
   * If the request fails, the optimistic entry is removed.
   */
  const addPlant = async (payload: AddUserPlantPayload) => {
    setIsAdding(true);
    setAddError(null);
    setAddSuccess(false);

    // Optimistic placeholder so the UI feels instant
    const optimisticEntry: UserPlant = {
      id: `optimistic-${Date.now()}`,
      plant_id: payload.plant_id,
      nickname: payload.nickname,
    };
    setUserPlants((prev) => [...prev, optimisticEntry]);

    try {
      const saved = await apiAddUserPlant(payload);

      // Replace the optimistic entry with the real server response
      setUserPlants((prev) =>
        prev.map((p) => (p.id === optimisticEntry.id ? saved : p))
      );
      setAddSuccess(true);
    } catch (err: any) {
      // Remove the optimistic entry if the request failed
      setUserPlants((prev) =>
        prev.filter((p) => p.id !== optimisticEntry.id)
      );
      setAddError(err.message ?? "Failed to add plant. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return {
    userPlants,    // array of saved plants
    isLoading,     // true while fetching the list
    error,         // error message for the fetch, or null
    addPlant,      // call this to add a plant: addPlant({ plant_id, nickname })
    isAdding,      // true while the add request is in-flight
    addError,      // error message for the add action, or null
    addSuccess,    // true when the last add succeeded
  };
}
