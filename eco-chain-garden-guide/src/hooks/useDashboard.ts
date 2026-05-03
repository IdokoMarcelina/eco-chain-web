/**
 * hooks/useDashboard.ts
 * ----------------------
 * Custom React hook for fetching dashboard data from the backend.
 *
 * • Fires automatically on mount (via useEffect)
 * • Attaches the stored Bearer token via apiGetDashboard()
 * • Exposes: dashboardData, isLoading, error
 *
 * Usage:
 *   const { dashboardData, isLoading, error } = useDashboard();
 */

import { useState, useEffect } from "react";
import { apiGetDashboard, DashboardData } from "@/services/api";

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false; // prevent state updates after component unmounts

    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiGetDashboard();

        // Only update state if the component is still mounted
        if (!cancelled) {
          setDashboardData(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err.message ?? "Failed to load dashboard. Please refresh."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();

    // Cleanup: mark as cancelled so stale responses are ignored
    return () => {
      cancelled = true;
    };
  }, []); // runs once on mount

  return { dashboardData, isLoading, error };
}
