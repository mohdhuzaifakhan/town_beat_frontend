import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Loader2 } from "lucide-react";
import api from "../api/client";
import { PollDurationDropdown } from "./PollDurationDropdown.";

export const CreatePollModal = ({ onClose, onCreated }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [durationValue, setDurationValue] = useState(7);
  const [durationUnit, setDurationUnit] = useState("days");
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, ""]);

  const updateOption = (idx, val) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const calculateExpiry = () => {
    const date = new Date();
    const val = parseInt(durationValue) || 1;

    switch (durationUnit) {
      case "minutes":
        date.setMinutes(date.getMinutes() + val);
        break;
      case "hours":
        date.setHours(date.getHours() + val);
        break;
      case "days":
        date.setDate(date.getDate() + val);
        break;
      case "months":
        date.setMonth(date.getMonth() + val);
        break;
      case "years":
        date.setFullYear(date.getFullYear() + val);
        break;
      default:
        date.setDate(date.getDate() + 7);
    }
    return date;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/polls", {
        question,
        options: options.filter((o) => o.trim()),
        expiresAt: calculateExpiry().toISOString(),
      });
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-sm rounded-lg p-6 border-white/5 max-h-[90vh] flex flex-col"
      >
        {/* Header (fixed) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <Vote className="text-primary-500" size={16} />
          </div>
          <div>
            <h2 className="text-xs font-medium text-white">Create Poll</h2>
            <p className="text-slate-600 text-[11px] font-medium">
              Ask a question. Let your region decide.
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 overflow-y-auto pr-1 mt-5 custom-scrollbar"
        >
          {/* Question */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              What do you want to ask?
            </label>
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-4 h-24 resize-none text-[11px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all font-bold"
              placeholder="Type a clear question for your community"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-[12px] font-medium text-slate-500 ml-1">
              Poll Options
            </label>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  required
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-[11px] font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all"
                  placeholder={`Option ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addOption}
              className="text-primary-500 text-[12px] font-medium hover:text-primary-400 transition-colors ml-1"
            >
              + Add another option
            </button>
          </div>

          <PollDurationDropdown
            value={durationUnit}
            onChange={setDurationUnit}
            durationValue={durationValue}
            setDurationValue={setDurationValue}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 font-bold py-3 rounded-lg transition-all border border-white/5 text-[11px]"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary-900/40 text-[11px] border border-white/10"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={12} />
              ) : (
                "Publish Poll"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
