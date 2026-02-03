import { Search } from "lucide-react";

export function EmptyPostComponent() {
  return (
    <div className="glass rounded-lg p-12 text-center space-y-3 border-dashed border-white/10">
      <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
        <Search className="text-slate-700" size={20} />
      </div>
      <h3 className="text-[12px]   font-medium text-slate-400">No posts found</h3>
      <p className="text-slate-500 text-[12px]">Be the first to post.</p>
    </div>
  );
}
