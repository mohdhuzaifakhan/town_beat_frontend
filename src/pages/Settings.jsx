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
            setMessage({ type: "success", text: "Credentials rotated successfully." });
            setPasswords({ current: "", new: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to rotate credentials." });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "premium", label: "Premium", icon: Zap },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Signals", icon: Bell },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto px-4 pb-20 mt-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border-b border-white/5 pb-6">
                <div className="space-y-1 max-w-full overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-medium flex items-center justify-center md:justify-start gap-3 max-w-full text-white">
                        <SettingsIcon className="text-primary-500" size={24} />
                        <span className="truncate">Settings</span>
                        <span className="text-[11px] md:text-[12px] text-slate-500 font-medium ml-2 opacity-50 shrink-0">
                            Authorized Access
                        </span>
                    </h1>
                    <p className="text-[10px] md:text-[11px] font-medium  text-slate-500 md:ml-9 truncate">
                        Financial Infrastructure & Security
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex p-1 bg-slate-900/80 rounded-lg border border-white/5 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 mx-0.5 sm:flex-none px-6 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 
                                ${activeTab === tab.id
                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon size={14} />
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
                        className="glass rounded-xl border border-white/5 p-6 md:p-8 bg-slate-900/40 shadow-2xl relative overflow-hidden"
                    >
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary-600/20 to-indigo-700/20 border border-primary-500/20 text-white shadow-xl relative overflow-hidden group">
                                        <div className="relative z-10 space-y-1">
                                            <p className="text-primary-400 text-[12px] font-medium">Available Balance</p>
                                            <h3 className="text-3xl font-medium flex items-center gap-2">
                                                <IndianRupee size={28} className="text-primary-500" />
                                                {(user?.walletBalance ?? 0).toFixed(2)}
                                            </h3>
                                        </div>
                                        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                            <Wallet size={50} />
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl bg-white/2 border border-white/5 flex flex-col justify-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-slate-500 text-[12px] font-medium">Add Cash In Wallet</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="relative flex-1">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                                    <input
                                                        type="number"
                                                        value={topupAmount}
                                                        onChange={(e) => setTopupAmount(Number(e.target.value))}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-primary-500/50"
                                                    />
                                                </div>
                                                <button
                                                    disabled={loading}
                                                    onClick={handleTopup}
                                                    className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-bold text-[11px] hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-50 border border-white/10 shadow-lg shadow-primary-900/40"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Add"}
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
                                            <div className="text-center py-12 border border-dashed border-white/5 rounded-xl">
                                                <p className="text-slate-600 text-[11px] font-bold">No transactions detected.</p>
                                            </div>
                                        ) : (
                                            history.map((tx) => (
                                                <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-lg ${tx.type === 'TOPUP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary-500/10 text-primary-400'}`}>
                                                            {tx.type === 'TOPUP' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-white">{tx.description}</p>
                                                            <p className="text-[10px] text-slate-500">{format(new Date(tx.createdAt), 'MMM d, HH:mm')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-bold ${tx.type === 'TOPUP' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                            {tx.type === 'TOPUP' ? '+' : '-'}₹{tx.amount?.toFixed(2)}
                                                        </p>
                                                        <p className="text-[9px] text-slate-600 font-bold">{tx.status}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "premium" && (
                            <div className="text-center py-8 space-y-8">
                                <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500 mb-4 animate-[pulse_3s_infinite] border border-amber-500/20">
                                    <Zap size={48} fill="currentColor" />
                                </div>
                                <div className="max-w-sm mx-auto space-y-2">
                                    <h3 className="text-xl font-bold text-white italic">Get Premium Access</h3>
                                    <p className="text-slate-500 text-[12px] font-medium">Elevate your operational capacity within the citizen network.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
                                    {[
                                        "Verified Citizen Mark",
                                        "Priority Ad Transmission",
                                        "Lower Operational Fees",
                                        "Early Beta Features Access"
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/2 border border-white/5 text-[12px] font-medium text-slate-400">
                                            <CheckCircle2 size={14} className="text-amber-500" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-center gap-4 pt-6">
                                    <div className="text-3xl font-medium text-white">₹500 <span className="text-[12px] text-slate-400 font-medium">/ month</span></div>
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={loading || user?.isPremium}
                                        className="px-12 py-3 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-500 transition-all active:scale-95 shadow-xl shadow-amber-900/40 disabled:opacity-50 border border-white/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : user?.isPremium ? "ACTIVE STATUS" : "ESTABLISH UPGRADE"}
                                    </button>
                                    {user?.isPremium && user.premiumExpiry && (
                                        <p className="text-[12px] text-slate-400 font-medium">Status Active until {format(new Date(user.premiumExpiry), 'MMMM d, yyyy')}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className="text-[12px] font-medium text-slate-500">Access Credentials</h3>
                                <div className="space-y-4">
                                    <div className="p-6 rounded-xl border border-white/5 bg-white/2 space-y-6 shadow-xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[12px] font-medium text-slate-500">Current Passcode</label>
                                                <input
                                                    type="password"
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[12px] font-medium text-slate-500">New Password</label>
                                                <input
                                                    type="password"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500/50"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={loading}
                                            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-[12px] font-bold transition-all border border-white/10 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
                                        </button>
                                    </div>

                                    <div className="p-6 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-4 shadow-xl">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h4 className="text-[12px] font-bold text-rose-400">Delete Account</h4>
                                                <p className="text-[12px] text-slate-500 mt-1 max-w-sm">Permanently wipe your node from the network. This action cannot be reversed.</p>
                                            </div>
                                            <button className="px-6 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[11px] font-bold transition-all border border-rose-500/20 whitespace-nowrap">Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-[12px] font-medium text-slate-500">Network Signal Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "Email Transmission", desc: "Encoded updates sent to registered address", key: "email" },
                                        { label: "Native Terminal", desc: "Push directives for immediate action", key: "push" },
                                        { label: "Marketing Broadcast", desc: "Promotional signals from the network", key: "marketing" }
                                    ].map((pref) => (
                                        <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-all">
                                            <div className="space-y-1">
                                                <h4 className="text-[12px] font-medium text-white">{pref.label}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium">{pref.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => updateNotification(pref.key, !notifs[pref.key])}
                                                className={`w-10 h-5 rounded-full border transition-all flex items-center px-0.5 cursor-pointer shrink-0
                                                    ${notifs[pref.key]
                                                        ? 'bg-primary-600/20 border-primary-500/30 justify-end'
                                                        : 'bg-slate-800/50 border-white/5 justify-start'}`}
                                            >
                                                <motion.div
                                                    layout
                                                    className={`w-3.5 h-3.5 rounded-full ${notifs[pref.key] ? 'bg-primary-400' : 'bg-slate-600'}`}
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
