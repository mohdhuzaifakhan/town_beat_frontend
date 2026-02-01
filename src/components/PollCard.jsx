import { motion } from 'framer-motion'
import { Vote, BarChart3, Clock, Trash2 } from 'lucide-react'

export const PollCard = ({ poll, user, onVote, onDelete }) => {
    const getTimeRemaining = () => {
        const total = Date.parse(poll.expiresAt) - Date.parse(new Date())
        if (total <= 0) return 'Expired'

        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
        const days = Math.floor(total / (1000 * 60 * 60 * 24))

        if (days > 0) return `${days}D Left`
        if (hours > 0) return `${hours}H Left`
        if (minutes > 0) return `${minutes}M Left`
        return 'Final Minute'
    }

    const timeRemaining = getTimeRemaining()
    const isUrgent = timeRemaining.includes('H') || timeRemaining.includes('M') || timeRemaining === 'Final Minute'
    const isExpired = timeRemaining === 'Expired'

    // Simple Analytics: Find winning option
    const winningOptionId = isExpired ? [...(poll.options || [])].sort((a, b) => b.votes - a.votes)[0]?._id : null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`glass rounded-lg p-4 md:p-6 space-y-6 relative overflow-hidden group border-white/[0.05] ${isExpired ? 'bg-slate-950/40' : 'bg-slate-900/40'}`}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl -mr-32 -mt-32 transition-colors duration-1000 ${isExpired ? 'bg-primary-500/10' : 'bg-primary-600/[0.03]'}`} />

            <div className="flex items-start justify-between relative">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 border rounded-lg flex items-center gap-1.5 ${isExpired ? 'bg-primary-500/10 border-primary-500/20' : poll.hasVoted ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-primary-500/10 border-primary-500/20'}`}>
                            <div className={`w-1 h-1 rounded-full ${isExpired ? 'bg-primary-500 ' : 'animate-pulse ' + (poll.hasVoted ? 'bg-emerald-500' : 'bg-primary-500')}`} />
                            <span className={`text-[11px] font-medium ${isExpired ? 'text-primary-400' : poll.hasVoted ? 'text-emerald-400' : 'text-primary-400'}`}>
                                {isExpired ? 'Consensus Reached' : poll.hasVoted ? 'Signal Received' : 'Active Transmission'}
                            </span>
                        </div>
                        {poll.owner === user?._id && (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] font-medium text-amber-500">
                                Authority
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-medium    text-white leading-tight max-w-2xl">{poll.question}</h3>
                </div>
                {poll.owner === user?._id && onDelete && (
                    <button
                        onClick={() => onDelete(poll)}
                        className="text-slate-600 hover:text-rose-500 transition-colors p-2"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {poll.options?.map(opt => {
                    const isWinner = opt._id === winningOptionId;
                    const isSelected = opt.userSelected;

                    return (
                        <button
                            key={opt._id}
                            onClick={() => !poll.hasVoted && !isExpired && onVote(opt._id)}
                            disabled={poll.hasVoted || isExpired}
                            className={`relative w-full py-4 rounded-lg overflow-hidden border transition-all duration-500 text-left px-4 group/opt 
                                ${poll.hasVoted || isExpired ? 'border-white/5 cursor-default' : 'border-white/[0.08] hover:border-primary-500/40 active:scale-[0.98]'}
                                ${isSelected ? 'border-primary-500/50 bg-primary-500/5' : ''}
                                ${isWinner ? 'border-primary-500 ' : ''}
                            `}
                        >
                            <div
                                className={`absolute inset-0 transition-all duration-[1500ms] ease-out 
                                    ${isWinner ? 'bg-primary-600/20' : poll.hasVoted ? 'bg-white/5' : 'opacity-0'}
                                `}
                                style={{ width: (poll.hasVoted || isExpired) ? `${opt.percentage}%` : '0%' }}
                            />

                            <div className="relative flex items-center justify-between font-bold text-sm">
                                <div className="flex flex-col gap-0.5">
                                    <span className={`${(poll.hasVoted || isExpired) ? 'text-white' : 'text-slate-400 group-hover/opt:text-white transition-colors'} font-medium text-[12px]    flex items-center gap-2`}>
                                        {opt.text}
                                        {isSelected && (
                                            <span className="text-[10px] bg-primary-500 text-white px-1 rounded-sm   er">YOUR SIGNAL</span>
                                        )}
                                    </span>
                                    {isWinner && (
                                        <span className="text-[10px] text-primary-400 font-medium">Dominant Signal</span>
                                    )}
                                </div>
                                {(poll.hasVoted || isExpired) && (
                                    <div className="flex items-center gap-2">
                                        <span className={`${isWinner ? 'text-primary-400' : 'text-slate-500'} font-medium text-[12px]`}>{opt.percentage}%</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isWinner ? 'bg-primary-500 ' : 'bg-slate-700'}`} />
                                    </div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/5 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                        <BarChart3 size={12} className="text-primary-500/40" />
                        {poll.totalVotes} Data Points
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} className={`${isExpired ? 'text-primary-400' : isUrgent ? 'text-rose-500' : 'text-amber-500'} transition-colors`} />
                        {timeRemaining}
                    </div>
                </div>
                <div className="text-[10px] opacity-40">
                    Archive ID: {poll._id.substring(0, 8)}
                </div>
            </div>
        </motion.div>
    )
}
