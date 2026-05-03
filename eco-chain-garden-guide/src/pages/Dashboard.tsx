import { Droplets, Leaf, Star, Plus, ArrowRight, ClipboardList, Wrench, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { myPlants, careTasks } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";

const StatCard = ({
  icon: Icon, label, value, iconBg, iconColor,
}: { icon: any; label: string; value: string; iconBg: string; iconColor: string }) => (
  <div className="bg-card rounded-card shadow-soft p-6 flex flex-col gap-3">
    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
      <Icon size={20} style={{ color: iconColor }} />
    </div>
    <div>
      <div className="text-[32px] font-semibold text-on-surface leading-none">{value}</div>
      <div className="text-label-md text-on-surface-variant mt-2">{label}</div>
    </div>
  </div>
);

const ActionTile = ({
  to, icon: Icon, title, subtitle, color,
}: { to: string; icon: any; title: string; subtitle: string; color: string }) => (
  <Link to={to} className="bg-card rounded-card shadow-soft p-5 flex items-center gap-4 hover:shadow-card transition-shadow group">
    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div className="flex-1">
      <div className="text-label-md text-on-surface">{title}</div>
      <div className="text-caption text-on-surface-variant mt-0.5">{subtitle}</div>
    </div>
    <ArrowRight size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // ── Real backend data ──────────────────────────────────────────────────────
  // dashboardData contains the raw API response (extend UI when backend fields are confirmed).
  const { dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();

  return (
    <AppLayout>
      {/* ── Dashboard loading / error feedback ── */}
      {isDashboardLoading && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant text-sm">
          Loading your dashboard data…
        </div>
      )}
      {dashboardError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {dashboardError}
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-headline-lg text-on-surface">Welcome, {user?.name}</h1>
        <p className="text-body-md text-on-surface-variant mt-1">{today}</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Droplets} label="Water Saved" value="420 L" iconBg="hsl(17 55% 38% / 0.12)" iconColor="hsl(17 55% 38%)" />
        <StatCard icon={Leaf} label="CO₂ Offset" value="12.5 kg" iconBg="hsl(138 53% 6% / 0.1)" iconColor="hsl(138 53% 6%)" />
        <StatCard icon={Star} label="Biodiversity Score" value="78/100" iconBg="hsl(75 24% 49% / 0.18)" iconColor="hsl(75 24% 49%)" />
      </section>

      {/* My Plants */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-md text-on-surface">My Plants</h2>
          <button className="inline-flex items-center gap-2 px-4 h-10 border border-primary text-primary rounded-lg text-label-md hover:bg-primary hover:text-white transition-colors">
            <Plus size={16} /> Add Plant
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {myPlants.map((p) => (
            <div key={p.id} className="w-[240px] shrink-0 bg-card rounded-card shadow-soft overflow-hidden hover:shadow-card transition-all hover:scale-[1.01]">
              <img src={p.image} alt={p.name} className="w-full h-[160px] object-cover" loading="lazy" />
              <div className="p-4">
                <div className="text-body-md font-semibold text-on-surface">{p.name}</div>
                <div className="text-caption text-on-surface-variant italic">{p.scientific}</div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-caption text-on-surface-variant">
                    <Droplets size={12} className="text-secondary" /> {p.lastWatered}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-caption" style={{ background: "hsl(75 24% 49% / 0.15)", color: "hsl(75 24% 35%)" }}>
                    {p.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tasks */}
      <section className="mb-10">
        <h2 className="text-headline-md text-on-surface mb-4">Upcoming Tasks</h2>
        <div className="bg-card rounded-card shadow-soft overflow-hidden">
          {careTasks.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-5 py-4 hover:bg-surface-container transition-colors ${
                i < careTasks.length - 1 ? "border-b border-outline-variant/60" : ""
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: t.status === "overdue" ? "hsl(17 55% 38%)" : "hsl(138 53% 6%)" }}
              />
              <span className="flex-1 text-body-md text-on-surface">{t.title}</span>
              <span className="text-label-md text-on-surface-variant">{t.due}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-headline-md text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionTile to="/green-match" icon={Search} title="Find New Plants" subtitle="Open Green Match" color="hsl(138 53% 6%)" />
          <ActionTile to="/dashboard" icon={ClipboardList} title="Log Care Task" subtitle="Record today's work" color="hsl(17 55% 38%)" />
          <ActionTile to="/dashboard" icon={Wrench} title="Maintenance Schedule" subtitle="View upcoming work" color="hsl(75 24% 49%)" />
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
