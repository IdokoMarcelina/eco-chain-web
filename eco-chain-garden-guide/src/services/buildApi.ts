import { getToken } from "./api";

const BASE_URL = "https://ecochainbackend-production.up.railway.app";

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${body}`);
  }
  return response.json();
}

// ----------------------------------------------------------------
// Types matching the real API response shapes
// ----------------------------------------------------------------

export interface ApiRoom {
  name: string;
  area_sqm: number;
  notes?: string;
}

export interface ApiMaterialHint {
  element: string;
  suggestion: string;
  reason: string;
}

export interface ApiLayoutResponse {
  layout_description: string;
  rooms: ApiRoom[];
  ventilation_paths: string[];
  passive_solar_notes: string;
  eco_score: number;
  eco_score_reasons: string[];
  material_hints: ApiMaterialHint[];
}

export interface NormalizedRoom {
  name: string;
  type: string;
  area_sqm: number;
  notes?: string;
}

export interface NormalizedLayout {
  eco_score: number;
  eco_score_reasons: string[];
  layout_description: string;
  ventilation_paths: string[];
  passive_solar_notes: string;
  material_hints: ApiMaterialHint[];
  rooms: NormalizedRoom[];
}

// ----------------------------------------------------------------
// Normalizer — merges API bedroom data with standard missing rooms
// ----------------------------------------------------------------

export function normalizeApiLayout(
  raw: ApiLayoutResponse,
  form: { bedrooms: number; climate_zone: string; style: string; orientation: string }
): NormalizedLayout {
  // Map bedroom rooms from the API, inferring type from name
  const apiRooms: NormalizedRoom[] = (raw.rooms || []).map((r) => ({
    name: r.name,
    type: r.name.toLowerCase().includes("bedroom") ? "bedroom" : "other",
    area_sqm: r.area_sqm || 16,
    notes: r.notes || "",
  }));

  // Standard rooms the API never returns — always inject these
  const standardRooms: NormalizedRoom[] = [
    { name: "Living Room",      type: "living",   area_sqm: 35 },
    { name: "Kitchen & Dining", type: "kitchen",  area_sqm: 22 },
    { name: "Ensuite Bath",     type: "bathroom", area_sqm: 8  },
    { name: "Shared Bath",      type: "bathroom", area_sqm: 8  },
    { name: "Veranda",          type: "veranda",  area_sqm: 12 },
  ];

  // Bedrooms first (from API), then standard rooms
  const rooms: NormalizedRoom[] = [...apiRooms, ...standardRooms];

  return {
    eco_score:           raw.eco_score          ?? 8,
    eco_score_reasons:   raw.eco_score_reasons  ?? [],
    layout_description:  raw.layout_description ?? "",
    ventilation_paths:   raw.ventilation_paths  ?? [],
    passive_solar_notes: raw.passive_solar_notes ?? "",
    material_hints:      raw.material_hints      ?? [],
    rooms,
  };
}

// ----------------------------------------------------------------
// API calls
// ----------------------------------------------------------------

export const apiGenerateLayout = (payload: {
  bedrooms: number;
  climate_zone: string;
  style: string;
  orientation: string;
  lot_size_sqm: number;
  budget_usd: number;
}): Promise<ApiLayoutResponse> =>
  request("/api/v1/layout/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiGetClimateZones = () =>
  request("/api/v1/climate-zones");

export const apiSuggestMaterials = (payload: {
  element_type: string;
  climate_zone: string;
}) =>
  request("/api/v1/materials/suggest", {
    method: "POST",
    body: JSON.stringify(payload),
  });