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
    return <div className="glass rounded-xl p-6 animate-pulse h-32" />;
  if (polls.length === 0) return null;
  const poll = polls[0];

  return (
    <div className="glass rounded-xl p-5 space-y-4 border-white/5 relative overflow-hidden group shadow-none">
      <div className="flex items-center justify-between relative">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <PieChart size={14} />
          Active Consensus
        </h3>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </div>
      <p className="font-black text-white text-[11px] uppercase tracking-wide leading-tight relative">
        {poll.question}
      </p>
      <div className="space-y-1.5 relative">
        {poll.options.slice(0, 3).map((opt) => (
          <div
            key={opt._id}
            className="relative h-8 w-full bg-slate-900/40 rounded-lg overflow-hidden group/opt cursor-pointer border border-white/[0.03]"
          >
            <div
              className="absolute inset-0 bg-emerald-500/5 transition-all duration-1000"
              style={{ width: `${opt.percentage}%` }}
            />
            <div className="relative h-full flex items-center justify-between px-3 text-[8px] font-black uppercase tracking-widest">
              <span className="text-slate-500 group-hover/opt:text-white transition-colors">
                {opt.text}
              </span>
              <span className="text-emerald-500/70">{opt.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/polls"
        className="block text-center text-[8px] font-black text-slate-600 hover:text-white transition-colors tracking-widest uppercase pt-1 relative"
      >
        Expand Signal →
      </Link>
    </div>
  );
};
