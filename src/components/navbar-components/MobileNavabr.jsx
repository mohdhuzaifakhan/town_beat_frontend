import { MobileNavLink } from "./MobileNavLink";
import { Home, Users, PlusSquare, PieChart, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

export function MobileNavbar({ location, onCreatePost }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass !rounded-[0px] border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl px-2 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto relative">
        <MobileNavLink
          to="/"
          icon={<Home size={22} strokeWidth={2.5} />}
          active={location.pathname === "/"}
          color="text-primary-400"
        />
        <MobileNavLink
          to="/groups"
          icon={<Users size={22} strokeWidth={2.5} />}
          active={location.pathname === "/groups"}
          color="text-amber-400"
        />

        {/* Central Action Button */}
        <div className="relative -mt-10 flex flex-col items-center">
          <button
            onClick={onCreatePost}
            className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(227,67,67,0.6)] border-4 border-slate-950 active:scale-90 transition-transform duration-200"
          >
            <PlusSquare className="text-white" size={26} strokeWidth={2.5} />
          </button>
          <span className="text-[12px]   font-medium text-slate-500 mt-1     ">Create</span>
        </div>

        <MobileNavLink
          to="/polls"
          icon={<PieChart size={22} strokeWidth={2.5} />}
          active={location.pathname === "/polls"}
          color="text-emerald-400"
        />
        <MobileNavLink
          to="/campaigns"
          icon={<Megaphone size={22} strokeWidth={2.5} />}
          active={location.pathname === "/campaigns"}
          color="text-rose-400"
        />
      </div>
    </div>
  );
}
