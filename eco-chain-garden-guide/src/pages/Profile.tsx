import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import {
  User, Mail, MapPin, Calendar, ShieldCheck, LogOut,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Derive initials from name (e.g. "Amara Okafor" → "AO", "mimi" → "M")
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Pull extra fields from localStorage (stored during login)
  const stored = (() => {
    try {
      const raw = localStorage.getItem("eco_user");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const location = stored.location ?? "—";
  const status   = stored.status   ?? "ACTIVE";
  const joined   = stored.created_at
    ? new Date(stored.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <AppLayout>
      <header className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-[32px] font-semibold text-on-surface leading-tight">
          My Profile
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Your account details and preferences.
        </p>
      </header>

      <div className="max-w-2xl space-y-5">

        {/* ── Avatar card ── */}
        <div className="bg-card rounded-card shadow-soft p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar circle with name initial */}
          <div
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0"
            aria-label={`Avatar for ${user?.name}`}
          >
            <span className="text-[32px] font-bold text-white leading-none select-none">
              {initials}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-headline-md text-on-surface">{user?.name ?? "—"}</h2>
            <p className="text-body-md text-on-surface-variant mt-0.5">{user?.email ?? "—"}</p>

            {/* Status badge */}
            <span
              className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-semibold ${
                status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              <ShieldCheck size={12} />
              {status}
            </span>
          </div>
        </div>

        {/* ── Detail rows ── */}
        <div className="bg-card rounded-card shadow-soft overflow-hidden">
          {[
            { icon: User,     label: "Full Name",  value: user?.name  ?? "—" },
            { icon: Mail,     label: "Email",       value: user?.email ?? "—" },
            { icon: MapPin,   label: "Location",    value: location },
            { icon: Calendar, label: "Member since", value: joined },
          ].map(({ icon: Icon, label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center gap-4 px-6 py-4 ${
                i < arr.length - 1 ? "border-b border-outline-variant/60" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                <Icon size={16} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-caption text-on-surface-variant uppercase tracking-wider">{label}</div>
                <div className="text-body-md text-on-surface mt-0.5 truncate">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Logout button ── */}
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-lg border border-red-200 text-red-600 text-label-md hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
