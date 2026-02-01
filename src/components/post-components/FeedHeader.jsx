import { MapPin, Globe } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export function FeedHeader({ location, locationScope, setLocationScope }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between relative px-1 sm:px-0">
      <div className="relative rounded-md w-full md:w-[400px] group order-2 md:order-1">
        <h1 className="text-xl md:text-2xl font-medium text-white   er line-clamp-1">
          {search ? (
            `Results for "${search}"`
          ) : (
            <>
              <span className="text-primary-500">Town</span> Beat Feed
            </>
          )}
        </h1>
        <p className="text-[10px] md:text-[11px] font-medium text-slate-500">
          The Pulse of Your Region
        </p>
      </div>
      <div className="flex items-center gap-1.5 p-1 glass rounded-lg border-white/5 order-1 md:order-2 self-end md:self-auto overflow-x-auto no-scrollbar max-w-full">
        <button
          onClick={() => setLocationScope("Local")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all shrink-0 ${locationScope === "Local" ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20" : "text-slate-400 hover:text-slate-300 hover:bg-white/5"}`}
        >
          <MapPin size={10} />
          {location || "Rampur"}
        </button>
        <button
          onClick={() => setLocationScope("Global")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all shrink-0 ${locationScope === "Global" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-300 hover:bg-white/5"}`}
        >
          <Globe size={10} />
          Global
        </button>
      </div>
    </div>
  );
}
