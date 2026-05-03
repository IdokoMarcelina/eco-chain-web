import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      {/* Desktop: offset by sidebar width. Mobile: offset by top bar height */}
      <main className="lg:ml-[220px] pt-14 lg:pt-0 page-fade">
        <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-10 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
};

