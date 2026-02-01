import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Users } from "lucide-react";
import { useState } from "react";

export const InviteModal = ({ isOpen, onClose, inviteCode, groupName }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass w-full max-w-sm rounded-lg p-6 space-y-6 border-white/10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                    <Users className="text-primary-500" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium  text-white">Invite Signal</h2>
                                    <p className="text-slate-500 text-[12px] font-bold  ">{groupName}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Share this unique synchronization code with others to link them to this sector.
                            </p>

                            <div className="relative group">
                                <div className="w-full bg-slate-950/50 border border-white/5 rounded-lg py-4 px-4 text-center">
                                    <span className="text-2xl font-medium text-white">
                                        {inviteCode}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all active:scale-95"
                                >
                                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={onClose}
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-primary-900/40 text-sm active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
