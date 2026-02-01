import { Sparkles } from "lucide-react";

export function NewsFilter({ locationScope, location, category, setCategory }) {
  return (
    <div className="space-y-3 my-8">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Sparkles size={14} className="text-primary-400" />
          <span>
            {locationScope === "Local"
              ? `${location || "Rampur"} Signal`
              : "Global Signal"}
          </span>
        </div>

        <span className="text-[10px] uppercase    text-slate-500">
          Filter
        </span>
      </div>

      <div className="relative flex items-center gap-1 p-1 rounded-lg bg-slate-900/60 border border-white/5 backdrop-blur">
        {["All", "Politics", "Civic", "Development"].map((cat) => {
          const active = category === cat;

          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                relative px-4 py-1.5 rounded-lg text-[11px] font-semibold
                transition-all duration-200
                ${
                  active
                    ? "text-primary-400"
                    : "text-slate-400 hover:text-slate-300"
                }
            `}
            >
              {active && (
                <span className="absolute inset-0 rounded-lg bg-primary-500/10 shadow-inner shadow-primary-500/20" />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
