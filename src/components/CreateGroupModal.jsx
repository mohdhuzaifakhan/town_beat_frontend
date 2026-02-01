import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, PlusSquare, Loader2, Globe, Shield } from "lucide-react";
import api from "../api/client";

export const CreateGroupModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Civic",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/groups", formData);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-sm rounded-lg p-6 space-y-5 border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <Users className="text-primary-500" size={16} />
          </div>
          <div>
            <h2 className="text-xs font-medium text-white">
              Initialize Sector
            </h2>
            <p className="text-slate-600 text-[9px] font-medium">
              Connect local nodes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Sector Designation
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all"
              placeholder="DESIGNATE SECTOR NAME..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Protocol Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white appearance-none focus:outline-none focus:border-primary-500/50 transition-all"
            >
              <option value="Civic">CIVIC</option>
              <option value="Political">POLITICAL</option>
              <option value="News">ARCHIVE</option>
              <option value="Social">CONNECT</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Operational Brief
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-4 h-24 resize-none text-[11px] text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all font-bold"
              placeholder="BRIEF SECTOR OBJECTIVES..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-medium py-3 rounded-lg transition-all border border-white/5 text-[9px]"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/40 text-[9px] border border-white/10"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={12} />
              ) : (
                "Establish"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
