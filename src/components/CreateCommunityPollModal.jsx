import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Loader2, X, Users } from "lucide-react";
import api from "../api/client";
import { PollDurationDropdown } from "./PollDurationDropdown";

export const CreateCommunityPollModal = ({ communityId, communityName, onClose, onCreated }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [durationValue, setDurationValue] = useState(7);
  const [durationUnit, setDurationUnit] = useState("days");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const updateOption = (idx, val) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
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
    setError("");

    const validOptions = options.filter((o) => o.trim());
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a poll question.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/polls", {
        question: question.trim(),
        options: validOptions,
        expiresAt: calculateExpiry().toISOString(),
        communityId,
        isGlobal: false,
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create poll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full md:max-w-md bg-slate-900 md:rounded-xl rounded-t-xl border-t md:border border-white/10 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center border border-primary-500/20">
              <Vote className="text-primary-500" size={18} />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-white">Create Community Poll</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Users size={10} className="text-slate-500" />
                <p className="text-[11px] text-slate-500">{communityName}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5 pb-4">

            {/* Question */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-0.5">
                Poll Question
              </label>
              <textarea
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-4 h-24 resize-none text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-all"
                placeholder="What do you want to ask your community?"
                maxLength={300}
              />
              <p className="text-[10px] text-slate-600 text-right">{question.length}/300</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-0.5">
                Options <span className="text-slate-600 normal-case">(min 2, max 6)</span>
              </label>

              <div className="space-y-2.5">
                {options.map((opt, idx) => (
                  <div key={idx} className="relative group/opt">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary-400">{idx + 1}</span>
                    </div>
                    <input
                      required
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-all"
                      placeholder={`Option ${idx + 1}`}
                      maxLength={100}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-rose-500 transition-colors opacity-0 group-hover/opt:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-2 text-primary-500 text-[12px] font-semibold hover:text-primary-400 transition-colors ml-0.5 mt-1"
                >
                  <span className="w-4 h-4 rounded-md bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-[10px]">+</span>
                  Add Option
                </button>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-0.5">
                Poll Duration
              </label>
              <PollDurationDropdown
                value={durationUnit}
                onChange={setDurationUnit}
                durationValue={durationValue}
                setDurationValue={setDurationValue}
              />
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
              <Users size={14} className="text-primary-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This poll will be visible only to members of <span className="text-primary-400 font-semibold">{communityName}</span>. Only members can vote.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-400 font-medium py-3 rounded-xl transition-all border border-white/10 text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-primary-900/40 text-[13px] border border-white/10 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Vote size={14} />
                    Create Poll
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
