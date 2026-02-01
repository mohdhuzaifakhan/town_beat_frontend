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
            <h2 className="text-xl font-bold text-white">Content Unavailable</h2>
            <p className="text-slate-400">{error || "This post doesn't exist anymore."}</p>
            <Link to="/" className="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors mt-4">
                <ArrowLeft size={16} />
                Return to Feed
            </Link>
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto py-6 pb-24 md:pb-6 space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4 px-2"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[11px] font-medium">Back to Signal Stream</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <PostCard post={post} />
            </motion.div>
        </div>
    )
}

export default SinglePost
