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
    throw new Error("Something went wrong");
  }
  return response.json();
}

export const apiGetBuildSuggestions = (payload: {
  country: string;
  city: string;
  building_type: string;
  rooms: number;
  size_sqm: number;
  eco_level: string;
  budget?: number;
  power?: string;
}) =>
  request("/api/v1/build/suggestions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiGetMaterialAlternatives = (payload: {
  material: string;
  eco_preference?: string;
}) =>
  request("/api/v1/build/alternatives", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiGetBuildPlan = (payload: {
  country: string;
  city: string;
  building_type: string;
  rooms: number;
  size_sqm: number;
  eco_level: string;
  budget?: number;
  power?: string;
}) =>
  request("/api/v1/build/plan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
