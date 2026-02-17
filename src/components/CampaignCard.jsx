import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Target,
  Clock,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ConfirmationModal } from "./ConfirmationModal";

export const CampaignCard = ({ campaign, onSupported }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSupport = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.post(`/campaigns/${campaign._id}/support`);
      onSupported();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/campaigns/${campaign._id}`);
      onSupported(); // Refresh list
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const isSupported = (campaign.supporters || []).some(
    (id) => id.toString() === user?._id,
  );
  const isOrganizer = campaign.organizer?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-5 hover:border-primary-500/20 transition-all group border-white/10 shadow-2xl bg-slate-900/40 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/3 blur-3xl -mr-32 -mt-32 transition-colors duration-1000 group-hover:bg-primary-500/10 pointer-events-none" />
      <div className="w-full md:w-32 lg:w-40 h-44 md:h-40 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-white/10 shadow-xl relative z-10 group-hover:border-primary-500/30 transition-all">
        <img
          src={
            campaign.image ||
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
          }
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-3000 opacity-60 group-hover:opacity-100"
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
      </div>

      <div className="flex-1 flex flex-col justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`px-2 py-0.5 border rounded-lg flex items-center gap-1.5 ${isSupported ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}
                >
                  <div
                    className={`w-1 h-1 rounded-full animate-pulse ${isSupported ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  <span
                    className={`text-[10px]   font-medium ${isSupported ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {isSupported ? "SUPPORT RECORDED" : "OPERATIONAL PULSE"}
                  </span>
                </div>
                {isOrganizer && (
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-medium text-amber-500">
                    Authority
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <img
                    src={campaign.organizer?.avatar}
                    className="w-4 h-4 rounded-full border border-white/10"
                    alt=""
                  />
                  <span className="text-[12px] font-medium text-slate-400 truncate max-w-[120px]">
                    {campaign.organizer?.name || "Authorized Personnel"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-medium text-rose-500/60">
                  <MapPin size={10} className="text-rose-500/50" />
                  <span className="truncate">{campaign.location || "General group"}</span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-medium text-white group-hover:text-primary-300 transition-colors leading-tight truncate">
                {campaign.title}
              </h3>
            </div>
            {isOrganizer && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all md:opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-primary-500/60" size={13} />
                <span className="text-[12px] font-medium text-slate-500">
                  Objective
                </span>
              </div>
              <span className="text-primary-400   font-medium text-[12px] tabular-nums">
                {Math.round(
                  (campaign.supporters?.length / (campaign.target || 1)) * 100,
                )}
                % SUPPORT
              </span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed opacity-80 italic line-clamp-2">
              {campaign.objective}
            </p>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/10 p-px">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${Math.min(100, (campaign.supporters?.length / (campaign.target || 1)) * 100)}%`,
                }}
                viewport={{ once: true }}
                className="h-full bg-primary-600 rounded-full shadow-[0_0_12px_rgba(227,67,67,0.4)]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 mt-4">
          <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-1">
            <div className="flex items-center gap-2">
              <Clock
                className={`text-amber-500/40 ${campaign.daysLeft <= 1 ? "text-rose-500/80 animate-pulse" : ""}`}
                size={12}
              />
              <span
                className={`text-[10px] font-medium ${campaign.daysLeft <= 1 ? "text-rose-500/80" : "text-slate-500"}`}
              >
                {campaign.daysLeft} DAYS LEFT
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Megaphone className="opacity-40" size={12} />
              <span className="text-[10px] font-medium">
                {campaign.supporters?.length || 0} / {campaign.target} SIGNALS
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleSupport}
              disabled={loading || isSupported}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-lg font-medium text-[12px] transition-all border shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-default
                                ${isSupported
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500/60"
                  : "bg-primary-600 hover:bg-primary-500 text-white border-white/10 shadow-primary-900/40"
                }
                            `}
            >
              {loading ? (
                <Loader2 size={12} className="animate-spin mx-auto" />
              ) : isSupported ? (
                "Signal Logged"
              ) : (
                "Support Movement"
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Decommission Signal"
        message="Are you sure you want to decommission this movement? This action cannot be archived."
        confirmText="Decommission"
        isDanger={true}
      />
    </motion.div>
  );
};
