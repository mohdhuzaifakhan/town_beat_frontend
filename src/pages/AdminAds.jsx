import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Link as LinkIcon, Trash2, Plus, Loader2, Megaphone, Sparkles, Layout, BarChart, ShieldAlert } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const AdminAds = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', link: '' })
    const { user } = useAuth()

    useEffect(() => {
        fetchAds()
    }, [])

    const fetchAds = async () => {
        try {
            const res = await api.get('/ads')
            setAds(res.data)
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
            setFormData({ title: '', description: '', imageUrl: '', link: '' })
            fetchAds()
        } catch (err) {
            console.error('Failed to create ad')
        } finally {
            setCreating(false)
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

    if (!user || user.role !== 'Admin') return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="text-red-400" size={24} />
            </div>
            <h2 className="text-sm font-black text-slate-200 tracking-tighter uppercase">Access Terminal Restricted</h2>
            <p className="text-slate-500 max-w-xs text-center text-xs leading-relaxed">Only platform administrators can manage billboard deployments.</p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
            <div className="relative">
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                            <Sparkles className="text-primary-400" size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">Admin Control</span>
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                            Billboard
                            <span className="text-primary-500/50">Manager</span>
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <div className="glass px-4 py-2 rounded-lg border border-white/5 flex flex-col items-center min-w-[100px] relative overflow-hidden group shadow-none">
                            <span className="text-lg font-black text-primary-400 relative">{ads.length}</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5 relative">Active Nodes</span>
                        </div>
                        <div className="glass px-4 py-2 rounded-lg border border-white/5 flex flex-col items-center min-w-[100px] relative overflow-hidden group shadow-none">
                            <span className="text-lg font-black text-accent relative">{ads.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5 relative">Reach Pulse</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <form onSubmit={handleSubmit} className="glass rounded-xl p-5 space-y-5 sticky top-24 border border-white/5 relative overflow-hidden shadow-none">
                        <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 relative text-white">
                            <Plus className="text-primary-500" size={16} />
                            Initialize Campaign
                        </h2>

                        <div className="space-y-4 relative">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full compact-input text-sm"
                                    placeholder="e.g. Special Offer"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Message</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full compact-input min-h-[80px] py-3 h-24 resize-none text-sm"
                                    placeholder="Describe your campaign..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Visual Protocol (URL)</label>
                                <div className="relative group/input">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-primary-400 transition-colors" size={14} />
                                    <input
                                        required
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full compact-input pl-10"
                                        placeholder="Image Archive Source"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Gateway Destination</label>
                                <div className="relative group/input">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-accent transition-colors" size={14} />
                                    <input
                                        required
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full compact-input pl-10"
                                        placeholder="Access URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary-900/40 active:scale-95 uppercase tracking-widest text-[10px] relative border border-white/5"
                        >
                            <span>{creating ? <Loader2 className="animate-spin" size={14} /> : 'Deploy Billboard'}</span>
                            {!creating && <Megaphone size={14} className="opacity-50" />}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
                            <Layout className="text-accent/50" size={14} />
                            Deployment Log
                        </h3>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map(i => <div key={i} className="animate-pulse h-32 bg-white/5 rounded-xl border border-white/5" />)}
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border-dashed border-white/10 shadow-none">
                            <Megaphone className="text-slate-900 mx-auto mb-4 opacity-20" size={32} />
                            <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase">SKYLINE VACANT</h3>
                            <p className="text-slate-600 mt-2 text-xs">Awaiting deployment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ads.map(ad => (
                                <motion.div
                                    key={ad._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass rounded-xl overflow-hidden border border-white/5 flex flex-col group hover:border-primary-500/20 transition-all duration-500 shadow-none bg-slate-950/20"
                                >
                                    <div className="h-24 relative overflow-hidden bg-slate-900">
                                        <img src={ad.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000" alt="" />
                                        <div className="absolute top-2 right-2">
                                            <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${ad.isActive !== false ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                                                {ad.isActive !== false ? 'LINKED' : 'OFFLINE'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                                        <div>
                                            <h3 className="font-black text-[12px] text-white uppercase tracking-tight line-clamp-1">{ad.title}</h3>
                                            <p className="text-[9px] text-slate-600 font-bold truncate mt-0.5 flex items-center gap-1.5 uppercase">
                                                <LinkIcon size={10} className="text-accent/50" />
                                                {ad.link}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/[0.03]">
                                            <div className="space-y-0.5">
                                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">IMPACT</span>
                                                <div className="flex items-center gap-1.5">
                                                    <BarChart size={12} className="text-accent/50" />
                                                    <span className="text-[10px] font-black text-slate-400">{ad.clicks || 0}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-0.5 text-right">
                                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">CYCLE</span>
                                                <div className="text-[10px] font-black text-slate-500 flex items-center justify-end gap-1.5 uppercase">
                                                    <Clock size={10} className="text-amber-500/40" />
                                                    {new Date(ad.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-1">
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                className="p-2 bg-red-500/5 text-red-500/30 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10 active:scale-95"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
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

export default AdminAds
