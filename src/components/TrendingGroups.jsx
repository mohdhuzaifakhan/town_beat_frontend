import { useState, useEffect } from "react";
import api from "../api/client";

export const TrendingGroups = () => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    api.get("/groups").then((res) => setGroups(res.data));
  }, []);

  return (
    <div className="glass rounded-lg p-5 space-y-4 shadow-none border-white/5">
      <h3 className="text-xs font-bold text-slate-600">
        Trending Groups
      </h3>
      <div className="space-y-3">
        {groups.slice(0, 3).map((group) => (
          <div
            key={group._id}
            className="flex items-center gap-3 group cursor-pointer relative"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400 font-bold text-xs overflow-hidden shadow-sm shadow-black/40">
              {group.image ? (
                <img src={group.image} className="w-full h-full object-cover" />
              ) : (
                group.name[0]
              )}
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-400 group-hover:text-primary-400 transition-colors">
                {group.name}
              </h4>
              <p className="text-xs font-medium text-slate-600 opacity-60">
                {group.membersCount} Members
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
