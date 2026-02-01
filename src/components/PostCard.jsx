import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Heart,
  MessageSquare,
  Share2,
  Trash2,
  Clock,
  User,
  Eye,
  X,
  Send,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ConfirmationModal } from "./ConfirmationModal";
import api from "../api/client";
import { CommentSection } from "./post-components/CommentSection";

export const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [viewsCount, setViewsCount] = useState(post.views || 0);
  const [sharesCount, setSharesCount] = useState(post.shares || 0);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const trackView = async () => {
      try {
        await api.post(`/posts/${post._id}/view`);
        setViewsCount((prev) => prev + 1);
      } catch (err) {
        console.error(err);
      }
    };
    trackView();
  }, [post._id]);

  useEffect(() => {
    setIsLiked(post.likes?.includes(user?._id));
    setLikesCount(post.likes?.length || 0);
    setComments(post.comments || []);
    setSharesCount(post.shares || 0);
  }, [post, user?._id]);

  const handleLike = async () => {
    if (!user) return;

    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await api.post(`/posts/${post._id}/like`);
    } catch (err) {
      setIsLiked(previousIsLiked);
      setLikesCount(previousCount);
      console.error("Like failed", err);
    }
  };

  const handleShare = async () => {
    try {
      await api.post(`/posts/${post._id}/share`);
      setSharesCount((prev) => prev + 1);
      setShowShareModal(true);

      navigator.clipboard.writeText(
        `${window.location.origin}/post/${post._id}`,
      );
    } catch (err) {
      console.error("Failed to share");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/posts/${post._id}/comments`, {
        text: commentText,
      });

      if (response.data) {
        const updatedPost = response.data;
        setComments(updatedPost.comments || []);
        setCommentText("");
      }
    } catch (err) {
      console.error("Failed to comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg border border-white/5 bg-slate-900/40 backdrop-blur-md overflow-hidden hover:border-white/10 transition-all shadow-xl"
      >
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group/avatar cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <User size={18} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <span className="text-xs text-white">
                {post.author?.name || "Anonymous User"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="text-primary-400 text-[11px]">
                  {post.category}
                </span>
                <span className="w-0.5 h-0.5 bg-slate-600 rounded-full" />
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock size={10} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="w-0.5 h-0.5 bg-slate-600 rounded-full" />
                <span
                  className="flex items-center gap-1 text-[11px]"
                  title={`${viewsCount} views`}
                >
                  <Eye size={10} />
                  {viewsCount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] text-rose-500/80 bg-white/5 px-2 py-1 rounded-full border border-white/5">
              <MapPin size={10} className="text-rose-500/80" />
              {post.location || "Global"}
            </div>

            {user?._id === post.author?._id && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="px-3 sm:px-4 pb-2 space-y-3">
          <p className="text-slate-300 text-sm whitespace-pre-wrap">
            {post.body}
          </p>

          {post.image && (
            <div className="rounded-lg overflow-hidden border border-white/5 bg-black/50 aspect-video group/image relative">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
            </div>
          )}
        </div>

        <div className="px-3 sm:px-4 py-3 border-t border-white/5 mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 font-medium text-[12px]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium active:scale-95 ${
                isLiked
                  ? "text-rose-500 bg-rose-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Heart size={16} className={isLiked ? "fill-current" : ""} />
              <span className="font-medium text-[12px]">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium active:scale-95 ${
                showComments
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <MessageSquare size={16} />
              <span className="font-medium text-[12px]">{comments.length}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium active:scale-95 text-slate-400 hover:text-slate-200 hover:bg-white/5"
            >
              <Share2 size={16} />
              <span className="font-medium text-[12px]">{sharesCount}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showComments ? <CommentSection comments={comments} commentText={commentText} setCommentText={setCommentText} handleComment={handleComment} isSubmitting={isSubmitting} /> : null}
        </AnimatePresence>
      </motion.div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(post._id)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />

      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => setShowShareModal(false)}
        title="Post Shared!"
        message="The link to this post has been copied to your clipboard."
        confirmText="Great"
        cancelText="Close"
        isDanger={false}
      />
    </>
  );
};
