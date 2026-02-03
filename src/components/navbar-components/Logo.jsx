import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export function Logo({ title }) {
  return (
    <div className="flex items-center gap-2 group shrink-0">
      <Link
        to="/"
        className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center shadow-md shadow-primary-900/30 group-hover:scale-110 transition-transform"
      >
        <MapPin className="w-4 h-4 text-white" />
      </Link>
      <span className="text-xl   font-medium text-white hidden sm:block">
        {title || "Town Beat"}
      </span>
    </div>
  );
}
