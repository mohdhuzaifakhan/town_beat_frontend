import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export const CreateCampaignModal = ({ onClose, onCreated }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    objective: "",
    target: 100,
    daysLeft: 30,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const uploadRes = await api.post("/s3/upload", uploadData, {
          onUploadProgress: (p) =>
            setProgress(Math.round((p.loaded * 100) / p.total)),
        });

        imageUrl = uploadRes.data.url;
      }

      const payload = {
        ...formData,
        target: Number(formData.target),
        image: imageUrl,
        location: user?.location || "General Sector",
        endDate: new Date(
          Date.now() + Number(formData.daysLeft) * 24 * 60 * 60 * 1000
        ),
      };

      await api.post("/campaigns", payload);
      onCreated();
      onClose();
    } catch (err) {
      console.error("Campaign creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md rounded-xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Megaphone className="text-rose-500" size={16} />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">
                Create Campaign
              </h2>
              <p className="text-[11px] text-slate-500">
                Authorized Community Action Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] overflow-y-auto p-5 space-y-4"
        >
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Campaign Title
            </label>
            <input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter Compaign Title"
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Campaign Objective
            </label>
            <textarea
              required
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              placeholder="Your Compaign Objective"
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-primary-500/50 transition-all resize-none min-h-[90px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Participation Target
              </label>
              <input
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Campaign Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                value={formData.daysLeft}
                onChange={(e) =>
                  setFormData({ ...formData, daysLeft: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Campaign Visual (Optional)
            </label>
            <label className="flex items-center gap-3 w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer hover:border-primary-500/40 transition-all">
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <ImageIcon
                size={14}
                className={file ? "text-primary-400" : "text-slate-600"}
              />
              <span
                className={`text-[11px] font-bold truncate ${
                  file ? "text-white" : "text-slate-500"
                }`}
              >
                {file ? file.name : "Attach Image"}
              </span>
            </label>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 py-3 rounded-lg text-[11px] font-bold border border-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={14} />
              ) : (
                "Launch Campaign"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
