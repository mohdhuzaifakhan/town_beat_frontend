import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export const GroupCard = ({ group, onJoined }) => {
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
                <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed opacity-70">{group.description || 'Community group for local discussions.'}</p>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Users className="text-primary-500/40" size={12} />
                        {group.membersCount} Units
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleInvite(); }}
                            className="text-xs font-bold text-slate-500 hover:text-white transition-colors active:scale-95"
                        >
                            Signal
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleJoin(); }}
                            disabled={loading}
                            className="text-xs font-bold text-primary-500 hover:text-primary-400 disabled:opacity-50 transition-colors active:scale-95"
                        >
                            {loading ? 'Joining...' : 'Link Sector'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
