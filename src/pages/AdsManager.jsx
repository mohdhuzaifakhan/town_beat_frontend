import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Link as LinkIcon, Plus, Loader2, Megaphone, CheckCircle2, AlertCircle, Calendar, DollarSign, Layout } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

const AdsManager = () => {
    const [myAds, setMyAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        adType: 'feed',
        placement: 'home_feed',
        budget: 1000,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    const { user } = useAuth()

    useEffect(() => {
        fetchMyAds()
    }, [])

    const fetchMyAds = async () => {
        try {
            const res = await api.get('/ads/my-ads')
            setMyAds(res.data)
        } catch (err) {
            console.error('Failed to fetch ads')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCreating(true)
        try {
            await api.post('/ads', formData)
            // Reset form but keep default dates/budget
            setFormData({
                ...formData,
                title: '',
                description: '',
                imageUrl: '',
                link: ''
            })
            fetchMyAds()
        } catch (err) {
            console.error('Failed to create ad')
        } finally {
            setCreating(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'pending_approval': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20'
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        }
    }

    const safeFormatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A'
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Invalid Date'
            return format(date, 'MMM d')
        } catch (error) {
            return 'Error'
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
            <div className="relative">
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-lg mx-auto md:mx-0">
                                <Megaphone className="text-primary-400" size={12} />
                                <span className="text-[11px] font-medium   text-primary-400">Ad Manager</span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-medium   er text-white flex items-center justify-center md:justify-start gap-3">
                                My <span className="text-primary-500">Campaigns</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create Ad Form */}
                <div className="lg:col-span-4 transition-all duration-500">
                    <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6 sticky top-24 border border-white/5 relative overflow-hidden bg-slate-900/40 shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[11px] font-medium flex items-center gap-3 relative text-primary-400">
                                <Plus size={14} />
                                New Campaign
                            </h2>
                            <Layout size={14} className="text-slate-700" />
                        </div>

                        <div className="space-y-4 relative">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-medium text-slate-500   ml-1">Headline</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" placeholder="Enter headline..." />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-500   ml-1">Format</label>
                                    <select value={formData.adType} onChange={e => setFormData({ ...formData, adType: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer">
                                        <option value="feed">Feed Post</option>
                                        <option value="banner">Banner</option>
                                        <option value="card">Sidebar Card</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-500   ml-1">Budget (INR)</label>
                                    <div className="relative group/input">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                                        <input type="number" required value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-500   ml-1">Launch date</label>
                                    <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium text-slate-500   ml-1">End date</label>
                                    <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-medium text-slate-500   ml-1">Creative Source (URL)</label>
                                <div className="relative group/input">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input required value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" placeholder="https://image-source.com/..." />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-medium text-slate-500   ml-1">Transmission Destination</label>
                                <div className="relative group/input">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    <input required value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all" placeholder="https://destination.com/..." />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={creating} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary-900/40 text-[11px] mt-4 active:scale-95">
                            {creating ? <Loader2 className="animate-spin" size={14} /> : 'Authorize Transmission'}
                        </button>
                    </form>
                </div>

                {/* Ads List */}
                <div className="lg:col-span-8 space-y-4">
                    {loading ? (
                        <div className="animate-pulse h-32 bg-white/5 rounded-lg border border-white/5" />
                    ) : myAds.length === 0 ? (
                        <div className="glass rounded-lg p-12 text-center border-dashed border-white/10">
                            <Megaphone className="text-slate-900 mx-auto mb-4 opacity-20" size={32} />
                            <h3 className="text-xs font-medium text-slate-500">No Campaigns Yet</h3>
                            <p className="text-slate-600 mt-2 text-xs">Start your first ad campaign today.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {myAds.map(ad => (
                                <motion.div key={ad._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-0 rounded-xl overflow-hidden border border-white/5 flex flex-col sm:flex-row gap-0 bg-slate-900/40 shadow-xl group">
                                    <div className="w-full sm:w-32 h-32 relative shrink-0">
                                        <img src={ad.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent sm:hidden" />
                                    </div>
                                    <div className="p-5 md:p-6 space-y-6 flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="max-w-full overflow-hidden">
                                                <h3 className="font-bold text-white text-base truncate   ">{ad.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-medium text-primary-500 uppercase">{ad.adType}</span>
                                                    <span className="w-1 h-1 bg-slate-800 rounded-full" />
                                                    <span className="text-[10px] font-medium text-slate-500 uppercase">{ad.placement.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-md text-[10px] font-medium   border shadow-lg shrink-0 ${getStatusColor(ad.status)}`}>
                                                {ad.status.replace('_', ' ')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] text-slate-600 font-medium   uppercase">Impressions</p>
                                                <p className="text-xl font-medium text-white">{ad.impressions || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-600 font-medium   uppercase">Investment</p>
                                                <p className="text-xl font-medium text-emerald-400">₹{ad.spent} <span className="text-[10px] text-slate-700 font-normal">/ ₹{ad.budget}</span></p>
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-[10px] text-slate-600 font-medium   uppercase">Transmission Period</p>
                                                <p className="text-[11px] font-medium text-slate-400 mt-1">
                                                    {safeFormatDate(ad.startDate)} - {safeFormatDate(ad.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        {ad.rejectionReason && (
                                            <div className="mt-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[11px] text-rose-400 flex items-start gap-3">
                                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                <p><span className="font-bold text-rose-500">Rejection Protocol:</span> {ad.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdsManager
