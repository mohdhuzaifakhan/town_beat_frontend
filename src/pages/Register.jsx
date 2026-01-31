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

  const cities = [
    "Rampur",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      return setError("Please select your city");
    }

    setError("");
    setLoading(true);
    try {
      await register(formData);
      navigate("/login", {
        state: { message: "Verification email sent. Please check your inbox." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid lg:grid-cols-2 rounded-xl overflow-hidden"
      >
        <div className="hidden lg:flex flex-col justify-between p-10 border-r border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Town Beat
              </span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Join your city.
              <br />
              Share your voice.
              <br />
              <span className="text-primary-500">Build community.</span>
            </h2>

            <ul className="space-y-4 mt-8">
              {[
                "Verified local citizens",
                "City-based discussions",
                "Trusted community updates",
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

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Town Beat — built for your city
          </p>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white">Create account</h3>
            <p className="text-sm text-slate-400">
              Join your local community on Town Beat
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="mb-5 flex items-center gap-3 p-3 rounded-lg text-sm border bg-red-500/10 border-red-500/20 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + City (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 ml-1">Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                    className="w-full compact-input !pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 ml-1">City</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="w-full compact-select !pl-9 pr-10 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-950">
                      Select city
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-slate-950">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  required
                  className="w-full compact-input !pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="w-full compact-input !pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:hover:bg-primary-600 text-white px-5 py-2.5 rounded-md font-bold transition-all shadow-lg shadow-primary-900/20 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-400 font-semibold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
