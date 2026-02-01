import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-lg bg-slate-900 border border-white/10 shadow-2xl"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {isDanger && (
                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                            <AlertTriangle size={24} />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-white">{title}</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-slate-400 mb-6 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`px-4 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 ${isDanger
                                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                                        : "bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/20"
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
