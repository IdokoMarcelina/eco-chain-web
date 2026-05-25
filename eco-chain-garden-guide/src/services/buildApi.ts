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

export const apiGenerateLayout = (payload: {
  bedrooms: number;
  climate_zone: string;
  style: string;
  orientation: string;
  lot_size_sqm: number;
  budget_usd: number;
}) =>
  request("/api/v1/layout/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
