import { NavLink } from "./NavLink";
import { Home, Users, PieChart, Megaphone } from "lucide-react";

export function WebNavigation({ location }) {
  return (
    <>
      {/* Main Navigation - Centered/Left (Desktop) */}
      <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
        <NavLink
          to="/"
          icon={<Home size={18} />}
          label="Feed"
          active={location.pathname === "/"}
          color="text-sky-400"
        />
        <NavLink
          to="/groups"
          icon={<Users size={18} />}
          label="Groups"
          active={location.pathname === "/groups"}
          color="text-amber-400"
        />
        <NavLink
          to="/polls"
          icon={<PieChart size={18} />}
          label="Polls"
          active={location.pathname === "/polls"}
          color="text-emerald-400"
        />
        <NavLink
          to="/campaigns"
          icon={<Megaphone size={18} />}
          label="Campaigns"
          active={location.pathname === "/campaigns"}
          color="text-rose-400"
        />
      </div>
    </>
  );
}
