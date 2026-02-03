import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Loader2,
  Megaphone,
  Layout,
  IndianRupee,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion"

const AdsManager = ({ isCreateModalOpen, setCreateModalOpen }) => {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    adType: "feed",
    placement: "home_feed",
    budget: 1000,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });
  const [uploading, setUploading] = useState(false);
  const { user, updateUser } = useAuth();

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    isDanger: false,
    confirmText: "Confirm"
  });

  const showModal = (title, message, onConfirm, isDanger = false, confirmText = "Confirm") => {
    setModal({ isOpen: true, title, message, onConfirm, isDanger, confirmText });
  };

  useEffect(() => {
    fetchMyAds();
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await api.get("/payments/balance");
      if (res.data) {
        updateUser({ walletBalance: res.data.walletBalance });
      }
    } catch (err) {
      console.error("Failed to fetch balance");
    }
  };

  const fetchMyAds = async () => {
    try {
      const res = await api.get("/ads/my-ads");
      setMyAds(res.data);
    } catch (err) {
      console.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (start < now) {
        showModal("Validation Error", "Launch date cannot be in the past", () => { });
        setCreating(false);
        return;
      }

      if (end <= start) {
        showModal("Validation Error", "End date must be after start date", () => { });
        setCreating(false);
        return;
      }

      if (Number(formData.budget) > (user?.walletBalance || 0)) {
        showModal(
          "Insufficient Balance",
          `Your current wallet balance (₹${(user?.walletBalance ?? 0).toFixed(2)}) is insufficient to cover this ad's budget (₹${formData.budget}). Please top up your wallet first.`,
          () => { },
          true,
          "Understood"
        );
        setCreating(false);
        return;
      }

      await api.post("/ads", {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl?.trim() || "",
        link: formData.link?.trim() || "",
        budget: Number(formData.budget)
      });

      // Update local balance from DB
      await fetchBalance();

      // Reset form but keep default dates/budget
      setFormData({
        ...formData,
        title: "",
        description: "",
        imageUrl: "",
        link: "",
      });
      setCreateModalOpen(false);
      fetchMyAds();
    } catch (err) {
      console.error("Failed to create ad");
    } finally {
      setCreating(false);
    }
  };

  const handlePause = async (id) => {
    try {
      await api.put(`/ads/${id}/pause`);
      fetchMyAds();
    } catch (err) {
      console.error("Failed to pause ad");
    }
  };

  const handleResume = async (id) => {
    try {
      await api.put(`/ads/${id}/resume`);
      fetchMyAds();
    } catch (err) {
      console.error("Failed to resume ad");
    }
  };

  const handleDelete = async (id) => {
    showModal(
      "Delete Ad",
      "Are you sure you want to permanently delete this ad? This action cannot be reversed.",
      async () => {
        try {
          await api.delete(`/ads/${id}`);
          fetchMyAds();
        } catch (err) {
          console.error("Failed to delete ad");
        }
      },
      true,
      "Delete"
    );
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await api.post("/files/upload-url", {
        fileName: file.name,
        mimeType: file.type,
      });

      const { uploadUrl, publicUrl } = data;

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setFormData({ ...formData, imageUrl: publicUrl });
    } catch (err) {
      console.error("Upload failed", err);
      showModal("Upload Failed", "We encountered an error while uploading the image. Please try again.", () => { }, true);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "paused":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "pending_approval":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "budget_exhausted":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "expired":
        return "bg-slate-700/10 text-slate-500 border-slate-700/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, "MMM d");
    } catch (error) {
      return "Error";
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto pb-24 md:pb-20 no-scrollbar px-3 md:px-0">
        {/* Mobile Unified Header for Ads Manager */}
        <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3 space-y-3 -mx-3">
          <div className="flex items-center justify-between gap-3 px-3">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1">
              <Megaphone size={16} className="text-primary-500" />
              <span className="text-[12px]   font-medium text-white">Ads Manager</span>
            </div>

            <Link to="/settings" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col items-center justify-center min-w-[90px] active:scale-95 transition-all">
              <div className="flex items-center gap-1">
                <IndianRupee size={12} className="text-emerald-500" />
                <span className="text-[12px]   font-medium text-white truncate max-w-[80px]">
                  ₹{(user?.walletBalance ?? 0).toFixed(2)}
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/10 pb-6 mt-4">
          <div className="space-y-1 max-w-full overflow-hidden">
            <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
              <Megaphone className="text-primary-500 shrink-0" size={24} />
              <span className="truncate">Ads Manager</span>
            </h1>
            <p className="text-[12px] text-slate-500 md:ml-9">
              Manage your advertising campaigns and balance
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex-1 md:flex-none glass px-6 py-3 rounded-lg flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-500 text-white border-primary-500/20 transition-all   font-medium text-[12px] active:scale-95 shadow-lg shadow-primary-900/40"
            >
              <Plus size={16} />
              Create Ad
            </button>

            <Link to="/settings" className="glass p-4 rounded-lg flex items-center gap-4 bg-slate-900/40 border-white/10 hover:border-primary-500/30 transition-all">
              <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400">
                <IndianRupee size={20} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[12px] font-medium text-slate-500">Wallet Balance</p>
                <p className="text-lg   font-medium text-white">₹{(user?.walletBalance ?? 0).toFixed(2)}</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="col-span-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px]   font-medium text-slate-500">Your Ads</h2>
              <div className="h-px bg-white/5 flex-1 ml-6" />
            </div>
            {loading ? (
              <div className="animate-pulse h-32 bg-white/5 rounded-lg border border-white/10" />
            ) : myAds.length === 0 ? (
              <div className="glass rounded-lg p-12 text-center border-dashed border-white/10">
                <Megaphone
                  className="text-slate-400 mx-auto mb-4 opacity-20"
                  size={32}
                />
                <h3 className="text-[12px] font-medium text-slate-500">
                  No Adds Created Yet
                </h3>
                <p className="text-slate-600 mt-2 text-[12px]">
                  Start your first Ad today.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myAds.map((ad) => (
                  <motion.div
                    key={ad._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass p-0 rounded-lg overflow-hidden border border-white/10 flex flex-col sm:flex-row gap-0 bg-slate-900/40 shadow-xl group"
                  >
                    <div className="w-full sm:w-32 h-32 relative shrink-0 bg-slate-800 flex items-center justify-center">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                          alt=""
                        />
                      ) : (
                        <Megaphone className="text-slate-700" size={32} />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent sm:hidden" />
                    </div>
                    <div className="p-5 md:p-6 space-y-6 flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="max-w-full overflow-hidden">
                          <h3 className="  font-medium text-white text-base truncate">
                            {ad.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[12px]   font-medium text-primary-500 bg-primary-500/5 px-2 py-0.5 rounded border border-primary-500/10">
                              {ad.adType}
                            </span>
                            <span className="w-1 h-1 bg-slate-800 rounded-full" />
                            <span className="text-[12px]   font-medium text-slate-500">
                              {ad.placement.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1.5 rounded-lg text-[12px]   font-medium border shadow-lg shrink-0 ${getStatusColor(ad.status)}`}
                        >
                          {ad.status.replace("_", " ")}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-5 border-t border-white/10">
                        <div className="space-y-1">
                          <p className="text-[12px] text-slate-500 font-medium">
                            Impressions
                          </p>
                          <p className="text-xl   font-medium text-white">
                            {ad.impressions || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[12px] text-slate-500 font-medium">
                            Spent
                          </p>
                          <p className="text-xl   font-medium text-emerald-400">
                            ₹{ad.spent.toFixed(2)}{" "}
                            <span className="text-[12px] text-slate-500 font-medium opacity-50">
                              / ₹{ad.budget}
                            </span>
                          </p>
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-1">
                          <p className="text-[12px] text-slate-500 font-medium">
                            Duration
                          </p>
                          <p className="text-[12px]   font-medium text-slate-400 mt-1.5 whitespace-nowrap">
                            {safeFormatDate(ad.startDate)} — {safeFormatDate(ad.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-white/10">
                        {ad.status === "active" && (
                          <button
                            onClick={() => handlePause(ad._id)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[12px]   font-medium transition-all border border-white/10 active:scale-95"
                          >
                            Pause
                          </button>
                        )}
                        {ad.status === "paused" && (
                          <button
                            onClick={() => handleResume(ad._id)}
                            className="px-5 py-2.5 bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white rounded-lg text-[12px]   font-medium transition-all border border-primary-500/20 active:scale-95 shadow-lg shadow-primary-900/20"
                          >
                            Resume
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="px-5 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[12px]   font-medium transition-all border border-rose-500/20 ml-auto active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-2xl bg-slate-900 md:rounded-lg rounded-t-lg border-t md:border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="space-y-1">
                  <h2 className="text-lg   font-medium text-white">Create New Ad</h2>
                  <p className="text-[12px] text-slate-500">Fill in the details for your campaign</p>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6 pb-6">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-slate-500 ml-1">Campaign Title</label>
                    <input
                      autoFocus
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-700"
                      placeholder="Enter a compelling transmission headline..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Ad Type</label>
                      <select
                        value={formData.adType}
                        onChange={(e) => setFormData({ ...formData, adType: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="feed">Central Feed Signal</option>
                        <option value="banner">Network Banner</option>
                        <option value="card">Operational Card</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Budget (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                        <input
                          type="number"
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px]   font-medium text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-slate-500 ml-1">Ad Image</label>
                    <div className="space-y-4">
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-[12px]   font-medium text-white placeholder:text-slate-700"
                          placeholder="Paste image URL..."
                        />
                      </div>
                      <label className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all text-[12px]   font-medium text-slate-400">
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
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
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Placement</label>
                      <select
                        value={formData.placement}
                        onChange={e => setFormData({ ...formData, placement: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white appearance-none cursor-pointer"
                      >
                        <option value="home_feed">Home Feed Signal</option>
                        <option value="sidebar">Peripheral Sidebar</option>
                        <option value="story">Temporal Story</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-slate-500 ml-1">Link</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                          value={formData.link}
                          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
                        <>
                          <span>Create Ad</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDanger={modal.isDanger}
        confirmText={modal.confirmText}
      />
    </>
  );
};

export default AdsManager;
