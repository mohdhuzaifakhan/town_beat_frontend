import { MobileNavLink } from "./MobileNavLink";
import { Home, Users, PlusSquare, PieChart, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavbar({location}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 bg-slate-950/80 backdrop-blur-xl px-2 py-1">
      <div className="flex items-center justify-around h-16">
        <MobileNavLink
          to="/"
          icon={<Home size={22} />}
          active={location.pathname === "/"}
          color="text-sky-400"
        />
        <MobileNavLink
          to="/groups"
          icon={<Users size={22} />}
          active={location.pathname === "/groups"}
          color="text-amber-400"
        />
        <Link to="/profile" className="flex items-center justify-center -mt-8">
          <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50 border-4 border-slate-950">
            <PlusSquare className="text-white" size={24} />
          </div>
        </Link>
        <MobileNavLink
          to="/polls"
          icon={<PieChart size={22} />}
          active={location.pathname === "/polls"}
          color="text-emerald-400"
        />
        <MobileNavLink
          to="/campaigns"
          icon={<Megaphone size={22} />}
          active={location.pathname === "/campaigns"}
          color="text-rose-400"
        />
      </div>
    </div>
  );
}
