import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, PlusSquare, Loader2, Globe, Shield, X } from "lucide-react";
import api from "../api/client";
import { ProtocolTypeDropdown } from "./ProtocolTypeDropdown";

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
            <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center border border-primary-500/20">
              <Users className="text-primary-500" size={20} />
            </div>
            <div>
              <h2 className="text-[12px]   font-medium text-white">
                Create Group
              </h2>
              <p className="text-[12px] text-slate-500">
                Build your local community
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
                Group Name
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                placeholder="Enter group name..."
              />
            </div>

            <ProtocolTypeDropdown
              value={formData.type}
              onChange={(type) => setFormData({ ...formData, type })}
            />

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-5 h-32 resize-none text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                placeholder="Describe the purpose of this group..."
              />
            </div>

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
