import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Send, Loader2, Plus, X } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { NewsCategoryDropdown } from "./post-components/NewsCategoryDropdown";

export const CreatePostWidget = ({ onPostCreated, isExpanded: propExpanded, setIsExpanded: propSetExpanded }) => {
  const { user } = useAuth();
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  // Use prop if provided, otherwise use internal state
  const isExpanded = propExpanded !== undefined ? propExpanded : internalExpanded;
  const setIsExpanded = (val) => {
    if (propSetExpanded) propSetExpanded(val);
    else setInternalExpanded(val);
  };

  const closeModal = () => setIsExpanded(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !file) return;
    setLoading(true);

    try {
      let fileUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/files/upload", formData, {
          onUploadProgress: (p) =>
            setProgress(Math.round((p.loaded * 100) / p.total)),
        });
        fileUrl = res.data.url;
      }

      await api.post("/posts", {
        body,
        category,
        image: fileUrl,
        location: user?.location || "Rampur",
      });
      setBody("");
      setFile(null);
      setProgress(0);
      closeModal();
      onPostCreated();
    } catch (err) {
      console.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="glass rounded-lg p-6 text-center text-[13px] border border-white/5">
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
        >
          Sign in
        </Link>{" "}
        to post to your feed.
      </div>
    );

  return (
    <>
      <div className="glass rounded-lg space-y-0 relative overflow-hidden group border-white/5 shadow-2xl bg-slate-900/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/[0.03] blur-3xl -mr-32 -mt-32 transition-colors duration-1000 group-hover:bg-primary-500/10" />

        {/* Trigger Header */}
        <div
          onClick={() => setIsExpanded(true)}
          className={`p-5 flex items-center justify-between relative cursor-pointer transition-all duration-300 ${isExpanded ? "md:border-b md:border-white/5" : "hover:bg-white/[0.02]"}`}
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={user?.avatar}
                className="w-10 h-10 rounded-lg ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all object-cover"
                alt=""
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-lg border-[3px] border-slate-950 shadow-xl" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[12px]   font-medium text-slate-500">
                New Post
              </h3>
              <div className="flex items-center gap-2 text-white">
                <span className="text-[12px]   font-medium">
                  {user?.name?.substring(0, 15)}
                </span>
                <span className="text-[9px]   font-medium text-primary-500/60 bg-primary-500/5 px-2 py-0.5 rounded-lg border border-primary-500/10  ">
                  {user?.location?.substring(0, 3).toUpperCase() || "GEN"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Plus size={18} />
          </div>
        </div>

        {/* Desktop Accordion Content */}
        <div className="hidden md:block">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-slate-500 ml-1">
                      Post Content
                    </label>
                    <textarea
                      autoFocus
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-5 min-h-[140px] focus:outline-none focus:border-primary-500/40 transition-all resize-none placeholder:text-slate-800 text-[12px] text-white shadow-inner"
                      placeholder={`What's happening in ${user?.location || "your city"}...`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <NewsCategoryDropdown
                      category={category}
                      setCategory={setCategory}
                    />

                    <div className="space-y-2">
                      <label className="text-[12px] font-semibold text-slate-500 ml-1">
                        Add Image
                      </label>
                      <label className="flex items-center gap-3 w-full bg-slate-950/50 border border-white/5 rounded-lg px-5 py-3 cursor-pointer group/file hover:border-primary-500/40 transition-all shadow-inner">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <ImageIcon
                          size={16}
                          className={file ? "text-primary-400" : "text-slate-700"}
                        />
                        <span
                          className={`text-[12px]   font-medium truncate ${file ? "text-white" : "text-slate-700"}`}
                        >
                          {file ? file.name : "Upload image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500   font-medium py-3 rounded-lg transition-all border border-white/5 text-[12px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-primary-600 hover:bg-primary-500 text-white   font-medium py-3 rounded-lg transition-all shadow-xl shadow-primary-900/40 disabled:opacity-50 flex items-center justify-center gap-3 text-[12px] border border-white/10"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          Post
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </div>

                  {progress > 0 && progress < 100 && (
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner mt-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      />
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      <div className="md:hidden">
        <AnimatePresence>
          {isExpanded && (
            <div className="fixed inset-0 z-[1000] flex items-end justify-center px-0">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full bg-slate-900 rounded-lg border-t border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[95vh] safe-bottom"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center border border-primary-500/20">
                      <Plus className="text-primary-500" size={20} />
                    </div>
                    <div>
                      <h2 className="text-[12px] font-medium text-white">
                        New Post
                      </h2>
                      <p className="text-[12px] text-slate-500">
                        Share with your city
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[12px]   font-medium text-slate-500 ml-1     ">
                        Post Content
                      </label>
                      <textarea
                        autoFocus
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-5 min-h-[160px] focus:outline-none focus:border-primary-500 transition-all resize-none placeholder:text-slate-800 text-[12px] text-white shadow-inner"
                        placeholder={`What's happening in ${user?.location || "your city"}...`}
                      />
                    </div>

                    <div className="space-y-6">
                      <NewsCategoryDropdown
                        category={category}
                        setCategory={setCategory}
                      />

                      <div className="space-y-2">
                        <label className="text-[12px]   font-medium text-slate-500 ml-1     ">
                          Add Image
                        </label>
                        <label className="flex items-center gap-4 w-full bg-slate-950/50 border border-white/10 rounded-lg px-5 py-3 cursor-pointer group/file shadow-inner active:bg-white/5 transition-all">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                          <div className={`p-2.5 rounded-lg ${file ? "bg-primary-500/20 text-primary-400" : "bg-slate-900 text-slate-600"}`}>
                            <ImageIcon size={20} />
                          </div>
                          <span
                            className={`text-[12px]   font-medium truncate ${file ? "text-white" : "text-slate-700"}`}
                          >
                            {file ? file.name : "Upload operational image"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-600 hover:bg-primary-500 text-white   font-medium py-5 rounded-lg transition-all shadow-2xl shadow-primary-900/40 disabled:opacity-50 flex items-center justify-center gap-4 text-[13px]      border border-white/10 mt-4 active:scale-[0.98]"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Post Update
                          <Send size={16} />
                        </>
                      )}
                    </button>

                    {progress > 0 && progress < 100 && (
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner mt-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-primary-600"
                        />
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
