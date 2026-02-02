import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 rounded-lg overflow-hidden"
      >
        <div className="hidden lg:flex flex-col justify-between p-6 border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium text-white">Town Beat</span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Local voices.
              <br />
              Real stories.
              <br />
              <span className="text-primary-500">One community.</span>
            </h2>

            <ul className="space-y-3 mt-8">
              {[
                "City-based discussions",
                "Hyper-local news & alerts",
                "Community events & updates",
              ].map((text) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-medium text-white">
              Welcome back to TownBeat
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Access your account to create posts, polls & groups
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(message || error) && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className={`mb-4 flex items-center gap-3 p-3 rounded-lg text-sm border ${
                  message
                    ? "bg-primary-500/10 border-primary-500/20 text-primary-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {message || error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="
                    w-full bg-slate-950/50
                    border border-white/10 rounded-lg
                    px-4 py-3 pl-9
                    text-[11px] font-bold text-white
                    placeholder:text-slate-500
                    focus:outline-none focus:border-primary-500/50
                    transition-all
                  "
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full bg-slate-950/50
                    border border-white/10 rounded-lg
                    px-4 py-3 pl-9
                    text-[11px] font-bold text-white
                    placeholder:text-slate-500
                    focus:outline-none focus:border-primary-500/50
                    transition-all
                  "
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-primary-500 hover:text-primary-400"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-3 flex items-center justify-center gap-2
                bg-primary-600 hover:bg-primary-500
                text-white px-5 py-2.5 rounded-md
                font-bold text-[12px]
                transition-all shadow-lg shadow-primary-900/20
                disabled:opacity-60 active:scale-95
              "
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            New here?{" "}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-400 font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
