/**
 * hooks/useDashboard.ts
 * ----------------------
 * Custom React hook for fetching dashboard data from the backend.
 *
 * • Fires automatically on mount (via useEffect)
 * • Skips the request entirely if no access token is present
 * • Attaches the stored Bearer token via apiGetDashboard()
 * • Listens for `eco:unauthorized` to redirect to /login on a stale/bad token
 * • Exposes: dashboardData, isLoading, error
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetDashboard, getToken, DashboardData } from "@/services/api";

export function useDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Redirect to /login whenever a 401 is detected anywhere in the app ──────
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login");
    };
    window.addEventListener("eco:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("eco:unauthorized", handleUnauthorized);
  }, [navigate]);

  // ── Fetch dashboard data ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      // Guard: no point hitting the API if there's no token
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        setError("You are not logged in. Please log in to view your dashboard.");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await apiGetDashboard();
        if (!cancelled) setDashboardData(data);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load dashboard. Please refresh.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDashboard();
    return () => { cancelled = true; };
  }, [navigate]);

  return { dashboardData, isLoading, error };
}

