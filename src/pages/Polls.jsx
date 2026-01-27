import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Vote, PlusSquare, Loader2, BarChart3, Clock } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

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
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20 border border-white/5 active:scale-95"
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
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Awaiting Consensus...</p>
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
                                        <div className="relative px-4 h-full flex items-center justify-between font-black text-[10px] uppercase tracking-widest">
                                            <span className="text-slate-400 group-hover:text-white transition-colors">{opt.text}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-primary-500/80">{opt.percentage}%</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-white/5 group-hover:bg-primary-500 transition-all" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[9px] font-black uppercase tracking-widest">
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
                                <button className="text-primary-500 hover:text-primary-400 transition-colors">Sync Results</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

const CreatePollModal = ({ onClose, onCreated }) => {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [loading, setLoading] = useState(false)

    const addOption = () => setOptions([...options, ''])
    const updateOption = (idx, val) => {
        const newOpts = [...options]
        newOpts[idx] = val
        setOptions(newOpts)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/polls', { question, options: options.filter(o => o.trim()) })
            onCreated()
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-sm rounded-xl p-6 space-y-5 border-white/5 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Vote className="text-primary-500" size={16} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-white">Initialize Vote</h2>
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Gather community consensus.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">The Query</label>
                        <textarea
                            required
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="w-full compact-input min-h-[80px] py-3 h-24 resize-none uppercase text-[10px]"
                            placeholder="What is the mission objective?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Options</label>
                        <div className="space-y-1.5">
                            {options.map((opt, idx) => (
                                <input
                                    key={idx}
                                    required
                                    value={opt}
                                    onChange={e => updateOption(idx, e.target.value)}
                                    className="w-full compact-input text-[10px]"
                                    placeholder={`Option ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="text-primary-500 text-[9px] font-black uppercase tracking-widest hover:underline ml-1"
                        >
                            + Deploy Option
                        </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-black py-2.5 rounded-xl transition-all border border-white/5 text-[9px] uppercase tracking-widest">Abort</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-black py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/20 text-[9px] uppercase tracking-widest">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Broadcast'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Polls
