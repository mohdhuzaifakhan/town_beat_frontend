import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Send,
  Loader2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const CreatePostWidget = ({ onPostCreated }) => {
  const { user } = useAuth();
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
        const res = await api.post("/s3/upload", formData, {
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
      onPostCreated();
    } catch (err) {
      console.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="glass rounded-xl p-6 text-center text-[10px] font-black uppercase tracking-widest border border-white/5">
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 transition-colors"
        >
          Sign in
        </Link>{" "}
        to secure your archival feed.
      </div>
    );

  return (
    <div className="glass rounded-xl p-5 space-y-4 relative overflow-hidden group border-white/5 shadow-none">
      <div className="flex items-center gap-3 relative">
        <div className="relative shrink-0">
          <img
            src={user?.avatar}
            className="w-10 h-10 rounded-lg ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all object-cover"
            alt=""
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-lg border-2 border-slate-950 shadow-lg" />
        </div>
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-wider">
            {user?.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">
              {user?.role}
            </span>
            <div className="flex items-center gap-1 text-[8px] font-black text-slate-600 uppercase tracking-widest">
              <MapPin size={10} className="text-rose-500/50" />
              {user?.location || "Rampur"}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-3.5 min-h-[100px] focus:ring-1 focus:ring-primary-500/20 outline-none transition-all resize-none placeholder:text-slate-400 leading-relaxed text-[12px] tracking-wide"
          placeholder={`What is happening in your city ${user?.location || "Rampur"}...`}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="compact-select py-1.5 px-3 text-[9px]"
            >
              <option value="General">General</option>
              <option value="Civic">Civic Dept</option>
              <option value="Alert">Urgent Alert</option>
              <option value="News">Archive News</option>
            </select>

            <label className="cursor-pointer group/file">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="p-2.5 rounded-md bg-white/5 border border-white/5 group-hover/file:bg-primary-500/10 transition-all">
                <ImageIcon
                  size={14}
                  className={file ? "text-primary-400" : "text-slate-600"}
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-md font-black transition-all shadow-lg shadow-primary-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 text-[10px] uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <span>Publish</span>
                <Send size={12} className="opacity-50" />
              </>
            )}
          </button>
        </div>

        {progress > 0 && progress < 100 && (
          <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </form>
    </div>
  );
};
