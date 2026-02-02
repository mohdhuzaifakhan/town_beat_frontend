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

const AdsManager = () => {
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
      "Terminate Broadcast",
      "Are you sure you want to permanently delete this advertisement? This action cannot be reversed.",
      async () => {
        try {
          await api.delete(`/ads/${id}`);
          fetchMyAds();
        } catch (err) {
          console.error("Failed to delete ad");
        }
      },
      true,
      "Terminate"
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
      showModal("Upload Failed", "We encountered an error while transmitting the asset. Please try again.", () => { }, true);
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
    <div className="space-y-6 max-w-6xl mx-auto px-4 pb-20 mt-4">
      {/* Header matches Groups.jsx */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6">
        <div className="space-y-1 max-w-full overflow-hidden">
          <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
            <Megaphone className="text-primary-500 shrink-0" size={24} />
            <span className="truncate">Manage Your Ads</span>
            <span className="text-[11px] md:text-[12px] text-slate-500 font-medium ml-2 opacity-50 shrink-0">
              Campaign Console
            </span>
          </h1>
          <p className="text-[10px] md:text-[11px] font-medium text-slate-500 md:ml-9">
            Manage your network broadcasts and monetization signals
          </p>
        </div>

        <Link to="/settings" className="glass p-4 rounded-xl flex items-center gap-4 bg-slate-900/40 border-white/5 hover:border-primary-500/30 transition-all w-full md:w-auto">
          <div className="p-2.5 rounded-lg bg-primary-500/10 text-primary-400">
            <IndianRupee size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wallet Balance</p>
            <p className="text-lg font-bold text-white">₹{(user?.walletBalance ?? 0).toFixed(2)}</p>
          </div>
          <div className="ml-auto p-1.5 rounded-md bg-white/5 text-slate-400">
            <Plus size={14} />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 transition-all duration-500">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-xl p-6 space-y-6 sticky top-24 border border-white/5 relative overflow-hidden bg-slate-900/40 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-medium flex items-center gap-3 relative text-primary-400">
                <Plus size={14} />
                New Ad
              </h2>
              <Layout size={14} className="text-slate-700" />
            </div>

            <div className="space-y-4 relative">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500   ml-1">
                  Headline
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                  placeholder="Enter headline..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-slate-500   ml-1">
                    Format
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e) =>
                      setFormData({ ...formData, adType: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="feed">Feed Post</option>
                    <option value="banner">Banner</option>
                    <option value="card">Sidebar Card</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-slate-500   ml-1">
                    Budget (INR)
                  </label>
                  <div className="relative group/input">
                    <IndianRupee
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                      size={12}
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
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-slate-500   ml-1">
                    Launch date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-slate-500   ml-1">
                    End date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500   ml-1">
                  Image/Banner
                </label>
                <div className="flex flex-col gap-2">
                  <div className="relative group/input">
                    <ImageIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                      size={14}
                    />
                    <input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      placeholder="Paste image URL..."
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase">or</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all text-[11px] font-bold text-slate-400">
                    {uploading ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />}
                    {uploading ? "Uploading..." : "Upload Asset"}
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

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Placement
                </label>
                <select
                  value={formData.placement}
                  onChange={e => setFormData({ ...formData, placement: e.target.value })}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] font-bold text-white"
                >
                  <option value="home_feed">Home Feed</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="story">Story</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-slate-500   ml-1">
                  Target URL (Optional)
                </label>
                <div className="relative group/input">
                  <LinkIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    size={14}
                  />
                  <input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[12px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                    placeholder="https://destination.com/..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary-900/40 text-[12px] mt-4 active:scale-95"
            >
              {creating ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                "Authorize Transmission"
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="animate-pulse h-32 bg-white/5 rounded-lg border border-white/5" />
          ) : myAds.length === 0 ? (
            <div className="glass rounded-lg p-12 text-center border-dashed border-white/10">
              <Megaphone
                className="text-slate-400 mx-auto mb-4 opacity-20"
                size={32}
              />
              <h3 className="text-xs font-medium text-slate-500">
                No Adds Created Yet
              </h3>
              <p className="text-slate-600 mt-2 text-xs">
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
                  className="glass p-0 rounded-xl overflow-hidden border border-white/5 flex flex-col sm:flex-row gap-0 bg-slate-900/40 shadow-xl group"
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
                        <h3 className="font-bold text-white text-base truncate   ">
                          {ad.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium text-primary-500 uppercase">
                            {ad.adType}
                          </span>
                          <span className="w-1 h-1 bg-slate-800 rounded-full" />
                          <span className="text-[10px] font-medium text-slate-500 uppercase">
                            {ad.placement.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2.5 py-1 rounded-md text-[12px] border shadow-lg shrink-0 ${getStatusColor(ad.status)}`}
                      >
                        {ad.status.replace("_", " ")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[12px] text-slate-500 font-medium   ">
                          Impressions
                        </p>
                        <p className="text-xl font-medium text-white">
                          {ad.impressions || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-slate-500 font-medium   ">
                          Investment
                        </p>
                        <p className="text-xl font-medium text-emerald-400">
                          ₹{ad.spent.toFixed(2)}{" "}
                          <span className="text-[10px] text-slate-500 font-normal">
                            / ₹{ad.budget}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-[12px] text-slate-500 font-medium   ">
                          Ads Period
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1">
                          {safeFormatDate(ad.startDate)} -{" "}
                          {safeFormatDate(ad.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {ad.status === "active" && (
                        <button
                          onClick={() => handlePause(ad._id)}
                          className="px-4 py-1.5 bg-slate-900/10 hover:bg-slate-700 text-white rounded-lg text-[12px] font-medium transition-all border border-white/10"
                        >
                          Pause
                        </button>
                      )}
                      {ad.status === "paused" && (
                        <button
                          onClick={() => handleResume(ad._id)}
                          className="px-4 py-1.5 bg-primary-600/10 hover:bg-primary-600/30 text-primary-400 rounded-lg text-[12px] font-medium transition-all border border-primary-500/20"
                        >
                          Resume
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg text-[12px] font-medium transition-all border border-rose-500/20 ml-auto"
                      >
                        Terminate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isDanger={modal.isDanger}
        confirmText={modal.confirmText}
      />
    </div>
  );
};

export default AdsManager;
