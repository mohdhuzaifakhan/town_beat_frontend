import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function NewsFilter({ locationScope, location, category, setCategory }) {
  return (
    <div className="space-y-2 py-1 md:py-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[12px]   font-medium text-slate-500     ">
          <Sparkles size={12} className="text-primary-500" />
          <span>
            {locationScope === "Local"
              ? `${location || "Rampur"} Feed`
              : "Global Feed"}
          </span>
        </div>

        <span className="text-[12px]      font-medium text-slate-600  ">
          Filter
        </span>
      </div>

      <div className="relative flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/40 border border-white/5 backdrop-blur-sm min-w-max">
          {["All", "Politics", "Civic", "Development"].map((cat) => {
            const active = category === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  relative px-5 py-2 rounded-lg text-[12px]   font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${
                    active
                      ? "text-primary-400"
                      : "text-slate-500 hover:text-slate-300"
                  }
              `}
              >
                {active && (
                  <motion.span
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-lg bg-primary-500/10 shadow-inner shadow-primary-500/20"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
