import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Vote, PlusSquare, Loader2, BarChart3, Clock } from 'lucide-react'
import api from '../api/client'


export const CreatePollModal = ({ onClose, onCreated }) => {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [durationValue, setDurationValue] = useState(30)
    const [durationUnit, setDurationUnit] = useState('days')
    const [loading, setLoading] = useState(false)

    const addOption = () => setOptions([...options, ''])
    const updateOption = (idx, val) => {
        const newOpts = [...options]
        newOpts[idx] = val
        setOptions(newOpts)
    }

    const calculateExpiry = () => {
        const date = new Date()
        const val = parseInt(durationValue) || 1
        switch (durationUnit) {
            case 'minutes': date.setMinutes(date.getMinutes() + val); break
            case 'hours': date.setHours(date.getHours() + val); break
            case 'days': date.setDate(date.getDate() + val); break
            case 'months': date.setMonth(date.getMonth() + val); break
            case 'years': date.setFullYear(date.getFullYear() + val); break
            default: date.setDate(date.getDate() + 30)
        }
        return date
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const expiresAt = calculateExpiry()
            await api.post('/polls', {
                question,
                options: options.filter(o => o.trim()),
                expiresAt: expiresAt.toISOString()
            })
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
                className="glass w-full max-w-sm rounded-lg p-6 space-y-5 border-white/5 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Vote className="text-primary-500" size={16} />
                    </div>
                    <div>
                        <h2 className="text-xs font-medium text-white">Initialize Vote</h2>
                        <p className="text-slate-600 text-[9px] font-medium">Gather community consensus.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Archive Question</label>
                        <textarea
                            required
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-4 h-28 resize-none text-xs text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all font-bold"
                            placeholder="WHAT IS YOUR INQUIRY?"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Consensus Options</label>
                        <div className="space-y-2">
                            {options.map((opt, idx) => (
                                <input
                                    key={idx}
                                    required
                                    value={opt}
                                    onChange={e => updateOption(idx, e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all"
                                    placeholder={`OPTION ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="text-primary-500 text-[12px] font-medium hover:text-primary-400 transition-colors ml-1"
                        >
                            + Expand Matrix
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Protocol Duration</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                required
                                min="1"
                                value={durationValue}
                                onChange={e => setDurationValue(e.target.value)}
                                className="w-20 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                            <select
                                value={durationUnit}
                                onChange={e => setDurationUnit(e.target.value)}
                                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-medium py-3 rounded-lg transition-all border border-white/5 text-[9px]">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/40 text-[9px] border border-white/10">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={12} /> : 'Broadcasting'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
