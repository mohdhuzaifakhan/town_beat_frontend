import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button className="p-2 text-slate-400 hover:text-white transition-colors relative group hidden sm:block">
      <Bell size={20} />
      <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
    </button>
  );
}
