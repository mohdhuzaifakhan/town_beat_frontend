import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Target, Clock, PlusSquare, Loader2, ArrowRight } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'


export const CampaignCard = ({ campaign, onSupported }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleSupport = async () => {
        if (!user) return
        setLoading(true)
        try {
            await api.post(`/campaigns/${campaign._id}/support`)
            onSupported()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-primary-500/20 transition-all group border-white/[0.03] shadow-none"
        >
            <div className="w-full md:w-32 h-32 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-white/5 shadow-sm shadow-black/40">
                <img src={campaign.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-80 group-hover:opacity-100" alt="" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Target className="text-rose-500/60" size={12} />
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Active Pulse</span>
                    </div>
                    <h3 className="text-base font-black group-hover:text-primary-300 transition-colors uppercase tracking-tight">{campaign.title}</h3>
                    <p className="text-xs text-slate-500">Organizer: <span className="text-primary-500/70">{campaign.organizer?.name || 'Community Member'}</span></p>
                </div>

                <div className="space-y-3 my-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-600">
                            Objective: {campaign.goal}
                        </div>
                        <span className="text-primary-500">{campaign.progress}% SYNC</span>
                    </div>
                    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${campaign.progress}%` }}
                            className="h-full bg-primary-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Clock className="text-amber-500/50" size={12} />
                            {campaign.daysLeft} Cycles Left
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors active:scale-95">Details</button>
                        <button
                            onClick={handleSupport}
                            disabled={loading}
                            className="bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white px-6 py-2 rounded-lg font-bold text-sm transition-all border border-primary-500/10 hover:border-primary-500 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? 'Supporting...' : 'Support'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}