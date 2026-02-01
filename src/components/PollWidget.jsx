import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  PieChart,
} from "lucide-react";
import api from "../api/client";
import { Link } from "react-router-dom";

export const PollWidget = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const res = await api.get("/polls");
      setPolls(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loading)
    return <div className="glass rounded-lg p-6 animate-pulse h-32" />;
  if (polls.length === 0) return null;
  const poll = polls[0];

  return (
    <div className="glass rounded-lg p-5 space-y-4 border-white/5 relative overflow-hidden group shadow-2xl bg-slate-900/40">
      <div className="flex items-center justify-between relative">
        <h3 className="text-[12px] font-medium text-emerald-400 flex items-center gap-2">
          <PieChart size={14} />
          Active Consensus
        </h3>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </div>
      <p className="font-medium text-white text-xs leading-tight relative line-clamp-2">
        {poll.question}
      </p>
      <div className="space-y-1.5 relative">
        {poll.options.slice(0, 3).map((opt) => (
          <div
            key={opt._id}
            className={`relative h-9 w-full rounded-lg overflow-hidden border border-white/[0.03] ${poll.hasVoted ? 'bg-slate-950/40' : 'bg-slate-900/40 hover:border-primary-500/30'} transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 ${poll.hasVoted ? 'bg-primary-500/10' : 'bg-primary-500/[0.03]'} transition-all duration-1000`}
              style={{ width: poll.hasVoted ? `${opt.percentage}%` : '0%' }}
            />
            <div className="relative h-full flex items-center justify-between px-3 text-[12px] font-medium">
              <span className={`${poll.hasVoted ? 'text-white' : 'text-slate-500'} transition-colors`}>
                {opt.text}
              </span>
              {poll.hasVoted && <span className="text-primary-500">{opt.percentage}%</span>}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/polls"
        className="block text-center text-[9px] font-medium text-slate-600 hover:text-white transition-colors pt-1 relative"
      >
        Access Archive →
      </Link>
    </div>
  );
};
