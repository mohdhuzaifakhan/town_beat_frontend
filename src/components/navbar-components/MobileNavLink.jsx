import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const MobileNavLink = ({ to, icon, active, color }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg transition-all ${
      active ? color : "text-slate-500"
    }`}
  >
    <div className={`transition-all duration-300 ${active ? "scale-110" : ""}`}>
      {icon}
    </div>
    {active && (
      <motion.div
        layoutId="mobile-nav-active"
        className="w-1 h-1 bg-current rounded-full"
      />
    )}
  </Link>
);
