import { motion } from "framer-motion";
import { Vote, BarChart3, Clock, Trash2 } from "lucide-react";

export const PollCard = ({ poll, user, onVote, onDelete }) => {
  const getTimeRemaining = () => {
    const total = Date.parse(poll.expiresAt) - Date.parse(new Date());
    if (total <= 0) return "Expired";

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}D Left`;
    if (hours > 0) return `${hours}H Left`;
    if (minutes > 0) return `${minutes}M Left`;
    return "Final Minute";
  };

  const timeRemaining = getTimeRemaining();
  const isUrgent =
    timeRemaining.includes("H") ||
    timeRemaining.includes("M") ||
    timeRemaining === "Final Minute";
  const isExpired = timeRemaining === "Expired";

  // Simple Analytics: Find winning option
  const winningOptionId = isExpired
    ? [...(poll.options || [])].sort((a, b) => b.votes - a.votes)[0]?._id
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-lg p-4 sm:p-6 space-y-5 relative overflow-hidden group border-white/10 ${isExpired ? "bg-slate-950/40" : "bg-slate-900/40"} transition-all duration-500`}
    >
      <div
        className={`absolute top-0 right-0 w-64 h-64 blur-3xl -mr-32 -mt-32 transition-colors duration-1000 ${isExpired ? "bg-primary-500/10" : "bg-primary-600/3"}`}
      />
      <div className="flex items-start justify-between relative">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div
              className={`px-2 py-0.5 border rounded-lg flex items-center gap-1.5 ${isExpired ? "bg-primary-500/10 border-primary-500/20" : poll.hasVoted ? "bg-emerald-500/10 border-emerald-500/20" : "bg-primary-500/10 border-primary-500/20"}`}
            >
              <div
                className={`w-1 h-1 rounded-full ${isExpired ? "bg-primary-500 " : "animate-pulse " + (poll.hasVoted ? "bg-emerald-500" : "bg-primary-500")}`}
              />
              <span
                className={`text-[12px] font-medium ${isExpired ? "text-primary-400" : poll.hasVoted ? "text-emerald-400" : "text-primary-400"}`}
              >
                {isExpired
                  ? "Consensus Reached"
                  : poll.hasVoted
                    ? "Signal Received"
                    : "Active Poll"}
              </span>
            </div>
            {poll.owner === user?._id && (
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[12px] font-medium text-amber-500     ">
                Authority
              </span>
            )}
          </div>
          <h3 className="text-md font-medium text-white max-w-2xl leading-relaxed">
            {poll.question}
          </h3>
        </div>
        {poll.owner === user?._id && onDelete && (
          <button
            onClick={() => onDelete(poll)}
            className="text-slate-600 hover:text-rose-500 transition-colors p-2 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative">
        {poll.options?.map((opt) => {
          const hasVoted = poll.voters?.includes(user?._id);
          const isSelected = opt.voters?.includes(user?._id);
          const isWinner = opt._id === winningOptionId;

          return (
            <button
              key={opt._id}
              disabled={hasVoted || isExpired}
              onClick={() => !hasVoted && !isExpired && onVote(opt._id)}
              className={`
        relative w-full py-3 px-4 rounded-lg overflow-hidden
        border text-left transition-all active:scale-[0.99]
        ${hasVoted ? "cursor-default border-white/10" : "border-white/10 hover:border-primary-500/40"}
        ${isSelected ? "bg-primary-500/15 border-primary-500/50" : ""}
        ${isWinner ? "border-primary-500" : ""}
      `}
            >
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-1000
          ${hasVoted ? "bg-primary-500/10" : "opacity-0"}
          ${isWinner ? "bg-primary-600/20" : ""}
        `}
                style={{
                  width: hasVoted || isExpired ? `${opt.percentage}%` : "0%",
                }}
              />
              <div className="relative flex justify-between items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[12px] font-medium text-white truncate">
                    {opt.text}
                  </span>

                  {isSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary-500 text-white   font-medium shrink-0   ">
                      YOUR VOTE
                    </span>
                  )}
                </div>

                {(hasVoted || isExpired) && (
                  <span
                    className={`text-[12px]   font-medium ${isWinner ? "text-primary-400" : "text-slate-400"} shrink-0`}
                  >
                    {opt.percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/10 text-[12px] font-medium text-slate-500 relative">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <BarChart3 size={12} className="text-primary-500/40" />
            <span className="tabular-nums">{poll.totalVotes}</span> Data Points
          </div>
          <div className="flex items-center gap-1.5">
            <Clock
              size={12}
              className={`${isExpired ? "text-primary-400" : isUrgent ? "text-rose-500" : "text-amber-500"} transition-colors`}
            />
            {timeRemaining}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
