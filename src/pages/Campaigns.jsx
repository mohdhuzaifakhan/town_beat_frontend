import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Target, Clock, PlusSquare, Loader2, ArrowRight } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('/campaigns')
            setCampaigns(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase">
                        <Megaphone className="text-rose-500" size={24} />
                        Movements
                        <span className="text-[10px] text-slate-600 tracking-widest font-black ml-2 opacity-50">Pulse Signal</span>
                    </h1>
                </div>
                {user && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/5"
                    >
                        <PlusSquare size={14} />
                        Initialize
                    </button>
                )}
            </div>

            {showCreate && (
                <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={fetchCampaigns} />
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="animate-spin text-primary-400" size={24} />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Scanning Initiatives...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} onSupported={fetchCampaigns} />
                    ))}
                </div>
            )}
        </div>
    )
}

const CampaignCard = ({ campaign, onSupported }) => {
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
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Node: <span className="text-primary-500/70">{campaign.organizer?.name || 'Authorized Citizen'}</span></p>
                </div>

                <div className="space-y-3 my-4">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
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
                    <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <Clock className="text-amber-500/50" size={12} />
                            {campaign.daysLeft} Cycles Left
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest active:scale-95">Trace</button>
                        <button
                            onClick={handleSupport}
                            disabled={loading}
                            className="bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border border-primary-500/10 hover:border-primary-500 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? 'Transmitting...' : 'Strengthen Signal'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const CreateCampaignModal = ({ onClose, onCreated }) => {
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
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Initiative Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full compact-input"
                            placeholder="e.g. INFRASTRUCTURE REBOOT"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Goal</label>
                        <input
                            required
                            value={formData.goal}
                            onChange={e => setFormData({ ...formData, goal: e.target.value })}
                            className="w-full compact-input"
                            placeholder="e.g. 500 NODES"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Temporal Duration (Days)</label>
                        <input
                            type="number"
                            required
                            value={formData.daysLeft}
                            onChange={e => setFormData({ ...formData, daysLeft: e.target.value })}
                            className="w-full compact-input"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-black py-2.5 rounded-xl transition-all border border-white/5 text-[9px] uppercase tracking-widest">Abort</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-black py-2.5 rounded-xl disabled:opacity-50 shadow-lg shadow-primary-900/20 active:scale-95 transition-all text-[9px] uppercase tracking-widest">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Establish'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Campaigns
