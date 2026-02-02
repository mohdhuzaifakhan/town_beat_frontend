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
    <div className="glass rounded-lg p-5 space-y-4 relative overflow-hidden group">
      <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
        <Sparkles size={14} />
        Sponsored
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

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white leading-tight">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2">
            {ad.description}
          </p>
        </div>

        {ad.link && (
          <button
            onClick={handleAdClick}
            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-medium text-white
                       bg-black/20 hover:bg-white/10 transition border border-white/10 active:scale-95"
          >
            Visit Website
            <ExternalLink size={12} className="text-indigo-400" />
          </button>
        )}
      </div>
    </div>
  );
};
