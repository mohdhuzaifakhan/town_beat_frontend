import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Globe, Building, MapPin, X, Check, Search, ShieldAlert, Sparkles, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { ConfirmationModal } from '../components/ConfirmationModal'

const AdminLocations = () => {
    const { user } = useAuth()
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Modal state for Add Region
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newCountry, setNewCountry] = useState('India')
    const [newProvince, setNewProvince] = useState('')
    const [newCitiesRaw, setNewCitiesRaw] = useState('')
    const [addError, setAddError] = useState('')
    const [addLoading, setAddLoading] = useState(false)

    // Inline add city state
    const [addingCityId, setAddingCityId] = useState(null)
    const [newCityName, setNewCityName] = useState('')

    // Confirmation Modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        isDanger: false,
    })

    useEffect(() => {
        fetchLocations()
    }, [])

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations')
            setLocations(res.data)
        } catch (err) {
            console.error('Failed to fetch locations:', err)
        } finally {
            setLoading(false)
        }
    }

    const showConfirm = (title, message, onConfirm, isDanger = false) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            isDanger,
        })
    }

    const handleCreateRegion = async (e) => {
        e.preventDefault()
        if (!newCountry.trim() || !newProvince.trim()) {
            setAddError('Country and Province are required')
            return
        }

        setAddError('')
        setAddLoading(true)

        const citiesList = newCitiesRaw
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0)

        try {
            await api.post('/locations', {
                country: newCountry.trim(),
                province: newProvince.trim(),
                cities: citiesList,
            })
            setIsAddModalOpen(false)
            setNewProvince('')
            setNewCitiesRaw('')
            fetchLocations()
        } catch (err) {
            setAddError(err.response?.data?.message || 'Failed to create region')
        } finally {
            setAddLoading(false)
        }
    }

    const handleToggleActive = async (loc) => {
        try {
            await api.patch(`/locations/${loc._id}`, { isActive: !loc.isActive })
            fetchLocations()
        } catch (err) {
            console.error('Failed to toggle active status:', err)
        }
    }

    const handleAddCityInline = async (id) => {
        if (!newCityName.trim()) return

        try {
            await api.patch(`/locations/${id}`, { addCities: [newCityName.trim()] })
            setAddingCityId(null)
            setNewCityName('')
            fetchLocations()
        } catch (err) {
            console.error('Failed to add city:', err)
        }
    }

    const handleRemoveCity = (loc, city) => {
        showConfirm(
            'Remove City',
            `Are you sure you want to remove "${city}" from ${loc.province}?`,
            async () => {
                try {
                    await api.patch(`/locations/${loc._id}`, { removeCities: [city] })
                    fetchLocations()
                } catch (err) {
                    console.error('Failed to remove city:', err)
                }
            },
            true
        )
    }

    const handleDeleteRegion = (loc) => {
        showConfirm(
            'Delete Region',
            `Are you sure you want to permanently delete "${loc.province}, ${loc.country}"? This will delete all associated cities.`,
            async () => {
                try {
                    await api.delete(`/locations/${loc._id}`)
                    fetchLocations()
                } catch (err) {
                    console.error('Failed to delete region:', err)
                }
            },
            true
        )
    }

    const filteredLocations = locations.filter((loc) => {
        const query = searchQuery.toLowerCase()
        return (
            loc.country.toLowerCase().includes(query) ||
            loc.province.toLowerCase().includes(query) ||
            loc.cities.some((c) => c.toLowerCase().includes(query))
        )
    })

    if (!user || user.role !== 'Admin') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                    <ShieldAlert className="text-red-400" size={24} />
                </div>
                <h2 className="text-[12px] font-medium text-slate-200">Access Denied</h2>
                <p className="text-slate-500 max-w-xs text-center text-[12px] leading-relaxed">
                    Only platform administrators can access location management.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto pb-24 md:pb-20 no-scrollbar px-3 md:px-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/10 pb-6 mt-4">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                        <Sparkles className="text-primary-500 shrink-0" size={24} />
                        <span className="truncate">Location Management</span>
                    </h1>
                    <p className="text-[12px] text-slate-500 md:ml-9 truncate">
                        Configure regional scopes (countries, states/provinces, and cities) for feed and job matches.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-medium text-[12px] transition-all shadow-lg active:scale-95 border border-white/10"
                >
                    <Plus size={16} /> Add Region
                </button>
            </div>

            <div className="my-6">
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search country, state, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-5 py-2.5 pl-12 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : filteredLocations.length === 0 ? (
                <div className="glass rounded-lg p-12 text-center border-dashed border-white/10 shadow-none">
                    <MapPin className="text-slate-900 mx-auto mb-4 opacity-20" size={32} />
                    <h3 className="text-[12px] font-medium text-slate-500">No Locations Found</h3>
                    <p className="text-slate-600 mt-2 text-[12px]">Add regions to configure the hierarchy.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLocations.map((loc) => (
                        <div
                            key={loc._id}
                            className="glass rounded-lg border border-white/10 bg-slate-950/40 p-5 flex flex-col justify-between gap-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                                        <Building className="text-primary-400" size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-[13px] font-medium text-white">{loc.province}</h3>
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Globe size={12} /> {loc.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleActive(loc)}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5
                                            ${loc.isActive
                                                ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                                                : 'bg-white/5 border-white/10 text-slate-500'
                                            }`}
                                    >
                                        {loc.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteRegion(loc)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-white/10 hover:border-rose-500/20 transition-all active:scale-95"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mt-2">
                                <h4 className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                    Cities ({loc.cities.length})
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {loc.cities.map((city) => (
                                        <div
                                            key={city}
                                            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-slate-200"
                                        >
                                            <span>{city}</span>
                                            <button
                                                onClick={() => handleRemoveCity(loc, city)}
                                                className="hover:text-rose-400 text-slate-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {addingCityId === loc._id ? (
                                        <div className="flex items-center gap-1 bg-white/5 border border-primary-500/30 rounded-lg pl-2 pr-1 py-0.5 h-[24px]">
                                            <input
                                                type="text"
                                                placeholder="City name..."
                                                value={newCityName}
                                                onChange={(e) => setNewCityName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddCityInline(loc._id)
                                                    if (e.key === 'Escape') setAddingCityId(null)
                                                }}
                                                className="bg-transparent text-[11px] text-white focus:outline-none w-20"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleAddCityInline(loc._id)}
                                                className="text-primary-500 p-0.5 hover:bg-primary-500/10 rounded"
                                            >
                                                <Check size={12} />
                                            </button>
                                            <button
                                                onClick={() => setAddingCityId(null)}
                                                className="text-slate-500 p-0.5 hover:bg-white/5 rounded"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setAddingCityId(loc._id)
                                                setNewCityName('')
                                            }}
                                            className="flex items-center gap-1 border border-primary-500/20 bg-primary-500/5 text-primary-400 hover:bg-primary-500 hover:text-white transition-all px-2.5 py-1 rounded-lg text-[11px] font-medium"
                                        >
                                            <Plus size={12} /> Add City
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Region Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-lg p-6 shadow-2xl z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[14px] font-medium text-white flex items-center gap-2">
                                    <MapPin className="text-primary-500" size={18} /> Add Region Scope
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1 rounded-full bg-white/5 text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateRegion} className="space-y-4">
                                {addError && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[11px]">
                                        {addError}
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-[11px] font-medium text-slate-500">Country</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCountry}
                                        onChange={(e) => setNewCountry(e.target.value)}
                                        placeholder="e.g. India"
                                        className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-2 text-[12px] text-white focus:outline-none focus:border-primary-500/40"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-medium text-slate-500">Province / State</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProvince}
                                        onChange={(e) => setNewProvince(e.target.value)}
                                        placeholder="e.g. Uttar Pradesh"
                                        className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-2 text-[12px] text-white focus:outline-none focus:border-primary-500/40"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-medium text-slate-500">
                                        Initial Cities (comma separated)
                                    </label>
                                    <textarea
                                        value={newCitiesRaw}
                                        onChange={(e) => setNewCitiesRaw(e.target.value)}
                                        placeholder="e.g. Rampur, Lucknow, Kanpur"
                                        rows={3}
                                        className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-4 py-2 text-[12px] text-white focus:outline-none focus:border-primary-500/40 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={addLoading}
                                    className="w-full mt-4 bg-primary-600 hover:bg-primary-500 text-white py-2.5 rounded-lg font-medium text-[12px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Region'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={confirmModal.isDanger}
                confirmText="Confirm"
            />
        </div>
    )
}

export default AdminLocations
