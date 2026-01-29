import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Vote, PlusSquare, Loader2, BarChart3, Clock } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { CreatePollModal } from '../components/CreatePollModal'

const Polls = () => {
    const [polls, setPolls] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        fetchPolls()
    }, [])

    const fetchPolls = async () => {
        try {
            const res = await api.get('/polls')
            setPolls(res.data)
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (optionId) => {
        if (!user) return
        try {
            await api.post(`/polls/vote/${optionId}`)
            fetchPolls()
        } catch (err) { }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase">
                        <Vote className="text-primary-500" size={24} />
                        Consensus
                        <span className="text-[10px] text-slate-600 tracking-widest font-black ml-2 opacity-50">Local Protocol</span>
                    </h1>
                </div>
                {user && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 border border-white/5 active:scale-95"
                    >
                        <PlusSquare size={14} />
                        New Signal
                    </button>
                )}
            </div>

            {showCreate && (
                <CreatePollModal onClose={() => setShowCreate(false)} onCreated={fetchPolls} />
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="animate-spin text-primary-400" size={24} />
                    <p className="text-slate-400 text-sm">Loading polls...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {polls.map(poll => (
                        <motion.div
                            key={poll._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-xl p-6 space-y-6 relative overflow-hidden group border-white/[0.03] shadow-none"
                        >
                            <div className="space-y-2 relative">
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Archival Vote</span>
                                </div>
                                <h3 className="text-base font-black tracking-tight text-white uppercase">{poll.question}</h3>
                            </div>

                            <div className="space-y-2">
                                {poll.options?.map(opt => (
                                    <button
                                        key={opt._id}
                                        onClick={() => handleVote(opt._id)}
                                        className="relative w-full h-10 bg-slate-900/50 rounded-lg overflow-hidden border border-white/[0.03] group hover:border-primary-500/20 transition-all text-left shadow-inner"
                                    >
                                        <div className="absolute inset-0 bg-primary-600/5 transition-all duration-[1500ms] ease-out" style={{ width: `${opt.percentage}%` }} />
                                        <div className="relative px-4 h-full flex items-center justify-between font-bold text-sm">
                                            <span className="text-slate-400 group-hover:text-white transition-colors">{opt.text}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-primary-500/80">{opt.percentage}%</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-white/5 group-hover:bg-primary-500 transition-all" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-bold">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <BarChart3 size={12} className="text-indigo-500/50" />
                                        {poll.totalVotes} Samples
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Clock size={12} className="text-amber-500/50" />
                                        72H Window
                                    </div>
                                </div>
                                <button className="text-primary-500 hover:text-primary-400 transition-colors font-bold text-sm">View Results</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Polls
