import { NavLink } from "react-router-dom";
import { Leaf, Wrench, User, Settings } from "lucide-react";

const navItems = [
  { to: "/green-match", label: "Green Match", icon: Leaf },
  { to: "/dashboard", label: "Maintenance", icon: Wrench },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-primary flex flex-col px-4 py-6 z-40">
      <div className="px-2 mb-8">
        <h1 className="text-headline-md">
          <span className="text-white">Eco</span><span style={{ color: "#8a9a5b" }}>-Chain</span>
        </h1>
        <p className="text-caption text-primary-muted mt-1">Regenerative Living</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
      </nav>

      <button className="bg-secondary text-white w-full h-11 rounded-lg text-label-md hover:opacity-90 transition-opacity">
        Invest Now
      </button>
    </aside>
  );
};
