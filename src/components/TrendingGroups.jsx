import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export const TrendingGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/groups");
        const sorted = (res.data || [])
          .sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0))
          .slice(0, 3);

        setGroups(sorted);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading || groups.length === 0) return null;

  return (
    <div className="glass rounded-lg p-5 space-y-4 border-white/5">
      <h3 className="text-[12px]   font-medium   text-slate-500">
        Trending Groups
      </h3>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => navigate(`/groups`)}
            className="group flex items-center gap-4 p-3 rounded-lg bg-slate-900/40 border border-white/5
                       hover:border-primary-500/30 hover:bg-slate-900/60 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 blur-2xl -mr-12 -mt-12 group-hover:bg-primary-600/10 transition-colors" />
            <div
              className="w-10 h-10 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-center
                            text-primary-500 font-semibold text-[12px] overflow-hidden shrink-0 shadow-lg"
            >
              {group.image ? (
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                group?.name?.charAt(0) || "G"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[12px] font-medium text-slate-300 truncate group-hover:text-primary-400 transition-colors">
                {group.name}
              </h4>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Users size={10} className="text-primary-500" />
                {group.membersCount || 0} Members
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary-500/60 group-hover:bg-primary-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
