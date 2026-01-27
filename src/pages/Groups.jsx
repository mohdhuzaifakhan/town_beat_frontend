import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, PlusSquare, Loader2, Globe, Shield } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const Groups = () => {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            const res = await api.get('/groups')
            setGroups(res.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase">
                        <Users className="text-amber-500" size={24} />
                        Sectors
                        <span className="text-[10px] text-slate-600 tracking-widest font-black ml-2 opacity-50">Local Communities</span>
                    </h1>
                </div>
                {user && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/5"
                    >
                        <PlusSquare size={14} />
                        New Sector
                    </button>
                )}
            </div>

            {showCreate && (
                <CreateGroupModal onClose={() => setShowCreate(false)} onCreated={fetchGroups} />
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="animate-spin text-primary-400" size={24} />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Scanning Network...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map(group => (
                        <GroupCard key={group._id} group={group} onJoined={fetchGroups} />
                    ))}
                </div>
            )}
        </div>
    )
}

const GroupCard = ({ group, onJoined }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleJoin = async () => {
        if (!user) return
        setLoading(true)
        try {
            await api.post(`/groups/${group._id}/join`)
            onJoined()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleInvite = async () => {
        try {
            const { data } = await api.post(`/groups/${group._id}/invite`)
            const inviteLink = `${window.location.origin}/groups/join?code=${data.inviteCode}`
            await navigator.clipboard.writeText(inviteLink)
            // Still using alert but could be refined to a toast later if needed
            alert(`Invite code synchronized: ${data.inviteCode}`)
            onJoined()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 flex gap-4 hover:border-primary-500/20 transition-all cursor-pointer group relative overflow-hidden border-white/[0.03] shadow-none"
        >
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-lg font-black text-primary-400 shrink-0 overflow-hidden shadow-sm shadow-black/40">
                {group.image ? <img src={group.image} className="w-full h-full object-cover" /> : group.name[0]}
            </div>
            <div className="flex-1 space-y-1 relative">
                <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-black group-hover:text-primary-300 transition-colors uppercase tracking-tight">{group.name}</h3>
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/[0.05] text-slate-600">
                        {group.type}
                    </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold line-clamp-1 leading-relaxed uppercase tracking-wider opacity-70">{group.description || 'Sector archive mission objective.'}</p>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                        <Users className="text-primary-500/40" size={12} />
                        {group.membersCount} Units
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleInvite(); }}
                            className="text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-widest active:scale-95"
                        >
                            Signal
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleJoin(); }}
                            disabled={loading}
                            className="text-[9px] font-black text-primary-500 hover:text-primary-400 disabled:opacity-50 transition-colors uppercase tracking-widest active:scale-95"
                        >
                            {loading ? 'Joining...' : 'Link Sector'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const CreateGroupModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({ name: '', description: '', type: 'Civic' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/groups', formData)
            onCreated()
            onClose()
        } catch (err) {
            console.error(err)
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
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <Users className="text-primary-500" size={16} />
                    </div>
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-white">Initialize Sector</h2>
                        <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Connect local nodes.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Sector Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full compact-input"
                            placeholder="e.g. SOUTH ASIA"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Function Protocol</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="w-full compact-select"
                        >
                            <option value="Civic">CIVIC</option>
                            <option value="Political">POLITICAL</option>
                            <option value="News">ARCHIVE</option>
                            <option value="Social">CONNECT</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Objective</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full compact-input min-h-[80px] py-3 h-20 resize-none uppercase text-[10px]"
                            placeholder="Describe sector purpose..."
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-black py-2.5 rounded-xl transition-all border border-white/5 text-[9px] uppercase tracking-widest"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-black py-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/20 text-[9px] uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Establish'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Groups
