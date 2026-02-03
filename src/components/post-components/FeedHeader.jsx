import { MapPin, Globe } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export function FeedHeader({ location, locationScope, setLocationScope }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  return (
    <>
      <div className="hidden md:flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between relative px-1 sm:px-0">
        <div className="relative rounded-md w-full md:w-100">
          <h1 className="text-2xl font-medium text-white line-clamp-1">
            {search ? (
              `Results for "${search}"`
            ) : (
              <>
                <span className="text-primary-500">Town</span> Beat Feed
              </>
            )}
          </h1>
          <p className="text-[12px] font-medium text-slate-500">
            The Pulse of Your Region
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 glass rounded-lg border-white/5">
          <button
            onClick={() => setLocationScope("Local")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${locationScope === "Local"
                ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
              }`}
          >
            <MapPin size={12} />
            {location || "Rampur"}
          </button>

          <button
            onClick={() => setLocationScope("Global")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${locationScope === "Global"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
              }`}
          >
            <Globe size={12} />
            Global
          </button>
        </div>
      </div>

      <div className="flex md:hidden flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl   font-medium text-white  ">
              {search ? `Results for "${search}"` : <>Town <span className="text-primary-500">Beat</span></>}
            </h1>
            <p className="text-[12px] text-slate-500   font-medium      -mt-0.5">The Pulse of Your Region</p>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 bg-white/5 rounded-lg border border-white/5">
            <button
              onClick={() => setLocationScope("Local")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px]   font-medium transition-all ${locationScope === "Local"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                  : "text-slate-400"
                }`}
            >
              <MapPin size={10} />
              {location || "Local"}
            </button>

            <button
              onClick={() => setLocationScope("Global")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px]   font-medium transition-all ${locationScope === "Global"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400"
                }`}
            >
              <Globe size={10} />
              Global
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
