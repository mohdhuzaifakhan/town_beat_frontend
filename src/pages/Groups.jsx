import { useState, useEffect } from 'react'
import { Users, PlusSquare, Loader2, Globe, Shield } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { GroupCard } from '../components/GroupCard'
import { CreateGroupModal } from '../components/CreateGroupModal'

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
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/5"
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
                    <p className="text-slate-400 text-sm">Loading groups...</p>
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

export default Groups
