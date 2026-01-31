import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Loader2, AlertCircle, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth(); // <-- backend hook
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid lg:grid-cols-2 rounded-xl"
      >
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">Town Beat</span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Forgot password?
              <br />
              <span className="text-primary-500">We’ve got you.</span>
            </h2>

            <p className="text-slate-400 mt-6 text-sm max-w-sm">
              Enter your registered email and we’ll help you get back into your
              city.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Town Beat
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-black text-white mb-1">
            Reset your password
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            We’ll send a reset link to your email
          </p>

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
              <label className="text-xs text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
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
                  Send reset link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary-500 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
