import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Send, Loader2, Plus, X } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { NewsCategoryDropdown } from "./post-components/NewsCategoryDropdown";

export const CreatePostWidget = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !file) return;
    setLoading(true);

    try {
      let fileUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        console.log("HELLO")
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
      setIsExpanded(false); 
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
    <div className="glass rounded-lg space-y-0 relative overflow-hidden group border-white/5 shadow-2xl bg-slate-900/40">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/[0.03] blur-3xl -mr-32 -mt-32 transition-colors duration-1000 group-hover:bg-primary-500/10" />
      <div
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`p-5 flex items-center justify-between relative cursor-pointer transition-all duration-300 ${isExpanded ? "border-b border-white/5" : "hover:bg-white/[0.02]"}`}
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
            <h3 className="text-[11px] text-slate-500">
              {isExpanded ? "Broadcasting From" : "Post a Local Update"}
            </h3>
            <div className="flex items-center gap-1 text-white">
              <span className="text-xs">
                {user?.name?.substring(0, 15)}
              </span>
              <span className="text-[9px] mx-4 text-primary-500/60 bg-primary-500/5 px-1.5 py-0.5 rounded border border-primary-500/10">
                S-{user?.location?.substring(0, 3).toUpperCase() || "GEN"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isExpanded ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <X size={14} />
            </button>
          ) : (
            <div className="p-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <Plus size={16} />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-500 ml-1">
                  Write Your Post
                </label>
                <textarea
                  autoFocus
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-4 min-h-[140px] focus:outline-none focus:border-primary-500/50 transition-all resize-none placeholder:text-slate-600 text-sm text-white"
                  placeholder={`What is happening in ${user?.location || "your sector"}?`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NewsCategoryDropdown
                  category={category}
                  setCategory={setCategory}
                />

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-500 ml-1">
                    Image/Video
                  </label>
                  <label className="flex items-center gap-3 w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3.5 cursor-pointer group/file hover:border-primary-500/40 transition-all">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <ImageIcon
                      size={14}
                      className={file ? "text-primary-400" : "text-slate-600"}
                    />
                    <span
                      className={`text-[11px] font-bold truncate ${file ? "text-white" : "text-slate-500"}`}
                    >
                      {file ? file.name : "Attach Data File"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-700 hover:bg-primary-500 text-white font-medium p-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-[12px] border border-white/10"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <span>Share Your Post</span>
                      <Send
                        size={14}
                        className="text-white group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>

              {progress > 0 && progress < 100 && (
                <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
