import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Loader2, ArrowRight } from 'lucide-react'
import api from '../api/client'

export const CreateCampaignModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        goal: '',
        daysLeft: 30,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/campaigns', formData)
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
                className="glass w-full max-w-sm rounded-xl p-6 space-y-5 border-white/5"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <Megaphone className="text-rose-500" size={16} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-white">Initialize Signal</h2>
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Broadcast local movement.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">Campaign Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full compact-input"
                            placeholder="e.g. Clean Water Initiative"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">Goal</label>
                        <input
                            required
                            value={formData.goal}
                            onChange={e => setFormData({ ...formData, goal: e.target.value })}
                            className="w-full compact-input"
                            placeholder="e.g. 500 supporters"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">Duration (Days)</label>
                        <input
                            type="number"
                            required
                            value={formData.daysLeft}
                            onChange={e => setFormData({ ...formData, daysLeft: e.target.value })}
                            className="w-full compact-input"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-2.5 rounded-lg transition-all border border-white/5 text-sm">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg disabled:opacity-50 shadow-lg shadow-primary-900/20 active:scale-95 transition-all text-sm">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Establish'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}