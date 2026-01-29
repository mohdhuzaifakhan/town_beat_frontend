import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  MapPin,
  Search,
  PlusSquare,
  Image as ImageIcon,
  Send,
  Loader2,
  Globe,
  Filter,
  Sparkles,
  ChevronDown,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  PieChart,
  ExternalLink,
  Target,
  Trash2,
} from "lucide-react";
import api from "../api/client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { CreatePostWidget } from "../components/CreatePostWidget";
import { PostCard } from "../components/PostCard";
import { PollWidget } from "../components/PollWidget";
import { AdWidget } from "../components/AdWidget";
import { TrendingGroups } from "../components/TrendingGroups";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [locationScope, setLocationScope] = useState("Local");
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [category, locationScope]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `/posts?category=${category}`;
      if (locationScope === "Local") {
        const loc = user?.location || "Rampur";
        url += `&location=${loc}`;
      }
      const res = await api.get(url);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative">
        <div className="relative w-full md:w-[400px] group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-400 transition-colors"
            size={14}
          />
          <input
            type="text"
            placeholder="Search for local news..."
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-all text-xs placeholder:text-slate-400 relative z-10 tracking-widest"
          />
        </div>

        <div className="flex items-center gap-1 p-1 glass rounded-xl border-white/5">
          <button
            onClick={() => setLocationScope("Local")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${locationScope === "Local" ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
          >
            <MapPin size={10} />
            {user?.location || "Rampur"}
          </button>
          <button
            onClick={() => setLocationScope("Global")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${locationScope === "Global" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
          >
            <Globe size={10} />
            Global
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <CreatePostWidget onPostCreated={fetchPosts} />
          <div className="flex items-center justify-between pb-1 px-1">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Sparkles className="text-primary-400" size={14} />
              {locationScope === "Local"
                ? `${user?.location || "Rampur"} Signal`
                : "Global Signal"}
            </h2>
            <div className="flex gap-1 p-1 glass rounded-md border-white/5">
              {["All", "Politics", "Civic", "Development"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${category === cat ? "bg-primary-500/10 text-primary-400" : "text-slate-600 hover:text-slate-300"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="animate-spin text-primary-500" size={24} />
              <p className="text-slate-600 font-black tracking-widest text-[9px] uppercase">
                Decrypting Feed...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center space-y-3 border-dashed border-white/10">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Search className="text-slate-700" size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase">
                No Signal Detected
              </h3>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                Be the first to archive local events.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PollWidget />
          <AdWidget />
          <TrendingGroups />
        </div>
      </div>
    </div>
  );
};

export default Home;
