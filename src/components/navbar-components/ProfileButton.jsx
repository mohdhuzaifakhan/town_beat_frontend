import {
  UserIcon,
  Megaphone,
  PlusSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export function ProfileButton() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // close on outside click
  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showUserMenu]);

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-1.5 rounded-md font-bold transition-all shadow-lg shadow-primary-900/20 active:scale-95 text-sm"
      >
        <UserIcon size={16} />
        <span>sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowUserMenu((v) => !v)}
        className="flex items-center gap-2 pl-3 border-l border-white/10 outline-none"
      >
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all group">
          <img
            src={user.avatar}
            alt=""
            className="w-8 h-8 rounded-lg ring-1 ring-white/20 group-hover:ring-primary-500/50 transition-all object-cover"
          />
          <div className="hidden lg:flex flex-col leading-none text-left">
            <span className="text-xs font-bold text-white">
              {user?.name?.split(" ")[0]}
            </span>
            <span className="text-[12px] text-slate-500 font-medium">
              {user.role}
            </span>
          </div>
        </div>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-bold text-white">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <div className="p-1">
            <Link
              to="/profile"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
            >
              <UserIcon size={16} /> profile
            </Link>

            <Link
              to="/ads/manager"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors font-medium"
            >
              <Megaphone size={16} /> promote
            </Link>

            {user.role === "Admin" && (
              <Link
                to="/admin/ads"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors font-medium"
              >
                <PlusSquare size={16} /> billboard
              </Link>
            )}

            <Link
              to="/settings"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
            >
              <Settings size={16} /> settings
            </Link>
          </div>

          <div className="p-1 border-t border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut size={16} /> sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
