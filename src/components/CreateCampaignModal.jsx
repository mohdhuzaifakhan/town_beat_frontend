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

        const uploadRes = await api.post("/files/upload-url", uploadData, {
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
        className="relative w-full md:max-w-md bg-slate-900 md:rounded-lg rounded-t-lg border-t md:border border-white/10 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Megaphone className="text-rose-500" size={20} />
            </div>
            <div>
              <h2 className="text-[12px]   font-medium text-white">
                Create Campaign
              </h2>
              <p className="text-[12px] text-slate-500">
                Start a movement in your city
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
                placeholder="Enter campaign title..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Description
              </label>
              <textarea
                required
                value={formData.objective}
                onChange={(e) =>
                  setFormData({ ...formData, objective: e.target.value })
                }
                placeholder="Describe your campaign objective..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-5 h-32 resize-none text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Target Supporters
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 text-[12px] text-white focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.daysLeft}
                  onChange={(e) =>
                    setFormData({ ...formData, daysLeft: e.target.value })
                  }
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 text-[12px] text-white focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Campaign Image (Optional)
              </label>
              <label className="flex items-center gap-4 w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 cursor-pointer hover:border-primary-500/40 transition-all shadow-inner group">
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className={`p-2 rounded-lg ${file ? "bg-primary-500/20 text-primary-400" : "bg-slate-900 text-slate-600"} group-hover:scale-110 transition-transform`}>
                  <ImageIcon size={18} />
                </div>
                <span
                  className={`text-[12px]   font-medium truncate ${file ? "text-white" : "text-slate-700"
                    }`}
                >
                  {file ? file.name : "Upload image"}
                </span>
              </label>
            </div>

            {progress > 0 && progress < 100 && (
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500   font-medium py-3 rounded-lg transition-all border border-white/10 text-[12px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-500 text-white   font-medium py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-primary-900/40 text-[12px] border border-white/10"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={16} />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
