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

    const fetchCampaigns = async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const res = await api.get('/campaigns')
            setCampaigns(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4 pb-20 mt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full">
                        <Megaphone className="text-rose-500 shrink-0" size={22} />
                        <span className="truncate">Run Compaigns</span>
                        <span className="text-[11px] md:text-[12px] text-slate-600 font-medium ml-2 opacity-50 shrink-0">Live Compaigns</span>
                    </h1>
                    <p className="text-[10px] md:text-[11px] font-medium text-slate-600 md:ml-9 truncate">Start a Campaign Today—Turn Collective Voices into Action</p>
                </div>
                {user && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-bold text-[11px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/10"
                    >
                        <PlusSquare size={14} />
                        Create Compaign
                    </button>
                )}
            </div>

            {showCreate && (
                <CreateCampaignModal onClose={() => setShowCreate(false)} onCreated={() => fetchCampaigns(false)} />
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="animate-spin text-primary-400" size={24} />
                    <p className="text-slate-400 text-[12px] font-medium">Collecting Compaigns...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {campaigns.map(campaign => (
                        <CampaignCard key={campaign._id} campaign={campaign} onSupported={() => fetchCampaigns(true)} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Campaigns
