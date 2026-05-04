import { NavLink } from "react-router-dom";
import { Home, Library, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: Library },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => (
  <nav className="sticky bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-surface/90 px-2 pt-2 pb-3 backdrop-blur-md">
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
);
