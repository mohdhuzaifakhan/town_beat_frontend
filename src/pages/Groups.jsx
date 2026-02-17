import { useState, useEffect } from "react";
import { Users, PlusSquare, Loader2, Globe, Shield } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { GroupCard } from "../components/GroupCard";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { motion } from "framer-motion";

const Groups = ({ isCreateModalOpen, setCreateModalOpen }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("explore");
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [locationScope, setLocationScope] = useState("Local"); // Added for consistency
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
        setError("Security System Error: The provided access code is invalid or has expired.");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Encryption Failure: Could not establish a secure connection to join the group.");
      setShowErrorModal(true);
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
    <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar">
      {/* Mobile Unified Dashboard for Groups */}
      {/* <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3 text-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-500/10">
              <PlusSquare size={16} className="text-primary-500" />
            </div>
            <span className="text-[12px] font-medium">Create a group...</span>
          </div>

          <button
            onClick={() => setLocationScope(locationScope === "Local" ? "Global" : "Local")}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex flex-col items-center justify-center min-w-[70px] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${locationScope === "Local" ? "bg-primary-500 animate-pulse" : "bg-blue-400"}`} />
              <span className="text-[12px]   font-medium text-white truncate max-w-[80px]">
                {locationScope === "Local" ? (user?.location || "Local") : "Global"}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-white/10 shadow-inner">
          {[
            { id: "explore", label: "Explore", icon: <Globe size={12} /> },
            { id: "my", label: "Joined", icon: <Users size={12} /> },
            { id: "unlock", label: "Private", icon: <Shield size={12} /> }
          ].map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px]   font-medium transition-all ${active ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40" : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div> */}

      <div className="px-4 hidden md:block mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/10 pb-6">
          <div className="space-y-1 max-w-full overflow-hidden">
            <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full">
              <Users className="text-primary-500 shrink-0" size={24} />
              <span className="truncate text-white">Groups</span>
            </h1>
            <p className="text-[12px] text-slate-500 md:ml-9">
              Connect with people in your area
            </p>
          </div>
          {user && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-medium text-[12px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/10"
            >
              <PlusSquare size={14} />
              Create Group
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex p-1 bg-slate-900 rounded-lg border border-white/10 w-full sm:w-auto shadow-inner">
            {["explore", "my", "unlock"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2 rounded-lg text-[12px]   font-medium transition-all ${view === v ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40" : "text-slate-500 hover:text-white"}`}
              >
                {v === "explore" ? "Explore" : v === "my" ? "Joined" : "Private"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 md:px-4 mt-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary-500/10 border-t-primary-500 animate-spin shadow-[0_0_20px_rgba(227,67,67,0.1)]"></div>
              <Users className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={20} />
            </div>
            <p className="text-slate-400 text-[12px] font-medium">Loading Groups...</p>
          </div>
        ) : view === "unlock" ? (
          <div className="col-span-full max-w-md mx-auto py-12 text-center space-y-8 px-4">
            <div className="space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary-500/10 flex items-center justify-center mx-auto border border-primary-500/20 shadow-2xl">
                <Shield className="text-primary-400" size={28} />
              </div>
              <h2 className="text-lg md:text-xl   font-medium text-white  ">Join Private Group</h2>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                Enter the invite code shared by your community to join their private group.
              </p>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-5">
              <input
                type="text"
                value={inviteCode}
                autoFocus
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Invite Code"
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg py-3 px-4 text-center text-2xl   font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all shadow-2xl outline-none"
                maxLength={8}
              />
              {error && <p className="text-rose-500 text-[12px] font-medium">{error}</p>}
              <button
                type="submit"
                disabled={joining || !inviteCode.trim()}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white   font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-2xl shadow-primary-900/40 text-[12px] border border-white/10"
              >
                {joining ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Join Group"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <GroupCard key={group._id} group={group} onUpdate={fetchGroups} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center space-y-4 opacity-40">
                <Users size={48} className="mx-auto text-slate-500" />
                <p className="text-slate-500 text-[12px] font-medium">
                  {view === "my" ? "No group connections linked" : "No groups discovered"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Global Group Create Modal */}
      {isCreateModalOpen && (
        <CreateGroupModal
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => {
            setCreateModalOpen(false);
            fetchGroups();
          }}
        />
      )}

      {showErrorModal && (
        <ConfirmationModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          onConfirm={() => setShowErrorModal(false)}
          title="Security System Alert"
          message={error}
          confirmText="Acknowledge"
          isDanger={true}
        />
      )}
    </div>
  );
};

export default Groups;
