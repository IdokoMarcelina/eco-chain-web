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
      <main className="ml-[220px] page-fade">
        <div className="px-16 py-10 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
};
