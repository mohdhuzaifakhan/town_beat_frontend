import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import api from "../api/client";

export const AdWidget = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/ads")
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || ads.length === 0) return null;
  const ad = ads[0];

  return (
    <div className="glass rounded-xl p-5 space-y-4 relative overflow-hidden group shadow-none">
      <div className="flex items-center justify-between relative">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
          <Sparkles size={14} />
          Billboard
        </h3>
      </div>
      <div className="space-y-3 relative">
        <div className="rounded-xl overflow-hidden border border-white/5 aspect-video relative bg-slate-900/40">
          <img
            src={ad.imageUrl}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2000ms]"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-white text-[11px] uppercase tracking-tight group-hover:text-primary-300 transition-colors">
            {ad.title}
          </h4>
          <p className="text-[9px] text-slate-600 font-bold line-clamp-2 leading-relaxed uppercase tracking-wider">
            {ad.description}
          </p>
        </div>
        <a
          href={ad.link}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl font-black text-[9px] transition-all border border-white/5 active:scale-95 uppercase tracking-widest"
        >
          Access Gateway
          <ExternalLink size={12} className="text-indigo-400" />
        </a>
      </div>
    </div>
  );
};
