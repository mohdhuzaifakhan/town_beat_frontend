import { useState, useEffect } from "react";
import { Vote, PlusSquare, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CreatePollModal } from "../components/CreatePollModal";
import { PollCard } from "../components/PollCard";
import { ConfirmationModal } from "../components/ConfirmationModal";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
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
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!pollToDelete) return;
    try {
      await api.delete(`/polls/${pollToDelete._id}`);
      fetchPolls(true);
      setPollToDelete(null);
    } catch (err) {}
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 pb-20 mt-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-1 max-w-full overflow-hidden">
          <div className="space-y-1 max-w-full overflow-hidden">
            <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
              <Vote className="text-primary-500 shrink-0" size={24} />
              <span className="truncate">Consensus</span>
              <span className="text-[11px] md:text-[12px] text-slate-500 font-medium ml-2 opacity-50 shrink-0">
                Live Poll
              </span>
            </h1>
            <p className="text-[10px] md:text-[11px] font-medium text-slate-500 md:ml-9 truncate">
              Turn opinions into action — create a poll.
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 sm:py-3 rounded-lg font-bold text-[11px] sm:text-[11px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-900/40 border border-white/10 active:scale-95"
          >
            <PlusSquare size={16} />
            Create Poll
          </button>
        )}
      </div>

      {showCreate && (
        <CreatePollModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchPolls}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-primary-400" size={28} />
          <p className="text-slate-500 text-[12px] font-medium ">
            Creating Poll...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {polls.map((poll) => (
            <PollCard
              key={poll._id}
              poll={poll}
              user={user}
              onVote={handleVote}
              onDelete={setPollToDelete}
            />
          ))}
          {polls.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mx-auto grayscale opacity-10">
                <Vote size={40} />
              </div>
              <p className="text-slate-500 text-[12px] font-medium">
                No active Poll created.
              </p>
            </div>
          )}
        </div>
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
