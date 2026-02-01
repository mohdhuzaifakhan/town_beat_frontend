import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, ArrowRight, Loader2, AlertCircle, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams(); // /reset-password/:token
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword(token, password);
      navigate("/login", {
        state: { message: "Password updated successfully. Please login." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid lg:grid-cols-2 rounded-lg"
      >
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium text-white">Town Beat</span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Set new password
              <br />
              <span className="text-primary-500">Stay secure.</span>
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Town Beat
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-medium text-white mb-6">
            Create new password
          </h3>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="mb-4 flex items-center gap-3 p-3 rounded-lg text-sm border bg-red-500/10 border-red-500/20 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 ml-1">New password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full compact-input !pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 ml-1">
                Confirm password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full compact-input !pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-md font-bold shadow-lg shadow-primary-900/20 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Update password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Back to{" "}
            <Link to="/login" className="text-primary-500 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
