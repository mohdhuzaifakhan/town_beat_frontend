import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Zap,
    Bell,
    History,
    Wallet,
    CheckCircle2,
    AlertCircle,
    Loader2,
    IndianRupee,
    ArrowUpRight,
    ArrowDownLeft,
    Settings as SettingsIcon
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState("wallet");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [topupAmount, setTopupAmount] = useState(500);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [notifs, setNotifs] = useState({
        email: true,
        push: true,
        marketing: false
    });
    const [passwords, setPasswords] = useState({ current: "", new: "" });

    useEffect(() => {
        if (user?.settings?.notifications) {
            setNotifs(user.settings.notifications);
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "wallet") {
            fetchHistory();
            fetchBalance();
        }
    }, [activeTab]);

    const fetchBalance = async () => {
        try {
            const res = await api.get("/payments/balance");
            if (res.data) {
                updateUser({ walletBalance: res.data.walletBalance });
            }
        } catch (err) {
            console.error("Failed to fetch balance");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get("/payments/history");
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const handleTopup = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.post("/payments/topup", { amount: topupAmount });
            setMessage({ type: "success", text: `Successfully added ₹${topupAmount} to your wallet.` });
            fetchHistory();
            await fetchBalance();
        } catch (err) {
            setMessage({ type: "error", text: "Failed to process payment." });
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.post("/payments/upgrade");
            setMessage({ type: "success", text: "Welcome to Premium! Your account has been upgraded." });
            await fetchBalance();
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to upgrade." });
        } finally {
            setLoading(false);
        }
    };

    const updateNotification = async (key, value) => {
        const newNotifs = { ...notifs, [key]: value };
        setNotifs(newNotifs);
        try {
            await api.patch("/users/settings", { notifications: newNotifs });
            const userRes = await api.get("/auth/me");
            updateUser(userRes.data);
        } catch (err) {
            console.error("Failed to update notification settings");
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.current || !passwords.new) {
            setMessage({ type: "error", text: "Please fill in all password fields." });
            return;
        }
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.patch("/auth/password", passwords);
            setMessage({ type: "success", text: "Password updated successfully." });
            setPasswords({ current: "", new: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update password." });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "premium", label: "Premium", icon: Zap },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar px-3 md:px-0 mt-0">
            {/* Mobile Unified Header for Settings */}
            <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3 space-y-3 -mx-3">
                <div className="flex items-center justify-between gap-3 px-3">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex-1">
                        <SettingsIcon size={16} className="text-primary-500" />
                        <span className="text-[12px]   font-medium text-white">Account Settings</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex flex-col items-center justify-center min-w-[70px]">
                        <div className="flex items-center gap-1">
                            <Shield size={12} className="text-emerald-500" />
                            <span className="text-[12px]   font-medium text-white truncate max-w-[80px]">Secure</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/10 pb-6 mt-4">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                        <SettingsIcon className="text-primary-500" size={24} />
                        <span className="truncate">Settings</span>
                    </h1>
                    <p className="text-[12px] text-slate-500 md:ml-9 truncate">
                        Manage your wallet, security, and notifications
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex p-1 bg-slate-900/80 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 mx-0.5 sm:flex-none px-5 py-2.5 rounded-lg text-[12px]   font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 
                                ${activeTab === tab.id
                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon size={12} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass rounded-lg border border-white/10 p-6 md:p-8 bg-slate-900/40 shadow-2xl relative overflow-hidden"
                    >
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-[12px] font-medium border
                                ${message.type === "success"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
                            >
                                {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === "wallet" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div className="p-5 md:p-6 rounded-lg bg-gradient-to-br from-primary-600/20 via-slate-900 to-indigo-700/10 border border-primary-500/20 text-white shadow-xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 space-y-1">
                                            <p className="text-primary-400 text-[12px] font-medium">Wallet Balance</p>
                                            <h3 className="text-2xl md:text-3xl   font-medium flex items-center gap-2">
                                                <IndianRupee size={24} className="text-primary-500" />
                                                {(user?.walletBalance ?? 0).toFixed(2)}
                                            </h3>
                                        </div>
                                        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                            <Wallet size={40} />
                                        </div>
                                    </div>

                                    <div className="p-5 md:p-6 rounded-lg bg-white/2 border border-white/10 flex flex-col justify-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-slate-500 text-[12px] font-medium">Top up Wallet</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="relative flex-1">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                                    <input
                                                        type="number"
                                                        value={topupAmount}
                                                        onChange={(e) => setTopupAmount(Number(e.target.value))}
                                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-[12px]   font-medium text-white focus:outline-none focus:border-primary-500/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    disabled={loading}
                                                    onClick={handleTopup}
                                                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg   font-medium text-[12px] hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-50 border border-white/10 shadow-lg shadow-primary-900/40"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={14} /> : "Add Money"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[12px] font-medium text-slate-500 flex items-center gap-2">
                                        <History size={14} className="text-primary-500" />
                                        Transaction History
                                    </h4>
                                    <div className="space-y-2">
                                        {history.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
                                                <p className="text-slate-600 text-[12px] font-medium">No transactions found.</p>
                                            </div>
                                        ) : (
                                            history.map((tx) => (
                                                <div key={tx._id} className="flex items-center justify-between p-4 rounded-lg bg-white/2 border border-white/10 hover:border-white/10 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-lg ${tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>
                                                            {tx.type === 'TOPUP' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] font-medium text-white">{tx.description}</p>
                                                            <p className="text-[12px] text-slate-500">{format(new Date(tx.createdAt), 'MMM d, HH:mm')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-[12px]   font-medium ${tx.type === 'TOPUP' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                            {tx.type === 'TOPUP' ? '+' : '-'}₹{tx.amount?.toFixed(2)}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600   font-medium">{tx.status}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "premium" && (
                            <div className="text-center py-3 md:py-8 space-y-6 md:space-y-8">
                                <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500 mb-2 animate-[pulse_3s_infinite] border border-amber-500/20">
                                    <Zap size={40} fill="currentColor" />
                                </div>
                                <div className="max-w-sm mx-auto space-y-2">
                                    <h3 className="text-lg md:text-xl   font-medium text-white">Upgrade to Premium</h3>
                                    <p className="text-[12px] text-slate-500 font-medium">Get verified and enjoy exclusive features.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
                                    {[
                                        "Verified Badge",
                                        "Faster Response",
                                        "Exclusive Channels",
                                        "Early Features Access"
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/2 border border-white/10 text-[12px]   font-medium text-slate-400">
                                            <CheckCircle2 size={14} className="text-amber-500" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center gap-4 pt-4">
                                    <div className="text-2xl md:text-3xl   font-medium text-white">₹500 <span className="text-[12px] text-slate-500 font-medium">/ Month</span></div>
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={loading || user?.isPremium}
                                        className="w-full md:w-auto px-12 py-3.5 bg-amber-600 text-white rounded-lg   font-medium text-[12px] hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-amber-900/40 disabled:opacity-50 border border-white/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : user?.isPremium ? "Premium Active" : "Upgrade Now"}
                                    </button>
                                    {user?.isPremium && user.premiumExpiry && (
                                        <p className="text-[12px] text-slate-500 font-medium">Status Active until {format(new Date(user.premiumExpiry), 'MMMM d, yyyy')}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className="text-[12px]   font-medium text-slate-500 ml-1">Account Security</h3>
                                <div className="space-y-4">
                                    <div className="p-5 md:p-6 rounded-lg border border-white/10 bg-white/2 space-y-6 shadow-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[12px]   font-medium text-slate-500 ml-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white outline-none focus:border-primary-500/50 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[12px]   font-medium text-slate-500 ml-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[12px]   font-medium text-white outline-none focus:border-primary-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={loading}
                                            className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg text-[12px]   font-medium transition-all border border-white/10 active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
                                        </button>
                                    </div>

                                    <div className="p-5 md:p-6 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-4 shadow-xl">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="max-w-full">
                                                <h4 className="text-[12px]   font-medium text-rose-400">Delete Account</h4>
                                                <p className="text-[12px] text-slate-500 mt-1">Permanently delete your account and all data. This action cannot be undone.</p>
                                            </div>
                                            <button className="w-full md:w-auto px-6 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[12px]   font-medium transition-all border border-rose-500/20 active:scale-95 whitespace-nowrap">Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-[12px]   font-medium text-slate-500 ml-1">Notification Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "Email Notifications", desc: "Get updates in your inbox", key: "email" },
                                        { label: "Push Notifications", desc: "Get notified on your device", key: "push" },
                                        { label: "Marketing Notifications", desc: "Stay updated with our news", key: "marketing" }
                                    ].map((pref) => (
                                        <div key={pref.key} className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/2 hover:border-white/10 transition-all group">
                                            <div className="space-y-1">
                                                <h4 className="text-[12px]   font-medium text-white">{pref.label}</h4>
                                                <p className="text-[12px] text-slate-500 font-medium">{pref.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => updateNotification(pref.key, !notifs[pref.key])}
                                                className={`w-10 h-5 rounded-full border transition-all flex items-center px-1 cursor-pointer shrink-0
                                                    ${notifs[pref.key]
                                                        ? 'bg-primary-600 border-primary-500/50 justify-end shadow-[0_0_10px_rgba(227,67,67,0.2)]'
                                                        : 'bg-slate-800 border-white/10 justify-start'}`}
                                            >
                                                <motion.div
                                                    layout
                                                    className={`w-3 h-3 rounded-full ${notifs[pref.key] ? 'bg-white' : 'bg-slate-600'}`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Settings;
