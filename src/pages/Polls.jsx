import { useState, useEffect } from "react";
import { Vote, PlusSquare, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CreatePollModal } from "../components/CreatePollModal";
import { PollCard } from "../components/PollCard";
import { ConfirmationModal } from "../components/ConfirmationModal";

const Polls = ({ isCreateModalOpen, setCreateModalOpen }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [locationScope, setLocationScope] = useState("Local");
  const { user } = useAuth();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/polls");
      setPolls(res.data);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleVote = async (optionId) => {
    if (!user) return;
    try {
      await api.post(`/polls/vote/${optionId}`);
      fetchPolls(true);
    } catch (err) { }
  };

  const handleDelete = async () => {
    if (!pollToDelete) return;
    try {
      await api.delete(`/polls/${pollToDelete._id}`);
      fetchPolls(true);
      setPollToDelete(null);
    } catch (err) { }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar">
      {/* Mobile Unified Dashboard for Polls */}
      {/* <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3 text-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-500/10">
              <Vote size={16} className="text-primary-500" />
            </div>
            <span className="text-[12px]   font-medium  ">Ask the community...</span>
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
      </div> */}

      <div className="px-4 hidden md:block mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/10 pb-6">
          <div className="space-y-1 max-w-full overflow-hidden">
            <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
              <Vote className="text-primary-500 shrink-0" size={24} />
              <span className="truncate">Consensus</span>
              <span className="text-[12px] md:text-[12px] text-slate-500 font-medium ml-2 opacity-50 shrink-0">
                Live Poll
              </span>
            </h1>
            <p className="text-[12px] md:text-[12px] font-medium text-slate-500 md:ml-9">
              Turn opinions into action — create a poll.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg   font-medium text-[12px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/10"
            >
              <PlusSquare size={16} />
              Create Poll
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-3 md:px-4 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary-500/10 border-t-primary-500 animate-spin shadow-[0_0_20px_rgba(227,67,67,0.1)]"></div>
              <Vote className="absolute inset-0 m-auto text-primary-500 animate-pulse" size={24} />
            </div>
            <p className="text-slate-500 text-[12px]   font-medium">Synchronizing Signals...</p>
          </div>
        ) : (
          <>
            {polls.length > 0 ? (
              polls.map((poll) => (
                <PollCard
                  key={poll._id}
                  poll={poll}
                  user={user}
                  onVote={handleVote}
                  onDelete={setPollToDelete}
                />
              ))
            ) : (
              <div className="py-32 text-center space-y-4 opacity-40">
                <Vote size={48} className="mx-auto text-slate-500" />
                <p className="text-slate-500 text-[12px]   font-medium     ">
                  No active signals received
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {isCreateModalOpen && (
        <CreatePollModal
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => {
            setCreateModalOpen(false);
            fetchPolls();
          }}
        />
      )}

      {pollToDelete && (
        <ConfirmationModal
          isOpen={!!pollToDelete}
          onClose={() => setPollToDelete(null)}
          title="Dismantle Signal"
          message="Are you sure you want to permanently dismantle this consensus poll? All protocol data will be erased."
          onConfirm={handleDelete}
          confirmText="Dismantle"
          isDanger={true}
        />
      )}
    </div>
  );
};

export default Polls;
