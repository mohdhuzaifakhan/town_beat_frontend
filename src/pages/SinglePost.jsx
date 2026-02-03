import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import api from '../api/client'
import { PostCard } from '../components/PostCard'

const SinglePost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/${id}`)
                if (!res.data) throw new Error('Post not found')
                setPost(res.data)
            } catch (err) {
                console.error(err)
                setError('Failed to load post. It might have been deleted.')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
    )

    if (error || !post) return (
        <div className="max-w-xl mx-auto mt-12 text-center space-y-4 px-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-slate-500" size={32} />
            </div>
            <h2 className="text-xl   font-medium text-white">Content Unavailable</h2>
            <p className="text-slate-400">{error || "This post doesn't exist anymore."}</p>
            <Link to="/" className="inline-flex items-center gap-2 text-primary-400   font-medium hover:text-primary-300 transition-colors mt-4">
                <ArrowLeft size={16} />
                Return to Feed
            </Link>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto pb-24 md:pb-6 no-scrollbar">
            {/* Mobile Header for Single Post */}
            <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-slate-400 active:scale-95 transition-all"
                >
                    <ArrowLeft size={16} />
                    <span className="text-[12px]   font-medium  ">Return to Signal Stream</span>
                </button>
            </div>

            <div className="px-3 md:px-0 mt-6 md:mt-4 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="hidden md:flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-4"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[12px]   font-medium     ">Back to Stream</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <PostCard post={post} onUpdate={() => navigate(0)} />
                </motion.div>
            </div>
        </div>
    )
}

export default SinglePost
