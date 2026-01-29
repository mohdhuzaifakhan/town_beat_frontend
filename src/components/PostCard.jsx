import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Send,
  Loader2,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Trash2,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post._id}/like`);
      onUpdate(); // Refresh feed
    } catch (err) {
      console.error("Failed to toggle like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/posts/${post._id}/comments`, { text: commentText });
      setCommentText("");
      onUpdate();
    } catch (err) {
      console.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Erase this archive permanently?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onUpdate();
    } catch (err) {
      console.error("Failed to delete post");
    }
  };

  console.log(post);
  const isLiked =
    post?.likes?.some(
      (like) => like === user?._id || like?._id === user?._id,
    ) || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-xl p-5 space-y-4 hover:border-primary-500/30 transition-all relative group border-white/[0.03] shadow-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={post.author?.avatar}
              className="w-10 h-10 rounded-lg border border-white/10 shadow-lg object-cover"
              alt=""
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary-500 rounded-lg border-2 border-slate-950 flex items-center justify-center shadow-lg" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
              {post.author?.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">
                {post.category}
              </span>
              <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} className="text-amber-500/50" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.03] px-1 py-1 rounded-lg border border-white/5">
            <MapPin size={10} className="text-rose-500/50" />
            {post.location + "ii" || "Local Sector"}
          </div>
          {user?._id === post.author?._id && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-red-500/5 text-red-500/30 hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div> */}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
            <MapPin size={12} className="text-rose-500/60 shrink-0" />
            <span className="leading-none">
              {post.location || "Local Sector"}
            </span>
          </div>

          {user?._id === post.author?._id && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-red-500/5 text-red-500/30 hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <p className="text-slate-400 font-bold leading-relaxed whitespace-pre-wrap text-[12px] uppercase tracking-wide opacity-90">
        {post.body}
      </p>

      {post.image && (
        <div className="relative group/img rounded-xl overflow-hidden border border-white/5 bg-slate-900/40">
          <img
            src={post.image}
            className="w-full max-h-[350px] object-cover group-hover/img:scale-110 transition-transform duration-[2000ms] ease-out opacity-80 group-hover/img:opacity-100"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-all font-black text-[9px] uppercase tracking-widest group/btn active:scale-95 ${isLiked ? "text-rose-500" : "text-slate-600 hover:text-rose-400"}`}
        >
          <Heart
            size={14}
            className={
              isLiked ? "fill-rose-500" : "group-hover/btn:fill-rose-500/20"
            }
          />
          {post.likes?.length || 0}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 transition-all font-black text-[9px] uppercase tracking-widest group/btn active:scale-95 ${showComments ? "text-primary-400" : "text-slate-600 hover:text-sky-400"}`}
        >
          <MessageSquare
            size={14}
            className={
              showComments
                ? "fill-primary-500/20"
                : "group-hover/btn:fill-sky-500/20"
            }
          />
          {post.commentsCount || 0}
        </button>
        <button className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-400 transition-all font-black text-[9px] uppercase tracking-widest ml-auto group/btn active:scale-95">
          <Share2 size={14} />
          Sync
        </button>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-4 space-y-4"
        >
          <div className="space-y-3">
            {post.comments?.map((comment, idx) => (
              <div
                key={idx}
                className="flex gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5"
              >
                <img
                  src={comment.user?.avatar}
                  className="w-6 h-6 rounded-lg object-cover"
                  alt=""
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white uppercase">
                      {comment.user?.name}
                    </span>
                    <span className="text-[8px] font-bold text-slate-600 uppercase">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 compact-input text-[10px]"
              placeholder="Add your pulse to this archive..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                "Pulse"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};
