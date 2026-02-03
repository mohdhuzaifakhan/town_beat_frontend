import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, Mail, Calendar, Settings, Edit3, Loader2 } from 'lucide-react'
import api from '../api/client'


export const ProfilePostCard = ({ post, onUpdate }) => {
    const handleDelete = async () => {
        if (!window.confirm('Erase this archive permanently?')) return
        try {
            await api.delete(`/posts/${post._id}`)
            onUpdate()
        } catch (err) {
            console.error('Failed to delete post')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-lg p-4 border border-white/10 space-y-3 relative group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[12px]   font-medium text-primary-400 bg-primary-400/5 px-2 py-0.5 rounded border border-primary-400/10">
                        {post.category}
                    </span>
                    <span className="text-[12px] text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg bg-red-500/5 text-red-500/30 hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10"
                >
                    <Settings size={12} />
                </button>
            </div>

            <p className="text-[12px] text-slate-400 leading-relaxed">
                {post.body}
            </p>

            {post.image && (
                <div className="rounded-lg overflow-hidden border border-white/10 aspect-square max-w-[120px]">
                    <img src={post.image} className="w-full h-full object-cover opacity-80" alt="" />
                </div>
            )}

            <div className="flex items-center gap-4 pt-2 border-t border-white/10 text-[12px]   font-medium text-slate-500">
                <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-primary-500" /> {post.likes?.length || 0} Likes</span>
                <span className="flex items-center gap-1"><Mail size={10} className="text-accent" /> {post.commentsCount || 0} Comments</span>
            </div>
        </motion.div>
    )
}