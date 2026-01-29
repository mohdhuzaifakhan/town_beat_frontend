import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Loader2,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const cities = [
    'Rampur',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
    'Surat',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Kanpur',
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.location) {
      return setError('Please select your location')
    }
    setError('')
    setLoading(true)
    try {
      await register(formData)
      navigate('/login', {
        state: { message: 'Verification email sent! Please check your inbox.' },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass rounded-xl p-6 md:p-8 space-y-8 border border-white/5 shadow-none"
      >
        <div className="text-center space-y-2">
          <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center justify-center gap-3">
            <User className="text-primary-500" size={24} />
            Citizen Registry
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Initialize your digital profile on the network
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">
                Full Identity
              </label>
              <div className="relative group">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary-500 pointer-events-none transition-colors"
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="LEGAL NAME"
                  required
                  className="w-full compact-input !pl-8"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">
                City
              </label>
              <div className="relative group">
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-accent pointer-events-none transition-colors"
                />
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none opacity-70"
                />

                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="w-full compact-select !pl-8 pr-10 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-950">
                    SELECT ZONE
                  </option>
                  {cities.map((city) => (
                    <option
                      key={city}
                      value={city}
                      className="bg-slate-950 uppercase"
                    >
                      {city.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5 col-span-full">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">
                Communication Channel (Email)
              </label>
              <div className="relative group">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary-500 pointer-events-none transition-colors"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ID@SYSTEM.COM"
                  required
                  className="w-full compact-input !pl-8"
                />
              </div>
            </div>

            <div className="space-y-1.5 col-span-full">
              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">
                Access Cipher (Password)
              </label>
              <div className="relative group">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-accent pointer-events-none transition-colors"
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="SECURE CIPHER"
                  required
                  className="w-full compact-input !pl-8"
                />
              </div>
            </div>
          </div>

          <div className="glass bg-white/5 p-4 rounded-xl flex items-start gap-4 border border-white/5">
            <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
              Identity verification is required for network access. We prioritize
              authentic human connections.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-900/40 active:scale-95 uppercase tracking-widest text-[10px] border border-white/5"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                Finalize Registry <ArrowRight size={14} className="opacity-60" />
              </>
            )}
          </button>
        </form>
        <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
          Existing Record?{' '}
          <Link
            to="/login"
            className="text-primary-500 hover:text-primary-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
