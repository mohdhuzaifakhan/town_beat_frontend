import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Loader2, Image as ImageIcon, X } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export const CreateCampaignModal = ({ onClose, onCreated }) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        title: '',
        objective: '',
        category: 'General',
        target: 100,
        daysLeft: 30
    })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let imageUrl = ""
            if (file) {
                const uploadData = new FormData()
                uploadData.append('file', file)
                const uploadRes = await api.post('/s3/upload', uploadData, {
                    onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total))
                })
                imageUrl = uploadRes.data.url
            }

            const payload = {
                ...formData,
                target: Number(formData.target),
                image: imageUrl,
                location: user?.location || 'General Sector',
                endDate: new Date(Date.now() + Number(formData.daysLeft) * 24 * 60 * 60 * 1000)
            }
            await api.post('/campaigns', payload)
            onCreated()
            onClose()
        } catch (err) {
            console.error('Establishment failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-sm rounded-lg p-6 space-y-5 border-white/5 bg-slate-900"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <Megaphone className="text-rose-500" size={16} />
                        </div>
                        <div>
                            <h2 className="text-xs font-medium text-white">Initialize Movement</h2>
                            <p className="text-slate-600 text-[9px] font-medium">Establish community protocol.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Archive Objective</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all"
                            placeholder="MOVEMENT TITLE"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Mission Script</label>
                        <textarea
                            required
                            value={formData.objective}
                            onChange={e => setFormData({ ...formData, objective: e.target.value })}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/50 transition-all resize-none min-h-[80px]"
                            placeholder="WHAT IS THE MISSION?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[12px] font-medium text-slate-500 ml-1">Target Sync</label>
                            <input
                                type="number"
                                required
                                value={formData.target}
                                onChange={e => setFormData({ ...formData, target: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px] font-medium text-slate-500 ml-1">Cycles</label>
                            <input
                                type="number"
                                required
                                value={formData.daysLeft}
                                onChange={e => setFormData({ ...formData, daysLeft: e.target.value })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-slate-500 ml-1">Visual Evidence</label>
                        <label className="flex items-center gap-3 w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer group/file hover:border-primary-500/40 transition-all">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <ImageIcon size={14} className={file ? "text-primary-400" : "text-slate-600"} />
                            <span className={`text-[12px] font-boldtruncate ${file ? "text-white" : "text-slate-500"}`}>
                                {file ? file.name : "Attach Data File"}
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-medium py-3 rounded-lg transition-all border border-white/5 text-[9px]">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/40 text-[9px] border border-white/10">
                            {loading ? <Loader2 className="animate-spin mx-auto" size={12} /> : 'Broadcasting'}
                        </button>
                    </div>

                    {progress > 0 && progress < 100 && (
                        <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    )
}
