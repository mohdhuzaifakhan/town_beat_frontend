import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

export const ApprovalBudgetModal = ({ data, onClose }) => {
    const isRejected = data.status === "rejected";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg   font-medium text-gray-800">
                        Approval Budget
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
                    </button>
                </div>

                {/* Status */}
                <div
                    className={`rounded-lg p-4 mb-4 ${isRejected
                            ? "bg-red-50 border border-red-200"
                            : "bg-green-50 border border-green-200"
                        }`}
                >
                    <p
                        className={`font-semibold ${isRejected ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        {isRejected ? "Rejected" : "Approved"}
                    </p>

                    {data.reason && (
                        <p className="mt-1 text-[12px] text-gray-600">
                            {data.reason}
                        </p>
                    )}
                </div>

                {/* Link */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-[12px] text-gray-700">
                        View budget details
                    </span>

                    <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary-600 font-medium hover:underline"
                    >
                        Open
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

                {/* Footer */}
                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-lg bg-gray-100 py-2 font-semibold text-gray-700 hover:bg-gray-200"
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
};
