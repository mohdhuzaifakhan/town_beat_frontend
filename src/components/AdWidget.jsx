import { useState, useEffect } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import api from "../api/client";

export const AdWidget = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get("/ads");
        setAds(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const ad = ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;

  useEffect(() => {
    if (ad?._id) {
      api.post(`/ads/${ad._id}/impression`).catch(console.error);
    }
  }, [ad?._id]);

  const handleAdClick = async () => {
    if (!ad) return;
    try {
      await api.post(`/ads/${ad._id}/click`);
      if (ad.link) window.open(ad.link, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to track click", err);
      if (ad.link) window.open(ad.link, "_blank", "noopener,noreferrer");
    }
  };

  if (loading || ads.length === 0 || !ad) return null;

  return (
    <div className="glass rounded-lg p-5 space-y-5 relative overflow-hidden group border-white/5 bg-slate-900/40 shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/[0.03] blur-2xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors duration-1000" />

      <h3 className="text-[12px] font-medium text-primary-400 flex items-center gap-2 relative">
        <Sparkles size={12} className="text-primary-500" />
        Signal Promo
      </h3>

      <div className="space-y-3">
        <div className="rounded-lg overflow-hidden border border-white/5 aspect-video bg-slate-900/40 relative">
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.title || "Sponsored Ad"}
              className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent" />
        </div>

        <div className="space-y-1.5 relative">
          <h4 className="text-[12px] font-medium text-white group-hover:text-primary-400 transition-colors">
            {ad.title}
          </h4>
          <p className="text-[12px] font-medium text-slate-500 line-clamp-2">
            {ad.description}
          </p>
        </div>

        {ad.link && (
          <button
            onClick={handleAdClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[12px]  font-medium text-white
                       bg-white/5 hover:bg-primary-600 transition-all border border-white/10 hover:border-primary-500/20 active:scale-95 shadow-lg group-hover:shadow-primary-900/10"
          >
            Access Asset
            <ExternalLink size={12} className="text-primary-400 group-hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
