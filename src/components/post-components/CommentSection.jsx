import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function CommentSection({
  comments,
  commentText,
  setCommentText,
  handleComment,
  isSubmitting,
}) {
  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-black/20 border-t border-white/5"
      >
        <div className="p-3 sm:p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-500   pl-1">
            Comments ({comments.length})
          </h4>

          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No comments yet. Be the first to start the conversation!
              </div>
            ) : (
              comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 group/comment animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                    {comment.user?.avatar ? (
                      <img
                        src={comment.user.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-white">
                        {comment.user?.name?.[0] || "U"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg rounded-tl-none p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleComment} className="flexgap-3 relative">
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a thoughtful comment..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:bg-transparent disabled:text-slate-600 transition-all"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
