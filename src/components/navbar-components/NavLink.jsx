import { Link } from "react-router-dom";

export const NavLink = ({ to, icon, label, active, color }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all font-bold text-sm group relative ${
      active
        ? "bg-white/5 text-white"
        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
    }`}
  >
    <span
      className={`${active ? color : "text-slate-500 group-hover:text-slate-300"} transition-colors`}
    >
      {icon}
    </span>
    <span className="  ">{label}</span>
  </Link>
);
