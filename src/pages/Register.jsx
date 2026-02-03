import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CityDropdown } from "../components/CityDropdown";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      return setError("please select your city");
    }

    setError("");
    setLoading(true);
    try {
      await register(formData);
      navigate("/login", {
        state: { message: "verification email sent. check your inbox." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "registration failed");
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
        {/* left panel */}
        <div className="hidden md:flex flex-col justify-around p-8 px-2 border-r border-white/10 items-center">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/40 border border-primary-500/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl   font-medium text-white">town beat</span>
            </div>

            <h2 className="text-4xl   font-medium text-white">
              join your <span className="text-primary-500">city.</span>
              <br />
              share your <span className="text-primary-500">voice.</span>
              <br />
              build <span className="text-primary-500">network.</span>
            </h2>

            <ul className="space-y-2 mt-12">
              {[
                "verified local citizens",
                "city-based signals",
                "trusted updates",
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

        {/* right panel */}
        <div className="w-full flex flex-col justify-center p-8 px-2 sm:p-4 lg:p-16 relative z-10">
          <div className="mb-10 text-center md:text-left">
            <div className="md:hidden flex justify-center mb-3">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-900/50 border border-primary-500/20">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl   font-medium text-white mb-2">
              Register
            </h3>
            <p className="text-[12px] text-slate-500">
              create your town beat account
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 flex items-center gap-4 p-4 rounded-lg text-[12px] border border-red-500/20 bg-red-500/10 text-red-500"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-slate-500 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-5 py-3 pl-14 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <CityDropdown
                  value={formData.location}
                  onChange={(city) =>
                    setFormData({ ...formData, location: city })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@gmail.com"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-5 py-3 pl-14 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-5 py-3 pl-14 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/40 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-4 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg   font-medium text-[12px] transition-all shadow-2xl shadow-primary-900/40 disabled:opacity-60 active:scale-[0.98] border border-white/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[12px] text-slate-500">
              already have an account?
              <Link
                to="/login"
                className="ml-1 text-primary-500 hover:text-primary-400"
              >
                login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
