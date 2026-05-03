/**
 * services/greenMatchApi.ts
 * --------------------------
 * All HTTP calls for the Green Match feature.
 * Reuses the token helper from the main api.ts so the same
 * localStorage key is used everywhere.
 */

import { getToken } from "@/services/api";

const BASE_URL = "https://ecochainbackend-production.up.railway.app";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Exact values the backend accepts for sun exposure */
export type SunExposure = "full_sun" | "partial_shade" | "shade";

/** Exact values the backend accepts for soil condition */
export type SoilCondition = "loamy" | "sandy" | "clay";

/** Exact values the backend accepts for water conservation */
export type WaterConservation = "moderate" | "low" | "ultra_low";

/** Payload sent to POST /api/v1/green-match/ */
export interface GreenMatchPayload {
  location: string;
  sun_exposure: SunExposure;
  soil_condition: SoilCondition;
  water_conservation: WaterConservation;
}

/** A single plant returned by the green-match or plant-details endpoints */
export interface Plant {
  id: string;
  name: string;
  scientific_name: string;
  climate_zones: string;
  sun_exposure: string;
  soil_types: string;
  water_conservation: string;
  water_frequency: string;
  tags: string;
  care_tips: string;
  impact_label: string;
  image_url: string;
}

/** A plant saved to the user's garden */
export interface UserPlant {
  id: string;
  plant_id: string;
  nickname: string;
  plant?: Plant; // backend may nest the plant details here
}

/** Payload for POST /api/v1/user/plants/ */
export interface AddUserPlantPayload {
  plant_id: string;
  nickname: string;
}

// ── Internal request helper ───────────────────────────────────────────────────

/**
 * Thin fetch wrapper:
 *  - Attaches Content-Type + Bearer token automatically
 *  - Parses JSON
 *  - Throws on non-2xx (clears tokens on 401)
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Auto-clear stale tokens on 401
    if (response.status === 401) {
      localStorage.removeItem("eco_auth_token");
      localStorage.removeItem("eco_refresh_token");
      localStorage.removeItem("eco_user");
      window.dispatchEvent(new Event("eco:unauthorized"));
    }
    const message =
      data?.message || data?.detail || data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

// ── Endpoint functions ────────────────────────────────────────────────────────

/**
 * 1. GREEN MATCH
 * POST /api/v1/green-match/
 * Returns a list of plants that match the user's garden conditions.
 */
export async function apiGreenMatch(payload: GreenMatchPayload): Promise<Plant[]> {
  return request<Plant[]>("/api/v1/green-match/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 2. GET PLANT DETAILS
 * GET /api/v1/plants/{id}/
 * Returns full details for a single plant.
 */
export async function apiGetPlantDetails(id: string): Promise<Plant> {
  return request<Plant>(`/api/v1/plants/${id}/`);
}

/**
 * 3. GET USER PLANTS
 * GET /api/v1/user/plants/
 * Returns the list of plants saved to the user's garden.
 */
export async function apiGetUserPlants(): Promise<UserPlant[]> {
  return request<UserPlant[]>("/api/v1/user/plants/");
}

/**
 * 4. ADD USER PLANT
 * POST /api/v1/user/plants/
 * Saves a plant to the user's garden with an optional nickname.
 */
export async function apiAddUserPlant(payload: AddUserPlantPayload): Promise<UserPlant> {
  return request<UserPlant>("/api/v1/user/plants/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
