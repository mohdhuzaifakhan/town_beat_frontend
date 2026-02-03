import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { useState } from "react";

export const InputModal = ({ isOpen, onClose, onConfirm, title, message, placeholder = "Enter reason...", confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    const [inputValue, setInputValue] = useState("");

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
                                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                                        <AlertCircle size={24} />
                                    </div>
                                    <h3 className="text-lg   font-medium text-white">{title}</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-slate-400 mb-4 text-[12px]">
                                {message}
                            </p>

                            <textarea
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-[12px] text-white focus:outline-none focus:border-primary-500/50 transition-all resize-none h-24 mb-6"
                            />

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-[12px]"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    disabled={!inputValue.trim()}
                                    onClick={() => {
                                        onConfirm(inputValue);
                                        setInputValue("");
                                        onClose();
                                    }}
                                    className={`px-4 py-2 rounded-lg   font-medium text-white transition-all transform active:scale-95 text-[12px] disabled:opacity-50 disabled:active:scale-100 ${isDanger
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-primary-600 hover:bg-primary-500"
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
