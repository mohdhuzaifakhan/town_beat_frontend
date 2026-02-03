import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Link as LinkIcon, Trash2, CheckCircle2, XCircle, Loader2, Megaphone, Sparkles, Layout, BarChart, ShieldAlert, CheckCircle } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { InputModal } from '../components/InputModal'

const AdminAds = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('pending_approval') // pending_approval, active, all
    const { user } = useAuth()


    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        isDanger: false,
        confirmText: "Confirm"
    });

    const showModal = (title, message, onConfirm, isDanger = false, confirmText = "Confirm") => {
        setModal({ isOpen: true, title, message, onConfirm, isDanger, confirmText });
    };

    const [inputModal, setInputModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { }
    });

    const showInputModal = (title, message, onConfirm) => {
        setInputModal({ isOpen: true, title, message, onConfirm });
    };

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
        showModal(
            "Delete Ad",
            "Are you sure you want to permanently delete this ad? This action cannot be reversed.",
            async () => {
                try {
                    await api.delete(`/ads/${id}`)
                    fetchAds()
                } catch (err) {
                    console.error('Failed to delete ad')
                }
            },
            true,
            "Delete"
        );
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
            <h2 className="text-[12px] font-medium text-slate-200">Access Denied</h2>
            <p className="text-slate-500 max-w-xs text-center text-[12px] leading-relaxed">Only platform administrators can manage ads.</p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto pb-24 md:pb-20 no-scrollbar px-3 md:px-0">
            {/* Mobile Unified Header for Admin Ads */}
            <div className="md:hidden sticky top-[57px] z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5 pb-2 pt-3 px-3 space-y-3 -mx-3">
                <div className="flex items-center justify-between gap-3 px-3">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1">
                        <ShieldAlert size={16} className="text-primary-500" />
                        <span className="text-[12px]   font-medium text-white">Ad Management</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col items-center justify-center min-w-[70px]">
                        <div className="flex items-center gap-1">
                            <Sparkles size={12} className="text-amber-500" />
                            <span className="text-[12px]   font-medium text-white truncate max-w-[80px]">Admin</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6 mt-4">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                        <Sparkles className="text-primary-500 shrink-0" size={24} />
                        <span className="truncate">Ad Management</span>
                    </h1>
                    <p className="text-[12px] text-slate-500 md:ml-9 truncate">
                        Review and manage all advertisements across the network
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-white/5 shadow-inner mt-6 overflow-x-auto no-scrollbar my-2">
                {['pending_approval', 'active', 'paused', 'expired', 'budget_exhausted', 'all'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`flex-1 min-w-fit px-5 py-2.5 rounded-lg text-[12px]   font-medium transition-all whitespace-nowrap 
                            ${filter === t
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {t.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="animate-pulse h-32 bg-white/5 rounded-lg border border-white/5" />
                ) : filteredAds.length === 0 ? (
                    <div className="glass rounded-lg p-12 text-center border-dashed border-white/10 shadow-none">
                        <Megaphone className="text-slate-900 mx-auto mb-4 opacity-20" size={32} />
                        <h3 className="text-[12px] font-medium text-slate-500">No Ads Found</h3>
                        <p className="text-slate-600 mt-2 text-[12px]">There are no ads in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredAds.map(ad => (
                            <motion.div
                                key={ad._id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 hover:border-primary-500/30 transition-all duration-500 group"
                            >

                                <div className="relative h-36 overflow-hidden">
                                    <img
                                        src={ad.imageUrl}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                                    {/* owner */}
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="
      px-2.5 py-1
      rounded-lg
      text-[12px] font-medium
      border border-rose-500/20
      bg-rose-500/15
      text-rose-400
      backdrop-blur
    "
                                        >
                                            {ad.owner?.name || 'unknown user'}
                                        </span>
                                    </div>


                                    {/* status */}
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-lg text-[12px]   font-medium border backdrop-blur   
          ${ad.status === 'active'
                                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                                                    : ad.status === 'pending_approval'
                                                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                                                        : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
                                                }
        `}
                                        >
                                            {ad.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* content */}
                                <div className="p-4 md:p-5 flex flex-col gap-4">
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="text-[12px]   font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                                            {ad.title}
                                        </h3>

                                        <p className="text-[12px] md:text-[12px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                            {ad.description || 'no description provided'}
                                        </p>

                                        {ad.link && (
                                            <a
                                                href={ad.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 mt-3 rounded-lg bg-white/5 border border-white/10 text-[12px]   font-medium text-primary-400 hover:bg-primary-500 hover:text-white transition-all active:scale-95"
                                            >
                                                <LinkIcon size={12} />
                                                Visit Link
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between px-3 md:px-4 py-3 rounded-lg bg-slate-900 border border-white/5 shadow-inner">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] text-slate-500 font-medium">Budget</span>
                                            <span className="text-[13px]   font-medium text-emerald-400">₹{ad.budget?.toFixed(2)}</span>
                                        </div>

                                        <div className="flex flex-col gap-0.5 text-right">
                                            <span className="text-[12px] text-slate-500 font-medium">Ad Type</span>
                                            <span className="text-[12px]   font-medium text-white">{ad.adType}</span>
                                        </div>
                                    </div>

                                    {ad.status === 'pending_approval' ? (
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleStatusUpdate(ad._id, 'active')}
                                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[12px]   font-medium py-3 rounded-lg border border-emerald-500/20 transition-all active:scale-95"
                                            >
                                                <CheckCircle size={14} />
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    showInputModal(
                                                        'Reject Ad',
                                                        'Please specify the reason for rejecting this ad.',
                                                        (reason) => handleStatusUpdate(ad._id, 'rejected', reason)
                                                    )
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-[12px]   font-medium py-3 rounded-lg border border-rose-500/20 transition-all active:scale-95"
                                            >
                                                <XCircle size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end pt-1">
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                className="p-2.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-white/10 hover:border-rose-500/20 transition-all active:scale-95"
                                            >
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
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                isDanger={modal.isDanger}
                confirmText={modal.confirmText}
            />
            <InputModal
                isOpen={inputModal.isOpen}
                onClose={() => setInputModal({ ...inputModal, isOpen: false })}
                onConfirm={inputModal.onConfirm}
                title={inputModal.title}
                message={inputModal.message}
                confirmText="Submit Rejection"
                isDanger={true}
            />
        </div>
    )
}

export default AdminAds
