import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, User } from "lucide-react";
import { MiniPlayer } from "./MiniPlayer";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => (
  <div className="sticky bottom-0 z-30">
    <MiniPlayer />
    <nav className="flex items-stretch justify-around border-t border-border bg-surface/90 px-2 pt-2 pb-3 backdrop-blur-md">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              isActive ? "text-primary-deep" : "text-muted-foreground"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  </div>
);
