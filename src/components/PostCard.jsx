import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Heart,
  MessageSquare,
  Share2,
  Trash2,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const PostCard = ({ post, onLike, onDelete, isLiked }) => {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(post.comments || [])
  const [loading, setLoading] = useState(false)

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: commentText })
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([...comments, newComment])
        setCommentText('')
      }
    } catch (err) {
      console.error('Failed to comment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-lg border border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-all p-5 space-y-4 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center ring-1 ring-white/10 shrink-0 shadow-lg">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-lg object-cover" />
            ) : (
              <User size={20} className="text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {post.author?.name || 'Anonymous User'}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-primary-400">
                {post.category}
              </span>
              <span className="w-0.5 h-0.5 bg-slate-600 rounded-full" />
              <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock size={12} className="text-amber-500/50" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white/[0.03] p-1.5 rounded-md border border-white/5">
            <MapPin size={12} className="text-rose-500/60 shrink-0" />
            <span className="leading-none">
              {post.location || "Local Sector"}
            </span>
          </div>

          {user?._id === post.author?._id && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md bg-red-500/5 text-red-500/30 hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap text-sm opacity-90">
          {post.body}
        </p>

        {post.image && (
          <div className="rounded-lg overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
            <img src={post.image} alt="Post content" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 border-t border-white/5 pt-4">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 transition-all font-bold text-xs group/btn active:scale-95 ${isLiked ? "text-rose-500" : "text-slate-500 hover:text-rose-400"}`}
        >
          <div className={`p-1.5 rounded-full ${isLiked ? "bg-rose-500/10" : "bg-white/5 group-hover/btn:bg-rose-500/10"} transition-colors`}>
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
          </div>
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 transition-all font-bold text-xs group/btn active:scale-95 ${showComments ? "text-primary-400" : "text-slate-500 hover:text-sky-400"}`}
        >
          <div className={`p-1.5 rounded-full ${showComments ? "bg-primary-500/10" : "bg-white/5 group-hover/btn:bg-sky-500/10"} transition-colors`}>
            <MessageSquare size={16} />
          </div>
          <span>{comments.length}</span>
        </button>

        <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-bold text-xs ml-auto group/btn active:scale-95">
          <div className="p-1.5 rounded-full bg-white/5 group-hover/btn:bg-emerald-500/10 transition-colors">
            <Share2 size={16} />
          </div>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-2">
                Comments <span className="bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{comments.length}</span>
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment, idx) => (
                  <div key={idx} className="flex gap-3 group/comment">
                    <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                      <span className="text-xs font-bold text-slate-400">
                        {comment.user?.name?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">
                          {comment.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleComment} className="flex gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 compact-input text-sm rounded-lg"
                />
                <button
                  type="submit"
                  disabled={loading || !commentText.trim()}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

