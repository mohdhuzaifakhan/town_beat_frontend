import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Target, Clock, PlusSquare, Loader2, ArrowRight } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { CreateCampaignModal } from '../components/CreateCampaignModal'
import { CampaignCard } from '../components/CampaignCard'

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
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/5"
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
                    <p className="text-slate-400 text-sm">Loading campaigns...</p>
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

export default Campaigns
