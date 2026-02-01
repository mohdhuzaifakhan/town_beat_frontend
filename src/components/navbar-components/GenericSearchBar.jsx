import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

const GenericSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchTerm.trim();

      if (trimmed) {
        navigate(`/?search=${encodeURIComponent(trimmed)}`);
      } else if (location.pathname === "/" && searchParams.get("search")) {
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, navigate, location.pathname, searchParams]);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    if (query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  return (
    <div className="relative flex-1 max-w-[150px] md:max-w-none md:w-48 lg:w-64">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="
          w-full
          bg-slate-900/50
          border border-white/10
          rounded-lg
          py-1.5
          pl-8 pr-3
          text-xs md:text-sm
          text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-1
          focus:ring-primary-500/20
          transition-all
        "
      />

      <SearchIcon
        size={14}
        className="
          absolute left-2.5 top-1/2 -translate-y-1/2
          text-slate-500
          pointer-events-none
        "
      />
    </div>
  );
};

export default GenericSearchBar;
