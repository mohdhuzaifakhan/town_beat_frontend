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
            className="glass rounded-lg border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden hover:border-primary-500/20 transition-all p-4 md:p-5 space-y-4 group relative shadow-xl"
        >
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500/10 rounded-bl-xl border-l border-b border-primary-500/10 backdrop-blur-sm">
                <span className="text-[12px] font-medium text-primary-400 flex items-center gap-1.5">
                    Signal Promo <Megaphone size={10} strokeWidth={2.5} />
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950 p-[1px] shadow-lg shadow-primary-500/10 ring-1 ring-white/5 group-hover:ring-primary-500/30 transition-all">
                    <div className="w-full h-full rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center">
                        {ad.owner?.avatar ? (
                            <img src={ad.owner.avatar} alt={ad.owner.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-[12px]   font-medium text-primary-500">{ad.owner?.name?.[0] || 'A'}</div>
                        )}
                    </div>
                </div>
                <div>
                    <span className="text-[12px] font-medium text-white">
                        {ad.owner?.name || 'Partner Brand'}
                    </span>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Network Partner</p>
                </div>
            </div>

            <div className="space-y-3 cursor-pointer" onClick={handleAdClick}>
                <h3 className="text-base font-medium text-white group-hover:text-primary-400 transition-colors">
                    {ad.title}
                </h3>
                {ad.description && (
                    <p className="text-slate-300 text-[13px] font-medium leading-relaxed whitespace-pre-wrap">
                        {ad.description}
                    </p>
                )}

                {ad.imageUrl && (
                    <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-black/40 group-hover:border-primary-500/20 transition-all duration-500 aspect-video relative">
                        <img src={ad.imageUrl} alt="Ad content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="text-[12px] text-slate-500 font-medium">
                    TownBeat Ads Console
                </div>
                <button
                    onClick={handleAdClick}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-[12px]   font-medium transition-all shadow-lg shadow-primary-900/20 active:scale-95 group/btn border border-white/10"
                >
                    Access Intelligence <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};
