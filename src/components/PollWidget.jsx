import { useState, useEffect } from "react";
import { PieChart } from "lucide-react";
import api from "../api/client";
import { Link } from "react-router-dom";

export const PollWidget = ({ userId }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await api.get("/polls");
        setPolls(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading)
    return <div className="glass rounded-lg p-6 animate-pulse h-32" />;

  const activePoll = polls.find(
    (p) => p.status === "Active" && !p.voters.includes(userId),
  );

  if (!activePoll) return null;

  return (
    <div className="glass rounded-lg p-5 space-y-4 border-white/10 shadow-2xl bg-slate-900/40">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-medium text-emerald-400 flex items-center gap-2">
          <PieChart size={14} />
          Active Consensus
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <p className="text-[12px] font-medium text-white leading-tight line-clamp-2">
        {activePoll.question}
      </p>

      <div className="space-y-1.5">
        {activePoll.options.slice(0, 3).map((opt) => {
          const percentage =
            activePoll.totalVotes === 0
              ? 0
              : Math.round((opt.votes / activePoll.totalVotes) * 100);

          return (
            <div
              key={opt._id}
              className="relative h-9 rounded-lg overflow-hidden bg-slate-900/40 border border-white/[0.03]"
            >
              <div
                className="absolute inset-0 bg-primary-500/10 transition-all"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative h-full flex items-center justify-between px-3 text-[12px] font-medium">
                <span className="text-slate-300">{opt.text}</span>
                <span className="text-primary-400">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        to="/polls"
        className="block text-center text-[12px] text-slate-600 hover:text-white transition"
      >
        View all polls →
      </Link>
    </div>
  );
};
