import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Vote, PlusSquare, Loader2, BarChart3, Clock } from 'lucide-react'
import api from '../api/client'


export const CreatePollModal = ({ onClose, onCreated }) => {
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
                        <label className="text-xs font-bold text-slate-400 ml-1">Question</label>
                        <textarea
                            required
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="w-full compact-input min-h-[80px] py-3 h-24 resize-none text-[10px]"
                            placeholder="What would you like to ask the community?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 ml-1">Options</label>
                        <div className="space-y-1.5">
                            {options.map((opt, idx) => (
                                <input
                                    key={idx}
                                    required
                                    value={opt}
                                    onChange={e => updateOption(idx, e.target.value)}
                                    className="w-full compact-input text-sm"
                                    placeholder={`Option ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="text-primary-500 text-sm font-bold hover:underline ml-1"
                        >
                            + Deploy Option
                        </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-2.5 rounded-lg transition-all border border-white/5 text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/20 text-sm">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Broadcast'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
