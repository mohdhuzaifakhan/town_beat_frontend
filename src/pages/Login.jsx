import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const message = location.state?.message

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm glass rounded-xl p-6 space-y-6 border border-white/5 shadow-none"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center justify-center gap-2">
                        <Lock className="text-primary-500" size={20} />
                        Access Node
                    </h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identify yourself to the network</p>
                </div>

                {message && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive ID (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary-500 transition-colors" size={14} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ID@SYSTEM.COM"
                                required
                                className="w-full compact-input pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Access Cipher (Password)</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-accent transition-colors" size={14} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full compact-input pl-10"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 uppercase tracking-widest text-[10px] active:scale-95 border border-white/5"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Initialize Session <ArrowRight size={14} /></>}
                    </button>
                </form>

                <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                    New Citizen? {' '}
                    <Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors">Apply for Access</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
