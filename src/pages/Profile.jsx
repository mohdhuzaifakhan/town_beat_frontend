import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ShieldCheck,
  Mail,
  Calendar,
  Settings,
  Edit3,
  Loader2,
  Sparkles,
  Target,
  BarChart3,
  Fingerprint,
  AtSign,
  LetterText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { PostCard } from "../components/PostCard";
import { PollCard } from "../components/PollCard";
import { CampaignCard } from "../components/CampaignCard";
import { CityDropdown } from "../components/CityDropdown";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("signals"); // signals, polls, movements
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bio: "",
    handle: "",
  });
  const [loading, setLoading] = useState(false);

  const [activity, setActivity] = useState({
    signals: [],
    polls: [],
    movements: [],
  });
  const [activityLoading, setActivityLoading] = useState(true);

  let formattedDate = "";
  if (user) {
    const date = new Date(user.createdAt || "2026-01-28T18:16:13.260+00:00");
    formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location,
        bio: user.bio || "",
        handle: user.handle || "",
      });
      fetchAllActivity();
    }
  }, [user]);

  const fetchAllActivity = async () => {
    setActivityLoading(true);
    try {
      const [postsRes, pollsRes, campaignsRes] = await Promise.all([
        api.get(`/posts/user/${user._id}`),
        api.get(`/polls/user/${user._id}`),
        api.get(`/campaigns/user/${user._id}`),
      ]);
      setActivity({
        signals: postsRes.data,
        polls: pollsRes.data,
        movements: campaignsRes.data,
      });
    } catch (err) {
      console.error("Nexus synchronization failed:", err);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    // ... existing update logic
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/update-profile", formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      fetchAllActivity();
    } catch (err) {
      console.error("Signal decommissioning failed");
    }
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await api.delete(`/polls/${pollId}`);
      fetchAllActivity();
    } catch (err) {
      console.error("Consensus decommissioning failed");
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await api.delete(`/campaigns/${campaignId}`);
      fetchAllActivity();
    } catch (err) {
      console.error("Movement decommissioning failed");
    }
  };

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary-400" size={32} />
        <p className="text-slate-400 text-[12px] font-medium">
          Synchronizing Identity...
        </p>
      </div>
    );

  const tabs = [
    {
      id: "signals",
      label: "Posts",
      icon: Sparkles,
      count: activity.signals.length,
    },
    {
      id: "polls",
      label: "Polls",
      icon: BarChart3,
      count: activity.polls.length,
    },
    {
      id: "movements",
      label: "Compaigns",
      icon: Target,
      count: activity.movements.length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-20 no-scrollbar px-3 md:px-0">
      <div className="space-y-6 md:space-y-8 mt-4">
        <div className="glass rounded-lg overflow-hidden border border-white/5 relative group bg-slate-900/40 shadow-2xl">
          <div className="h-40 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary-600/20 via-slate-950 to-rose-500/10" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="absolute top-4 right-6 flex flex-col items-end opacity-20">
              <Fingerprint size={60} className="text-white" />
              {/* <span className="text-[12px] font-medium text-white mt-1">Biometric Hash: Verified</span> */}
            </div>
          </div>

          <div className="px-8 pb-8 -mt-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg border-4 border-slate-950 p-1 bg-slate-900 shadow-2xl relative group/avatar overflow-hidden mx-auto md:mx-0">
                  <img
                    src={user.avatar}
                    className="w-full h-full rounded-lg object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary-600 p-1.5 rounded-lg border-2 border-slate-950 shadow-lg">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex-1 md:flex-none min-w-[120px] bg-primary-600/10 hover:bg-primary-500 text-primary-400 hover:text-white px-3 py-2.5 rounded-lg   font-medium text-[9px] md:text-[12px]      flex items-center justify-center gap-2 border border-primary-500/20 transition-all active:scale-95 shadow-lg shadow-primary-900/10"
                >
                  <Edit3 size={11} />
                  Update Profile
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white px-3 py-2.5 rounded-lg border border-white/5 transition-all active:scale-95 shrink-0 flex items-center justify-center">
                  <Settings size={14} />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-medium text-white">
                    {user.name}
                  </h1>
                  <div className="px-2 py-0.5 bg-slate-450/50 border border-rose-400/10 rounded-md flex items-center gap-1.5">
                    <AtSign size={10} className="text-rose-400" />
                    <span className="text-rose-400 text-[12px] font-medium">
                      {user.role || "Citizen"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-slate-500 text-[12px] md:text-[12px] font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-rose-500/60" />{" "}
                    {user.location || "Unmapped Sector"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-primary-500/60" />{" "}
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-amber-500/60" />
                    {formattedDate}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-lg border border-white/5 max-w-2xl relative overflow-hidden group/bio mx-auto md:mx-0">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-600/20 group-hover/bio:bg-primary-500/60 transition-colors" />
                <p className="text-[12px] text-slate-400 opacity-80 italic">
                  {user.bio || "I am a user of town beat"}
                </p>
              </div>

              {/* <div className="flex justify-around md:justify-start gap-6 md:gap-10 pt-4 border-t border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] md:text-[12px] font-medium text-slate-500">
                  Reach
                </span>
                <span className="text-xl md:text-2xl font-medium text-white leading-none">
                  {activity.signals.reduce(
                    (acc, p) => acc + (p.likes?.length || 0),
                    0,
                  ) +
                    activity.signals.length * 12}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] md:text-[12px] font-medium text-slate-500">
                  Credibility
                </span>
                <span className="text-xl md:text-2xl font-medium text-primary-400 leading-none">
                  {user.credibility || 85}%
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] md:text-[12px] font-medium text-slate-500">
                  Authority Role
                </span>
                <span className="text-xl md:text-2xl font-medium text-rose-500 leading-none italic">
                  {user.role}
                </span>
              </div>
            </div> */}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-lg p-5 md:p-8 border border-white/5 relative overflow-hidden bg-slate-900 shadow-xl"
            >
              <h2 className="text-[12px] font-medium text-primary-500 mb-8 flex items-center gap-3">
                <Fingerprint size={16} />
                Identity Configuration
              </h2>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-slate-500 ml-1">
                      Identity Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-slate-500 ml-1">
                      Role
                    </label>
                    <input
                      value={formData.handle}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white focus:outline-none focus:border-primary-500/50 transition-all"
                      placeholder="@handle"
                      readOnly
                    />
                  </div>
                  <CityDropdown
                    value={formData.location}
                    onChange={(city) =>
                      setFormData({ ...formData, location: city })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-slate-500 ml-1">
                    Mission Statement (Bio)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px] text-white focus:outline-none focus:border-primary-500/50 transition-all resize-none min-h-25"
                    placeholder="Add Your Bio..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-medium text-[12px] disabled:opacity-50 shadow-lg shadow-primary-900/40 active:scale-95 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" size={14} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-8 bg-white/5 hover:bg-white/10 text-slate-500 py-3 rounded-lg font-medium text-[12px] border border-white/5 transition-all active:scale-95"
                  >
                    Abort
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-1 overflow-x-auto no-scrollbar scroll-smooth -mx-1">
            <div className="flex gap-6 md:gap-8 min-w-max px-4 md:px-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 relative flex items-center gap-2 group transition-all shrink-0`}
                >
                  <tab.icon
                    size={14}
                    className={
                      activeTab === tab.id
                        ? "text-primary-400"
                        : "text-slate-600 group-hover:text-slate-400"
                    }
                  />
                  <span
                    className={`text-[12px] md:text-[12px] font-medium ${activeTab === tab.id ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`}
                  >
                    {tab.label}
                  </span>
                  <span className="text-[12px] font-medium text-slate-700 bg-slate-950 px-1.5 py-0.5 rounded-md border border-white/5">
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-75 relative">
            <AnimatePresence mode="wait">
              {activityLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center py-20 space-y-4"
                >
                  <Loader2 className="animate-spin text-primary-500" size={24} />
                  <p className="text-slate-500 text-[12px] font-medium">
                    Retrieving Content Stream...
                  </p>
                </motion.div>
              ) : activity[activeTab].length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-lg p-8 md:p-16 text-center border-dashed border-white/10 bg-slate-950/20"
                >
                  <div className="w-16 h-16 bg-slate-900/50 rounded-lg flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <Fingerprint className="text-slate-800" size={32} />
                  </div>
                  <h3 className="text-[12px] font-medium text-slate-500 mb-2">
                    No Activations Recorded
                  </h3>
                  <p className="text-slate-600 text-[12px]   font-medium">
                    This identity nexus has no historical {activeTab} signals.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {activeTab === "signals" &&
                    activity.signals.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onDelete={handleDeletePost}
                      />
                    ))}
                  {activeTab === "polls" &&
                    activity.polls.map((poll) => (
                      <PollCard
                        key={poll._id}
                        poll={poll}
                        user={user}
                        onVote={() => fetchAllActivity()}
                        onDelete={(p) => handleDeletePoll(p._id)}
                      />
                    ))}
                  {activeTab === "movements" &&
                    activity.movements.map((m) => (
                      <CampaignCard
                        key={m._id}
                        campaign={m}
                        onSupported={() => fetchAllActivity()}
                      />
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
