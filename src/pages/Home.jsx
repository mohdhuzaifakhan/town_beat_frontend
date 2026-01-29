import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, MapPin, Search, PlusSquare, Image as ImageIcon, Send, Loader2, Globe, Filter, Sparkles, ChevronDown, Clock, Heart, MessageSquare, Share2, PieChart, ExternalLink, Target, Trash2 } from 'lucide-react'
import api from '../api/client'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Home = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')
    const [locationScope, setLocationScope] = useState('Local') 
    const { user } = useAuth()

    useEffect(() => {
        fetchPosts()
    }, [category, locationScope])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            let url = `/posts?category=${category}`
            if (locationScope === 'Local') {
                const loc = user?.location || 'Rampur'
                url += `&location=${loc}`
            }
            const res = await api.get(url)
            setPosts(res.data)
        } catch (err) {
            console.error('Failed to fetch posts')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative">
                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-400 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search for local news..."
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all text-xs placeholder:text-slate-400 relative z-10 tracking-widest"
                    />
                </div>

                <div className="flex items-center gap-1 p-1 glass rounded-xl border-white/5">
                    <button
                        onClick={() => setLocationScope('Local')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${locationScope === 'Local' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        <MapPin size={10} />
                        {user?.location || 'Rampur'}
                    </button>
                    <button
                        onClick={() => setLocationScope('Global')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${locationScope === 'Global' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        <Globe size={10} />
                        Global
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    <CreatePostWidget onPostCreated={fetchPosts} />
                    <div className="flex items-center justify-between pb-1 px-1">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                            <Sparkles className="text-primary-400" size={14} />
                            {locationScope === 'Local' ? `${user?.location || 'Rampur'} Signal` : 'Global Signal'}
                        </h2>
                        <div className="flex gap-1 p-1 glass rounded-md border-white/5">
                            {['All', 'Politics', 'Civic', 'Development'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-primary-500/10 text-primary-400' : 'text-slate-600 hover:text-slate-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-3">
                            <Loader2 className="animate-spin text-primary-500" size={24} />
                            <p className="text-slate-600 font-black tracking-widest text-[9px] uppercase">Decrypting Feed...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center space-y-3 border-dashed border-white/10">
                            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Search className="text-slate-700" size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase">No Signal Detected</h3>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Be the first to archive local events.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map(post => <PostCard key={post._id} post={post} onUpdate={fetchPosts} />)}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <PollWidget />
                    <AdWidget />
                    <TrendingGroups />
                </div>
            </div>
        </div>
    )
}

const CreatePostWidget = ({ onPostCreated }) => {
    const { user } = useAuth()
    const [body, setBody] = useState('')
    const [category, setCategory] = useState('General')
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!body.trim() && !file) return
        setLoading(true)

        try {
            let fileUrl = ''
            if (file) {
                const formData = new FormData()
                formData.append('file', file)
                const res = await api.post('/s3/upload', formData, {
                    onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total))
                })
                fileUrl = res.data.url
            }

            await api.post('/posts', { body, category, image: fileUrl, location: user?.location || 'Rampur' })
            setBody('')
            setFile(null)
            setProgress(0)
            onPostCreated()
        } catch (err) {
            console.error('Failed to create post')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return (
        <div className="glass rounded-xl p-6 text-center text-[10px] font-black uppercase tracking-widest border border-white/5">
            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link> to secure your archival feed.
        </div>
    )

    return (
        <div className="glass rounded-xl p-5 space-y-4 relative overflow-hidden group border-white/5 shadow-none">
            <div className="flex items-center gap-3 relative">
                <div className="relative shrink-0">
                    <img src={user?.avatar} className="w-10 h-10 rounded-lg ring-1 ring-white/10 group-hover:ring-primary-500/30 transition-all object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-lg border-2 border-slate-950 shadow-lg" />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider">{user?.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">
                            {user?.role}
                        </span>
                        <div className="flex items-center gap-1 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                            <MapPin size={10} className="text-rose-500/50" />
                            {user?.location || 'Rampur'}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-3.5 min-h-[100px] focus:ring-1 focus:ring-primary-500/20 outline-none transition-all resize-none placeholder:text-slate-400 leading-relaxed text-[12px] tracking-wide"
                    placeholder={`What is happening in your city ${user?.location || 'Rampur'}...`}
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
                            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                            <div className="p-2.5 rounded-md bg-white/5 border border-white/5 group-hover/file:bg-primary-500/10 transition-all">
                                <ImageIcon size={14} className={file ? 'text-primary-400' : 'text-slate-600'} />
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-md font-black transition-all shadow-lg shadow-primary-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 text-[10px] uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin" size={14} /> : (
                            <>
                                <span>Publish</span>
                                <Send size={12} className="opacity-50" />
                            </>
                        )}
                    </button>
                </div>

                {progress > 0 && progress < 100 && (
                    <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </form>
        </div>
    )
}

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth()
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleLike = async () => {
        try {
            await api.post(`/posts/${post._id}/like`)
            onUpdate() // Refresh feed
        } catch (err) {
            console.error('Failed to toggle like')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return
        setSubmitting(true)
        try {
            await api.post(`/posts/${post._id}/comments`, { text: commentText })
            setCommentText('')
            onUpdate()
        } catch (err) {
            console.error('Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Erase this archive permanently?')) return
        try {
            await api.delete(`/posts/${post._id}`)
            onUpdate()
        } catch (err) {
            console.error('Failed to delete post')
        }
    }

    console.log(post)
    const isLiked = post?.likes?.some(like => like === user?._id || like?._id === user?._id) || false

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
                        <img src={post.author?.avatar} className="w-10 h-10 rounded-lg border border-white/10 shadow-lg object-cover" alt="" />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary-500 rounded-lg border-2 border-slate-950 flex items-center justify-center shadow-lg" />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{post.author?.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">{post.category}</span>
                            <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                                <Clock size={10} className="text-amber-500/50" />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                        <MapPin size={10} className="text-rose-500/50" />
                        {post.location || 'Local Sector'}
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

            <p className="text-slate-400 font-bold leading-relaxed whitespace-pre-wrap text-[12px] uppercase tracking-wide opacity-90">{post.body}</p>

            {post.image && (
                <div className="relative group/img rounded-xl overflow-hidden border border-white/5 bg-slate-900/40">
                    <img src={post.image} className="w-full max-h-[350px] object-cover group-hover/img:scale-110 transition-transform duration-[2000ms] ease-out opacity-80 group-hover/img:opacity-100" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-all font-black text-[9px] uppercase tracking-widest group/btn active:scale-95 ${isLiked ? 'text-rose-500' : 'text-slate-600 hover:text-rose-400'}`}
                >
                    <Heart size={14} className={isLiked ? 'fill-rose-500' : 'group-hover/btn:fill-rose-500/20'} />
                    {post.likes?.length || 0}
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-1.5 transition-all font-black text-[9px] uppercase tracking-widest group/btn active:scale-95 ${showComments ? 'text-primary-400' : 'text-slate-600 hover:text-sky-400'}`}
                >
                    <MessageSquare size={14} className={showComments ? 'fill-primary-500/20' : 'group-hover/btn:fill-sky-500/20'} />
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
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-4"
                >
                    <div className="space-y-3">
                        {post.comments?.map((comment, idx) => (
                            <div key={idx} className="flex gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <img src={comment.user?.avatar} className="w-6 h-6 rounded-lg object-cover" alt="" />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-white uppercase">{comment.user?.name}</span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{comment.text}</p>
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
                            {submitting ? <Loader2 size={12} className="animate-spin" /> : 'Pulse'}
                        </button>
                    </form>
                </motion.div>
            )}
        </motion.div>
    )
}

const PollWidget = () => {
    const [polls, setPolls] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPolls = async () => {
        try {
            const res = await api.get('/polls')
            setPolls(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolls()
    }, [])

    if (loading) return <div className="glass rounded-xl p-6 animate-pulse h-32" />
    if (polls.length === 0) return null
    const poll = polls[0]

    return (
        <div className="glass rounded-xl p-5 space-y-4 border-white/5 relative overflow-hidden group shadow-none">
            <div className="flex items-center justify-between relative">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <PieChart size={14} />
                    Active Consensus
                </h3>
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-3 h-3 bg-emerald-500/20 rounded-full animate-ping" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
            </div>
            <p className="font-black text-white text-[11px] uppercase tracking-wide leading-tight relative">{poll.question}</p>
            <div className="space-y-1.5 relative">
                {poll.options.slice(0, 3).map(opt => (
                    <div key={opt._id} className="relative h-8 w-full bg-slate-900/40 rounded-lg overflow-hidden group/opt cursor-pointer border border-white/[0.03]">
                        <div className="absolute inset-0 bg-emerald-500/5 transition-all duration-1000" style={{ width: `${opt.percentage}%` }} />
                        <div className="relative h-full flex items-center justify-between px-3 text-[8px] font-black uppercase tracking-widest">
                            <span className="text-slate-500 group-hover/opt:text-white transition-colors">{opt.text}</span>
                            <span className="text-emerald-500/70">{opt.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/polls" className="block text-center text-[8px] font-black text-slate-600 hover:text-white transition-colors tracking-widest uppercase pt-1 relative">
                Expand Signal →
            </Link>
        </div>
    )
}

const AdWidget = () => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/ads').then(res => {
            setAds(res.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    if (loading || ads.length === 0) return null
    const ad = ads[0]

    return (
        <div className="glass rounded-xl p-5 space-y-4 relative overflow-hidden group shadow-none">
            <div className="flex items-center justify-between relative">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Billboard
                </h3>
            </div>
            <div className="space-y-3 relative">
                <div className="rounded-xl overflow-hidden border border-white/5 aspect-video relative bg-slate-900/40">
                    <img src={ad.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2000ms]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-tight group-hover:text-primary-300 transition-colors">{ad.title}</h4>
                    <p className="text-[9px] text-slate-600 font-bold line-clamp-2 leading-relaxed uppercase tracking-wider">{ad.description}</p>
                </div>
                <a
                    href={ad.link}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl font-black text-[9px] transition-all border border-white/5 active:scale-95 uppercase tracking-widest"
                >
                    Access Gateway
                    <ExternalLink size={12} className="text-indigo-400" />
                </a>
            </div>
        </div>
    )
}

const TrendingGroups = () => {
    const [groups, setGroups] = useState([])
    useEffect(() => {
        api.get('/groups').then(res => setGroups(res.data))
    }, [])

    return (
        <div className="glass rounded-xl p-5 space-y-4 shadow-none border-white/5">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-600">Active Sectors</h3>
            <div className="space-y-3">
                {groups.slice(0, 3).map(group => (
                    <div key={group._id} className="flex items-center gap-3 group cursor-pointer relative">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-primary-400 font-bold text-xs overflow-hidden shadow-sm shadow-black/40">
                            {group.image ? <img src={group.image} className="w-full h-full object-cover" /> : group.name[0]}
                        </div>
                        <div>
                            <h4 className="font-black text-[10px] text-slate-400 group-hover:text-primary-400 transition-colors tracking-tight uppercase">{group.name}</h4>
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest opacity-60">{group.membersCount} Members</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
