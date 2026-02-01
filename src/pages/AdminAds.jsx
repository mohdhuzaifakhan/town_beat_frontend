import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Link as LinkIcon, Trash2, CheckCircle2, XCircle, Loader2, Megaphone, Sparkles, Layout, BarChart, ShieldAlert, CheckCircle } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const AdminAds = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('pending_approval') // pending_approval, active, all
    const { user } = useAuth()

    useEffect(() => {
        fetchAds()
    }, [])

    const fetchAds = async () => {
        try {
            const res = await api.get('/ads/admin/all')
            setAds(res.data)
        } catch (err) {
            console.error('Failed to fetch ads')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id, status, reason = null) => {
        try {
            await api.put(`/ads/${id}/status`, { status, reason })
            fetchAds()
        } catch (err) {
            console.error('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this advertisement permanently?')) return
        try {
            await api.delete(`/ads/${id}`)
            fetchAds()
        } catch (err) {
            console.error('Failed to delete ad')
        }
    }

    const filteredAds = ads.filter(ad => {
        if (filter === 'all') return true
        return ad.status === filter
    })

    if (!user || user.role !== 'Admin') return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="text-red-400" size={24} />
            </div>
            <h2 className="text-sm font-medium text-slate-200   er">Access Terminal Restricted</h2>
            <p className="text-slate-500 max-w-xs text-center text-xs leading-relaxed">Only platform administrators can manage billboard deployments.</p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 py-4 md:py-6">
            <div className="relative">
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                            <Sparkles className="text-primary-400" size={12} />
                            <span className="text-[11px] font-medium   text-primary-400">Admin Control</span>
                        </div>
                        <h1 className="text-xl font-medium   er text-white flex items-center gap-3">
                            Ad Approval <span className="text-primary-500/50">Center</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-1">
                {['pending_approval', 'active', 'all'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-2 text-[12px] font-medium   rounded-t-lg transition-colors ${filter === t ? 'bg-white/5 text-primary-400 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {t.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="animate-pulse h-32 bg-white/5 rounded-lg border border-white/5" />
                ) : filteredAds.length === 0 ? (
                    <div className="glass rounded-lg p-12 text-center border-dashed border-white/10 shadow-none">
                        <Megaphone className="text-slate-900 mx-auto mb-4 opacity-20" size={32} />
                        <h3 className="text-xs font-medium text-slate-500">No Ads Found</h3>
                        <p className="text-slate-600 mt-2 text-xs">There are no ads in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredAds.map(ad => (
                            <motion.div
                                key={ad._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass rounded-lg overflow-hidden border border-white/5 flex flex-col group hover:border-primary-500/20 transition-all duration-500 shadow-none bg-slate-950/20"
                            >
                                <div className="h-32 relative overflow-hidden bg-slate-900">
                                    <img src={ad.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000" alt="" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-medium   backdrop-blur-md border border-white/10 bg-black/50 text-white`}>
                                            {ad.owner?.name || 'Unknown User'}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2">
                                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-medium   backdrop-blur-md border border-white/10 ${ad.status === 'active' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                                            {ad.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 sm:p-4 space-y-3 flex-1 flex flex-col">
                                    <div>
                                        <h3 className="font-medium text-[12px] text-white    line-clamp-1">{ad.title}</h3>
                                        <p className="text-[12px] text-slate-400 line-clamp-2 mt-1">{ad.description}</p>
                                        <p className="text-[11px] text-slate-600 font-bold truncate mt-2 flex items-center gap-1.5">
                                            <LinkIcon size={10} className="text-accent/50" />
                                            {ad.link}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/[0.03]">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-medium text-slate-700 ">BUDGET</span>
                                            <span className="text-[12px] font-medium text-slate-400 block">₹{ad.budget}</span>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <span className="text-[10px] font-medium text-slate-700">TYPE</span>
                                            <span className="text-[12px] font-medium text-slate-400 block">{ad.adType}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Pending Ads */}
                                    {ad.status === 'pending_approval' && (
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                            <button
                                                onClick={() => handleStatusUpdate(ad._id, 'active')}
                                                className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-[11px]   transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={14} />
                                                Authorize
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt("Enter rejection reason:");
                                                    if (reason) handleStatusUpdate(ad._id, 'rejected', reason);
                                                }}
                                                className="w-full sm:flex-1 bg-rose-600/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold py-2.5 rounded-lg text-[11px]   transition-all border border-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} />
                                                Reject Signal
                                            </button>
                                        </div>
                                    )}

                                    {/* Delete for all */}
                                    {ad.status !== 'pending_approval' && (
                                        <div className="flex justify-end pt-1">
                                            <button onClick={() => handleDelete(ad._id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminAds
