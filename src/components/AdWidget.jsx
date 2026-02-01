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

  if (loading || ads.length === 0) return null;

  const ad = ads[Math.floor(Math.random() * ads.length)];

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
          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-xs font-bold text-white
                       bg-white/5 hover:bg-white/10 transition border border-white/5 active:scale-95"
          >
            Visit Website
            <ExternalLink size={12} className="text-indigo-400" />
          </a>
        )}
      </div>
    </div>
  );
};
