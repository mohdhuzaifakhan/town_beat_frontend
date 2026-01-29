import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Users, PieChart, Bell, User as UserIcon, PlusSquare, Megaphone, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const location = useLocation()

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl">
            <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary-800 to-green-500 flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <span className="text-white font-black text-lg">T</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-red-800 to-green-500 bg-clip-text text-transparent hidden sm:block">
                        Town Beat
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/" icon={<Home size={18} />} label="Feed" active={location.pathname === '/'} color="text-sky-400" />
                    <NavLink to="/groups" icon={<Users size={18} />} label="Groups" active={location.pathname === '/groups'} color="text-amber-400" />
                    <NavLink to="/polls" icon={<PieChart size={18} />} label="Polls" active={location.pathname === '/polls'} color="text-emerald-400" />
                    <NavLink to="/campaigns" icon={<Megaphone size={18} />} label="Campaigns" active={location.pathname === '/campaigns'} color="text-rose-400" />
                    {user?.role === 'Admin' && (
                        <NavLink to="/admin/ads" icon={<PlusSquare size={18} />} label="Billboard" active={location.pathname === '/admin/ads'} color="text-indigo-400" />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors relative group">
                        <Bell size={20} />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                                <img src={user.avatar} className="w-6 h-6 rounded-lg ring-1 ring-white/20 group-hover:ring-primary-500/50 transition-all" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">{user.role}</span>
                                </div>
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-1.5 rounded-md font-bold transition-all shadow-lg shadow-primary-900/20 active:scale-95 text-sm">
                            <UserIcon size={16} />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

const NavLink = ({ to, icon, label, active, color }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all font-bold text-sm group ${active ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
    >
        <span className={`${active ? color : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
            {icon}
        </span>
        <span className="tracking-tight">{label}</span>
        {active && (
            <motion.div
                layoutId="nav-active"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full mx-6"
            />
        )}
    </Link>
)

export default Navbar
