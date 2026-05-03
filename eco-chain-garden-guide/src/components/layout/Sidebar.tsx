import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Leaf, Wrench, User, Settings, X, Menu } from "lucide-react";

const navItems = [
  { to: "/green-match", label: "Green Match", icon: Leaf },
  { to: "/dashboard", label: "Maintenance", icon: Wrench },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItems = ({ onNav }: { onNav?: () => void }) => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNav}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-label-md relative ${
              isActive
                ? "bg-primary-container text-white"
                : "text-primary-muted hover:bg-primary-container hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r" style={{ background: "#8a9a5b" }} />
              )}
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[220px] bg-primary flex-col px-4 py-6 z-40">
        <div className="px-2 mb-8">
          <h1 className="text-headline-md">
            <span className="text-white">Eco</span>
            <span style={{ color: "#8a9a5b" }}>-Chain</span>
          </h1>
          <p className="text-caption text-primary-muted mt-1">Regenerative Living</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavItems />
        </nav>

        <button className="bg-secondary text-white w-full h-11 rounded-lg text-label-md hover:opacity-90 transition-opacity">
          Invest Now
        </button>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-primary flex items-center justify-between px-4 z-40">
        <h1 className="text-headline-md">
          <span className="text-white">Eco</span>
          <span style={{ color: "#8a9a5b" }}>-Chain</span>
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-primary-container transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Mobile drawer overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Drawer panel */}
          <aside
            className="relative w-[260px] bg-primary h-full flex flex-col px-4 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 mb-8">
              <h1 className="text-headline-md">
                <span className="text-white">Eco</span>
                <span style={{ color: "#8a9a5b" }}>-Chain</span>
              </h1>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-primary-muted hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              <NavItems onNav={() => setMobileOpen(false)} />
            </nav>

            <button className="bg-secondary text-white w-full h-11 rounded-lg text-label-md hover:opacity-90 transition-opacity">
              Invest Now
            </button>
          </aside>
        </div>
      )}
    </>
  );
};
