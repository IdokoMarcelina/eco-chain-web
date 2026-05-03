import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Bell, Moon, Globe, Shield, ChevronRight, LogOut,
} from "lucide-react";

const SettingRow = ({
  icon: Icon,
  label,
  sublabel,
  onClick,
  danger = false,
}: {
  icon: any;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors text-left group ${
      danger ? "hover:bg-red-50" : ""
    }`}
  >
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        danger ? "bg-red-50" : "bg-surface-container"
      }`}
    >
      <Icon size={16} className={danger ? "text-red-500" : "text-on-surface-variant"} />
    </div>
    <div className="flex-1 min-w-0">
      <div className={`text-body-md ${danger ? "text-red-600" : "text-on-surface"}`}>{label}</div>
      {sublabel && (
        <div className="text-caption text-on-surface-variant mt-0.5">{sublabel}</div>
      )}
    </div>
    <ChevronRight
      size={16}
      className={`shrink-0 ${danger ? "text-red-400" : "text-on-surface-variant"} group-hover:translate-x-0.5 transition-transform`}
    />
  </button>
);

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppLayout>
      <header className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-[32px] font-semibold text-on-surface leading-tight">
          Settings
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Manage your app preferences and account.
        </p>
      </header>

      <div className="max-w-2xl space-y-5">

        {/* ── Preferences ── */}
        <section>
          <h2 className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 px-1">
            Preferences
          </h2>
          <div className="bg-card rounded-card shadow-soft overflow-hidden">
            <SettingRow
              icon={Bell}
              label="Notifications"
              sublabel="Care reminders and updates"
            />
            <div className="border-t border-outline-variant/60" />
            <SettingRow
              icon={Moon}
              label="Appearance"
              sublabel="Light mode"
            />
            <div className="border-t border-outline-variant/60" />
            <SettingRow
              icon={Globe}
              label="Language & Region"
              sublabel="English (UK)"
            />
          </div>
        </section>

        {/* ── Account ── */}
        <section>
          <h2 className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 px-1">
            Account
          </h2>
          <div className="bg-card rounded-card shadow-soft overflow-hidden">
            <SettingRow
              icon={Shield}
              label="Privacy & Security"
              sublabel="Password, data, and permissions"
            />
          </div>
        </section>

        {/* ── Danger zone ── */}
        <section>
          <h2 className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 px-1">
            Session
          </h2>
          <div className="bg-card rounded-card shadow-soft overflow-hidden">
            <SettingRow
              icon={LogOut}
              label="Log out"
              sublabel="Sign out of your Eco-Chain account"
              onClick={handleLogout}
              danger
            />
          </div>
        </section>

        <p className="text-caption text-on-surface-variant/60 text-center pt-2">
          Eco-Chain v1.0 · © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
