import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, Mail, Calendar, Settings, Edit3, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { ProfilePostCard } from '../components/ProfilePostCard'

const Profile = () => {
    const { user } = useAuth()
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({ name: '', location: '' })
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [postsLoading, setPostsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, location: user.location })
            fetchUserPosts()
        }
    }, [user])

    const fetchUserPosts = async () => {
        try {
            const res = await api.get(`/posts/user/${user._id}`)
            setPosts(res.data)
        } catch (err) {
            console.error('Failed to fetch user posts')
        } finally {
            setPostsLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post('/auth/update-profile', formData)
            localStorage.setItem('user', JSON.stringify(res.data))
            window.location.reload()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-primary-400" size={32} />
            <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4">
            <div className="glass rounded-xl overflow-hidden border border-white/5 relative group">
                <div className="h-32 bg-gradient-to-br from-primary-900/40 via-slate-900 to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]" />
                </div>

                <div className="px-6 pb-6 -mt-10 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-xl border-4 border-slate-950 p-0.5 bg-slate-950 shadow-2xl relative group/avatar">
                                <img src={user.avatar} className="w-full h-full rounded-lg object-cover" alt="" />
                                {user.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-primary-500 p-1 rounded-md border-2 border-slate-950 shadow-lg">
                                        <ShieldCheck size={12} className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(!editing)}
                                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/5 transition-all active:scale-95"
                            >
                                <Edit3 size={14} className="text-primary-400" />
                                Edit Account
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl border border-white/5 transition-all">
                                <Settings size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 uppercase">
                                {user.name}
                                <span className="text-slate-600 text-xs font-bold tracking-widest">{user.handle}</span>
                            </h1>
                            <div className="flex flex-wrap gap-4 mt-1.5 text-slate-500 text-xs font-bold">
                                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-primary-400" /> {user.location || 'Unknown Sector'}</div>
                                <div className="flex items-center gap-1.5"><Mail size={12} className="text-accent" /> {user.email}</div>
                                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-400" /> Member since 2026</div>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl opacity-80">
                            {user.role === 'Admin' ? 'Platform administrator ensuring community safety and integrity.' :
                                user.role === 'Journalist' ? 'Verified journalist delivering transparent local coverage.' :
                                    'Active community member contributing to local growth.'}
                        </p>

                        <div className="flex gap-8 pt-2 border-t border-white/5">
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-white">{posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0) + posts.length * 10}</span>
                                <span className="text-xs font-bold text-slate-500">Reach</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-primary-400">{user.credibility || 85}%</span>
                                <span className="text-xs font-bold text-slate-500">Trust</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-accent">{posts.length}</span>
                                <span className="text-xs font-bold text-slate-500">Posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {editing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Settings size={80} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                        <Edit3 size={14} className="text-primary-400" />
                        Account Settings
                    </h2>
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full compact-input"
                                placeholder="Edit Name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">Location</label>
                            <input
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full compact-input"
                                placeholder="Edit Location"
                            />
                        </div>
                        <div className="flex gap-3 col-span-2 pt-2">
                            <button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary-900/20 active:scale-95 transition-all">
                                {loading && <Loader2 className="animate-spin" size={12} />}
                                Save Identity
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-2.5 rounded-xl font-bold text-sm border border-white/5 transition-all active:scale-95">Cancel</button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} className="text-amber-500" />
                        Personal Archive Flow
                    </h3>
                </div>

                {postsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <Loader2 className="animate-spin text-primary-500" size={24} />
                        <p className="text-slate-400 text-sm">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center border-dashed border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.03),transparent)]" />
                        <Edit3 className="text-slate-400 mx-auto mb-4 opacity-20" size={40} />
                        <p className="text-slate-500 text-sm">No posts yet</p>
                    </div>
                ) : (
                    <div className="space-y-4 pb-10">
                        {posts.map(post => (
                            <ProfilePostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
