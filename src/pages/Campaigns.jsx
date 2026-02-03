import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Target, Clock, PlusSquare, Loader2, ArrowRight } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { CreateCampaignModal } from '../components/CreateCampaignModal'
import { CampaignCard } from '../components/CampaignCard'

const Campaigns = ({ isCreateModalOpen, setCreateModalOpen }) => {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [locationScope, setLocationScope] = useState("Local")
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
        <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar">
            {/* Mobile Unified Dashboard for Campaigns */}
            <div className="md:hidden sticky top-[57px] z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5 pb-2 pt-3 px-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div
                        onClick={() => setCreateModalOpen(true)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3 text-slate-500 active:scale-[0.98] transition-all"
                    >
                        <div className="p-1 rounded-lg bg-primary-500/10">
                            <Megaphone size={16} className="text-rose-500" />
                        </div>
                        <span className="text-[12px]   font-medium  ">Launch campaign...</span>
                    </div>

                    <button
                        onClick={() => setLocationScope(locationScope === "Local" ? "Global" : "Local")}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col items-center justify-center min-w-[70px] active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${locationScope === "Local" ? "bg-primary-500 animate-pulse" : "bg-blue-400"}`} />
                            <span className="text-[12px]   font-medium text-white truncate max-w-[80px]">
                                {locationScope === "Local" ? (user?.location || "Local") : "Global"}
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="px-4 hidden md:block mt-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6">
                    <div className="space-y-1 max-w-full overflow-hidden">
                        <h1 className="text-xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                            <Megaphone className="text-rose-500 shrink-0" size={22} />
                            <span className="truncate">Run Campaigns</span>
                            <span className="text-[12px] md:text-[12px] text-slate-600 font-medium ml-2 opacity-50 shrink-0">Live Campaigns</span>
                        </h1>
                        <p className="text-[12px] md:text-[12px] font-medium text-slate-600 md:ml-9">Start a Campaign Today—Turn Collective Voices into Action</p>
                    </div>
                    {user && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg   font-medium text-[12px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary-900/40 active:scale-95 border border-white/10"
                        >
                            <PlusSquare size={14} />
                            Create Campaign
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-3 md:px-4 mt-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-primary-500/10 border-t-primary-500 animate-spin shadow-[0_0_20px_rgba(227,67,67,0.1)]"></div>
                            <Megaphone className="absolute inset-0 m-auto text-rose-500 animate-pulse" size={24} />
                        </div>
                        <p className="text-slate-500 text-[12px]   font-medium">Collecting Campaigns...</p>
                    </div>
                ) : (
                    <>
                        {campaigns.length > 0 ? (
                            campaigns.map(campaign => (
                                <CampaignCard key={campaign._id} campaign={campaign} onSupported={() => fetchCampaigns(true)} />
                            ))
                        ) : (
                            <div className="py-32 text-center space-y-4 opacity-40">
                                <Megaphone size={48} className="mx-auto text-slate-500" />
                                <p className="text-slate-500 text-[12px]   font-medium     ">
                                    No active campaigns discovered
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isCreateModalOpen && (
                <CreateCampaignModal
                    onClose={() => setCreateModalOpen(false)}
                    onCreated={() => {
                        setCreateModalOpen(false);
                        fetchCampaigns(false);
                    }}
                />
            )}
        </div>
    )
}

export default Campaigns
