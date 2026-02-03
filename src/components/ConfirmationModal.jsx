import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full md:max-w-md bg-slate-900 md:rounded-lg rounded-t-lg border-t md:border border-white/10 overflow-hidden shadow-2xl overflow-y-auto no-scrollbar"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {isDanger ? (
                                        <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <AlertTriangle className="text-red-500" size={24} />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                            <AlertTriangle className="text-primary-500" size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-[12px]   font-medium text-white">{title}</h3>
                                        <p className="text-[12px] text-slate-500 mt-0.5">Please confirm your action</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-[12px] text-slate-400 leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 rounded-lg   font-medium text-[12px] text-slate-500 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-[1.5] px-6 py-3 rounded-lg   font-medium text-[12px] text-white transition-all transform active:scale-95 border border-white/10 ${isDanger
                                        ? "bg-red-600 hover:bg-red-500 shadow-2xl shadow-red-900/40"
                                        : "bg-primary-600 hover:bg-primary-500 shadow-2xl shadow-primary-900/40"
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
