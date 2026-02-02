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
            "Purge Advertisement",
            "This will permanently remove the advertisement from the network terminal. Are you certain?",
            async () => {
                try {
                    await api.delete(`/ads/${id}`)
                    fetchAds()
                } catch (err) {
                    console.error('Failed to delete ad')
                }
            },
            true,
            "Purge"
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
            <h2 className="text-sm font-medium text-slate-200   er">Access Terminal Restricted</h2>
            <p className="text-slate-500 max-w-xs text-center text-xs leading-relaxed">Only platform administrators can manage billboard deployments.</p>
        </div>
    )

    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 pb-20 mt-4">
            {/* Header matches Groups.jsx */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                        <Sparkles className="text-primary-500 shrink-0" size={24} />
                        <span className="truncate">Ad Command</span>
                        <span className="text-[11px] md:text-[12px] text-slate-500 font-medium ml-2 opacity-50 shrink-0 uppercase tracking-widest">
                            Admin Clearance
                        </span>
                    </h1>
                    <p className="text-[10px] md:text-[11px] font-medium text-slate-500 md:ml-9 truncate uppercase tracking-tighter">
                        Authorized deployment and transmission oversight
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-1">
                {['pending_approval', 'active', 'paused', 'expired', 'budget_exhausted', 'all'].map(t => (
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
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="
    glass rounded-xl overflow-hidden
    border border-white/5
    bg-slate-950/40
    hover:border-primary-500/30
    transition-all duration-500
    group
  "
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
      text-[11px] font-medium
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
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border backdrop-blur
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
                                <div className="p-4 flex flex-col gap-4">
                                    {/* title & description */}
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-white truncate">
                                            {ad.title}
                                        </h3>

                                        <p className="text-[12px] text-slate-400 line-clamp-2">
                                            {ad.description || 'no description provided'}
                                        </p>

                                        {ad.link && (
                                            <a
                                                href={ad.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
            inline-flex items-center justify-center gap-2
            px-3 py-2 mt-2
            rounded-lg
            text-[12px] font-medium
            bg-primary-500/10
            text-primary-400
            border border-primary-500/20
            hover:bg-primary-500 hover:text-white
            transition-all
            active:scale-95
          "
                                            >
                                                <LinkIcon size={13} />
                                                visit to the site
                                            </a>
                                        )}
                                    </div>

                                    {/* meta info */}
                                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[12px] text-slate-500 font-medium">
                                                budget
                                            </span>
                                            <span className="text-[12px] font-medium text-slate-200">
                                                ₹{ad.budget?.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-0.5 text-right">
                                            <span className="text-[12px] text-slate-500 font-medium">
                                                format
                                            </span>
                                            <span className="text-[12px] font-medium text-slate-200">
                                                {ad.adType}
                                            </span>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    {ad.status === 'pending_approval' ? (
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleStatusUpdate(ad._id, 'active')}
                                                className="
            flex-1 flex items-center justify-center gap-2
            bg-emerald-500/10 hover:bg-emerald-500
            text-emerald-400 hover:text-white
            text-[12px] font-medium
            py-2.5 rounded-lg
            border border-emerald-500/20
            transition-all active:scale-95
          "
                                            >
                                                <CheckCircle size={14} />
                                                approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    showInputModal(
                                                        'rejection protocol',
                                                        'specify the reason for rejecting this ad.',
                                                        (reason) => handleStatusUpdate(ad._id, 'rejected', reason)
                                                    )
                                                }
                                                className="
            flex-1 flex items-center justify-center gap-2
            bg-rose-500/10 hover:bg-rose-500
            text-rose-400 hover:text-white
            text-[12px] font-medium
            py-2.5 rounded-lg
            border border-rose-500/20
            transition-all active:scale-95
          "
                                            >
                                                <XCircle size={14} />
                                                reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end pt-1">
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                className="p-2 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
