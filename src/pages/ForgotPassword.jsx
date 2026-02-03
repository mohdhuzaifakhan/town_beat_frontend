import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      navigate("/login", {
        state: { message: "Password reset link sent to your email." },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 overflow-x-hidden p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl md:grid md:grid-cols-2 rounded-lg overflow-hidden relative"
      >
        <div className="hidden md:flex flex-col justify-around p-8 px-2 border-r border-white/5 items-center">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/40 border border-primary-500/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl   font-medium   text-white">
                Town Beat
              </span>
            </div>

            <h2 className="text-4xl   font-medium text-white">
              Forgot <span className="text-primary-500">Access?</span>
              <br />
              Reset <span className="text-primary-500">Securely.</span>
              <br />
              Stay <span className="text-primary-500">Connected.</span>
            </h2>

            <ul className="space-y-2 mt-12">
              {[
                "Secure recovery",
                "Email verification",
                "Fast access restore",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                    <CheckCircle2 className="w-3 h-3 text-primary-500" />
                  </div>
                  <span className="text-[12px] font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center p-8 px-2 sm:p-4 lg:p-16 relative z-10">
          <div className="mb-10 text-center md:text-left">
            <div className="md:hidden flex justify-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-900/50 border border-primary-500/20 relative group">
                <div className="absolute inset-0 bg-primary-400/20 blur-xl group-hover:blur-2xl transition-all" />
                <MapPin className="w-6 h-6 text-white relative z-10" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl   font-medium text-white mb-2">
              Forgot Password
            </h3>
            <p className="text-[12px] text-slate-500">
              Enter your email to reset your password
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(message || error) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mb-8 flex items-center gap-4 p-4 rounded-lg text-[12px] border shadow-xl ${
                  message
                    ? "bg-primary-500/10 border-primary-500/20 text-primary-400"
                    : "bg-red-500/10 border-red-500/20 text-red-500"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    message ? "bg-primary-500/20" : "bg-red-500/20"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>
                {message || error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <Mail className="w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                  <div className="w-px h-4 bg-white/5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-950/80 border border-white/5 rounded-lg px-5 py-3 pl-14 text-[12px] text-white placeholder:text-slate-800 focus:outline-none focus:border-primary-500/40 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-4 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg   font-medium text-[12px] transition-all shadow-2xl shadow-primary-900/40 disabled:opacity-60 active:scale-[0.98] border border-white/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[12px] text-slate-500">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-400 transition-colors border-b border-primary-500/20 pb-0.5 ml-1"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
