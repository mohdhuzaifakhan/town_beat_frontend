import { useState, useEffect } from "react";
import { Users, PlusSquare, Loader2, Globe, Shield } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { GroupCard } from "../components/GroupCard";
import { CreateGroupModal } from "../components/CreateGroupModal";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("explore"); // 'explore', 'my', or 'unlock'
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups");
      setGroups(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setJoining(true);
    setError("");
    try {
      const res = await api.post("/groups/join-by-code", {
        code: inviteCode.trim().toUpperCase(),
      });
      if (res.data) {
        await fetchGroups();
        setView("my");
        setInviteCode("");
      } else {
        setError("Invalid synchronization code. Please check and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to establish connection. Sector may be offline.");
    } finally {
      setJoining(false);
    }
  };

  const filteredGroups = groups.filter((g) => {
    if (view === "explore") return true;
    if (view === "my") {
      return g.members.includes(user?._id) || g.owner === user?._id;
    }
    return false;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 pb-20 mt-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6">
        <div className="space-y-1 max-w-full overflow-hidden">
          <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full">
            <Users className="text-amber-500 shrink-0" size={24} />
            <span className="truncate">Regional Groups</span>
            <span className="text-[11px] md:text-[12px] text-slate-600 font-medium ml-2 opacity-50 shrink-0">
              Beta Access
            </span>
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium  text-slate-600 md:ml-9 truncate">
            Sector-Specific Citizen Coalitions
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium text-[11px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/10"
          >
            <PlusSquare size={14} />
            Establish Coalition
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-900/80 rounded-lg border border-white/5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setView("explore")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${view === "explore" ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            Explore
          </button>
          <button
            onClick={() => setView("my")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${view === "my" ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            Joined
          </button>
          <button
            onClick={() => setView("unlock")}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${view === "unlock" ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            Unlock
          </button>
        </div>
      </div>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchGroups}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="animate-spin text-primary-400" size={24} />
          <p className="text-slate-400 text-sm font-bold">
            Synchronizing Sectors...
          </p>
        </div>
      ) : view === "unlock" ? (
        <div className="max-w-md mx-auto py-12 text-center space-y-8">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto border border-primary-500/20">
              <Shield className="text-primary-400" size={32} />
            </div>
            <h2 className="text-lg font-medium text-white">Sync New Sector</h2>
            <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Enter the unique invite code shared by the community to link your
              node to their sector.
            </p>
          </div>

          <form onSubmit={handleJoinByCode} className="space-y-4 px-4">
            <div className="relative group">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setError("");
                }}
                placeholder="CODE..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-6 px-4 text-center text-2xl md:text-3xl font-medium text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all shadow-2xl"
                maxLength={8}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-500 text-[12px] font-medium pt-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={joining || !inviteCode.trim()}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-5 rounded-2xl transition-all duration-500 disabled:opacity-30 active:scale-[0.98] shadow-2xl shadow-primary-900/60 text-[12px] border border-white/10 mt-4"
            >
              {joining ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Establish Sync Connection"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard key={group._id} group={group} onUpdate={fetchGroups} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="flex justify-center flex-wrap gap-2 opacity-20 filter grayscale">
                <Users size={48} className="text-slate-500" />
              </div>
              <p className="text-slate-500 text-xs font-bold">
                {view === "my"
                  ? "No active sector connections found."
                  : "No communities discovered in this region."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
