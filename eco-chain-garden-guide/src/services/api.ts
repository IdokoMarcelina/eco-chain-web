/**
 * services/api.ts
 * ----------------
 * Central place for every HTTP call to the EcoChain backend.
 * All functions are async and throw on non-2xx responses so
 * callers can handle errors in a single try/catch.
 */

// ── Base URL ──────────────────────────────────────────────────────────────────
const BASE_URL = "https://ecochainbackend-production.up.railway.app";

// ── Token helpers (localStorage) ─────────────────────────────────────────────
const TOKEN_KEY = "eco_auth_token";
const REFRESH_KEY = "eco_refresh_token";

/** Save the JWT access token returned by the login endpoint. */
export const saveToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

/** Save the JWT refresh token for later token renewal. */
export const saveRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_KEY, token);

/** Read the saved access token (null if not logged in). */
export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

/** Remove both tokens (used on logout). */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// ── Internal fetch wrapper ────────────────────────────────────────────────────
/**
 * A thin wrapper around `fetch` that:
 * - Sets Content-Type: application/json automatically
 * - Optionally attaches the Bearer token header
 * - Parses the JSON response
 * - Throws a descriptive error for non-2xx status codes
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach the stored token if this is an authenticated request
  if (withAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Parse JSON body regardless of status (error bodies are often JSON too)
  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // On 401: the stored token is invalid/expired — wipe it and signal the app
    if (response.status === 401) {
      localStorage.removeItem("eco_auth_token");
      localStorage.removeItem("eco_refresh_token");
      localStorage.removeItem("eco_user");
      // Dispatch a custom event so any part of the app can redirect to /login
      window.dispatchEvent(new Event("eco:unauthorized"));
    }

    // Prefer a message field from the API, fall back to HTTP status text
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

// ── Type definitions ──────────────────────────────────────────────────────────

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  location: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface LoginResponse {
  token: string;
  access: string;          // JWT access token
  refresh: string;         // JWT refresh token
  user: {
    id: string;
    name: string;
    email: string;
    location: string;
    status: string;
    created_at: string;
  };
}

export interface DashboardData {
  // Extend these fields to match whatever the backend actually returns.
  // Using `any` so TypeScript doesn't complain about unknown extra fields.
  [key: string]: any;
}

// ── Endpoint functions ────────────────────────────────────────────────────────

/**
 * 1. SIGNUP
 * POST /api/v1/auth/signup/
 */
export async function apiSignup(payload: SignupPayload) {
  return request("/api/v1/auth/signup/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 2. VERIFY OTP
 * POST /api/v1/auth/verify/
 */
export async function apiVerifyOtp(payload: VerifyOtpPayload) {
  return request("/api/v1/auth/verify/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 3. RESEND OTP
 * POST /api/v1/auth/resend-otp/
 */
export async function apiResendOtp(payload: ResendOtpPayload) {
  return request("/api/v1/auth/resend-otp/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 4. LOGIN
 * POST /api/v1/auth/login/
 */
export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/api/v1/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 5. DASHBOARD
 * GET /api/v1/dashboard/   (requires Bearer token)
 */
export async function apiGetDashboard(): Promise<DashboardData> {
  return request<DashboardData>(
    "/api/v1/dashboard/",
    { method: "GET" },
    true // attach auth header
  );
}
