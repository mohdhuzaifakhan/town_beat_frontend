import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Megaphone, MoreHorizontal, ArrowRight } from "lucide-react";
import api from '../api/client';

export const AdFeedItem = ({ ad }) => {

    const handleAdClick = async () => {
        try {
            await api.post(`/ads/${ad._id}/click`);
            window.open(ad.link, '_blank', 'noopener,noreferrer');
        } catch (err) {
            console.error("Failed to track click", err);
            window.open(ad.link, '_blank', 'noopener,noreferrer');
        }
    };

    const handleImpression = async () => {
        // This would ideally be called with an Intersection Observer
        try {
            await api.post(`/ads/${ad._id}/impression`);
        } catch (err) {
            console.error("Failed to track impression", err);
        }
    };

    // Use effect to track impression on mount (simple version)
    // In production use IntersectionObserver
    useEffect(() => {
        handleImpression();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg border border-primary-500/10 bg-gradient-to-br from-slate-900/40 to-primary-900/5 backdrop-blur-sm overflow-hidden hover:border-primary-500/20 transition-all p-5 space-y-4 group relative"
        >
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500/10 rounded-bl-lg border-l border-b border-primary-500/10">
                <span className="text-[11px] text-primary-400 flex items-center gap-1.5">
                    Sponsored <Megaphone size={11} />
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0 shadow-lg">
                    {ad.owner?.avatar ? (
                        <img src={ad.owner.avatar} alt={ad.owner.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                        <div className="text-xs font-medium text-primary-500">{ad.owner?.name?.[0] || 'A'}</div>
                    )}
                </div>
                <div>
                    <span className="text-xs text-white">
                        {ad.owner?.name || 'Partner Brand'}
                    </span>
                    <p className="text-xs text-slate-500">Promoted Content</p>
                </div>
            </div>

            <div className="space-y-1 cursor-pointer" onClick={handleAdClick}>
                <h3 className="text-base font-medium text-slate-500">
                    {ad.title}
                </h3>
                {ad.description && (
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                        {ad.description}
                    </p>
                )}

                {ad.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-white/5 shadow-2xl shadow-black/50 group-hover:scale-[1.01] transition-transform duration-500">
                        <img src={ad.imageUrl} alt="Ad content" className="w-full h-auto object-cover max-h-80" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="text-[12px] text-slate-600 font-medium">
                    Ads by TownBeat
                </div>
                <button
                    onClick={handleAdClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-400 transition-all shadow-lg shadow-primary-900/20 active:scale-95 group/btn"
                >
                    Visit Site <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};
