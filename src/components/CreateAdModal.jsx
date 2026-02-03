import { useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Image as ImageIcon,
  Plus,
  Loader2,
  Link as LinkIcon,
  Megaphone,
  X,
} from "lucide-react";
import api from "../api/client";

export const CreateAdModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    adType: "feed",
    budget: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    placement: "home_feed",
    link: "",
  });

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/upload", data);
      setFormData({ ...formData, imageUrl: res.data.url });
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/ads", formData);
      onCreated?.();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full md:max-w-xl bg-slate-900 md:rounded-lg rounded-t-lg border-t md:border border-white/10 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center border border-primary-500/20">
              <Megaphone className="text-primary-500" size={20} />
            </div>
            <div>
              <h2 className="text-[12px]   font-medium text-white">Create Campaign</h2>
              <p className="text-[12px] text-slate-500">
                Launch a new sponsored signal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Campaign Title
              </label>
              <input
                autoFocus
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-700"
                placeholder="Enter a compelling transmission headline..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Ad Type
                </label>
                <select
                  value={formData.adType}
                  onChange={(e) =>
                    setFormData({ ...formData, adType: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none cursor-pointer"
                >
                  <option value="feed">Central Feed Signal</option>
                  <option value="banner">Network Banner</option>
                  <option value="card">Operational Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Budget (₹)
                </label>
                <div className="relative">
                  <IndianRupee
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={14}
                  />
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budget: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px]   font-medium text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Ad Image
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <ImageIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={16}
                  />
                  <input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-[12px]   font-medium text-white placeholder:text-slate-700"
                    placeholder="Paste image URL..."
                  />
                </div>
                <label className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all text-[12px]   font-medium text-slate-400">
                  {uploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {uploading ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Placement
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData({ ...formData, placement: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none cursor-pointer"
                >
                  <option value="home_feed">Home Feed Signal</option>
                  <option value="sidebar">Peripheral Sidebar</option>
                  <option value="story">Temporal Story</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Link
                </label>
                <div className="relative">
                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    size={16}
                  />
                  <input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-[12px]   font-medium text-white placeholder:text-slate-700"
                    placeholder="https://destination.nexus/..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white   font-medium py-5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl shadow-primary-900/40 text-[12px] active:scale-[0.98]"
              >
                {creating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Ad"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
