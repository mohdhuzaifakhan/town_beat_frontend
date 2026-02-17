import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, Shield, MapPin, Loader2, Plus, ArrowLeft } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PostCard } from "../components/PostCard";
import { CreatePostWidget } from "../components/CreatePostWidget";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { motion } from "framer-motion";

const GroupDetail = ({ isCreateModalOpen, setCreateModalOpen }) => {
    const { id } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    useEffect(() => {
        fetchGroupAndPosts();
    }, [id]);

    const fetchGroupAndPosts = async () => {
        try {
            const [groupRes, postsRes] = await Promise.all([
                api.get(`/groups/${id}`),
                api.get(`/posts/group/${id}`),
            ]);

            if (!groupRes.data) {
                setError("Group not found");
                return;
            }
            setGroup(groupRes.data);
            setPosts(postsRes.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load group details.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (memberId) => {
        try {
            await api.patch(`/groups/${id}/admins`, { memberId });
            fetchGroupAndPosts(); // Refresh data
        } catch (err) {
            console.error("Failed to toggle authority", err);
            setShowSecurityModal(true);
        }
    };

    const isMember = group?.members.some(m => m._id === user?._id) || group?.owner?._id === user?._id;
    const isAdmin = group?.owner?._id === user?._id || group?.admins?.includes(user?._id);
    const isOwner = group?.owner?._id === user?._id;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary-500" size={48} />
                <p className="text-slate-400 font-medium font-['Outfit']">Loading community group...</p>
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-rose-500/10 rounded-lg flex items-center justify-center mx-auto border border-rose-500/20">
                    <Shield className="text-rose-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-white">{error || "Access Denied"}</h2>
                <Link to="/groups" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Groups
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar">
            {/* Header Section */}
            <div className="px-3 md:px-4 mt-4">
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-slate-900">
                        {group.image ? (
                            <img src={group.image} className="w-full h-full object-cover" alt={group.name} />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-900/20 to-slate-900 flex items-center justify-center">
                                <Users size={80} className="text-primary-500/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Link to="/groups" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 md:hidden">
                                    <ArrowLeft size={16} />
                                </Link>
                                <h1 className="text-2xl md:text-4xl font-bold font-['Outfit'] text-white drop-shadow-xl">{group.name}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[12px] font-medium font-['Outfit']">
                                <span className="px-2 py-1 rounded-lg bg-primary-600 font-bold text-white shadow-lg shadow-primary-900/40">
                                    {group.type}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                    <MapPin size={12} className="text-primary-500" />
                                    {group.city}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                    <Users size={12} className="text-primary-500" />
                                    {group.membersCount} Members
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <div className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[12px] font-bold font-['Outfit'] flex items-center gap-2">
                                    <Shield size={14} /> Authority Node
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-0 md:px-4">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-4 md:space-y-6">
                    <div className="px-3 md:px-0">
                        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 shadow-xl space-y-4">
                            <h2 className="text-[14px] font-bold font-['Outfit'] text-white uppercase tracking-wider opacity-50">About group</h2>
                            <p className="text-slate-300 font-medium font-['Outfit'] leading-relaxed">
                                {group.description || "The mission of this community group has not yet been documented."}
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="px-3 md:px-0">
                            <CreatePostWidget
                                onPostCreated={fetchGroupAndPosts}
                                groupId={id}
                                placeholder={`Post an official update to ${group.name}...`}
                                isExpanded={isCreateModalOpen}
                                setIsExpanded={setCreateModalOpen}
                            />
                        </div>
                    )}

                    <div className="space-y-4 md:space-y-6 px-3 md:px-0">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-3">
                                Recent Activity
                                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-primary-500/10 text-primary-500 border border-primary-500/10 uppercase tracking-widest font-bold">Encrypted</span>
                            </h3>
                        </div>

                        {posts.length > 0 ? (
                            posts.map((post, idx) => (
                                <PostCard key={post._id || idx} post={post} onUpdate={fetchGroupAndPosts} />
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4 opacity-40">
                                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center mx-auto border border-white/10">
                                    <Plus size={32} className="text-slate-500" />
                                </div>
                                <p className="text-slate-500 font-medium font-['Outfit']">No activity signals detected in this group.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Matches Home feed behavior */}
                <div className="lg:col-span-4 space-y-6 hidden lg:block">
                    <div className="sticky top-20 space-y-6">
                        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 shadow-xl space-y-6">
                            <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-3">
                                Personnel
                                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 uppercase tracking-widest font-bold">Active</span>
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {group.members?.map((member, idx) => (
                                    <div key={member?._id || idx} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/member">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={member?.avatar || 'https://via.placeholder.com/150'} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10" alt="" />
                                            <div className="min-w-0">
                                                <p className="text-[12px] font-bold text-white truncate">{member?.name || 'Unknown Node'}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-slate-500 font-medium">{member?.location || 'Unknown'}</span>
                                                    {group.admins?.includes(member?._id) && (
                                                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase tracking-wider">Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isOwner && member?._id !== user?._id && (
                                            <button
                                                onClick={() => handleToggleAdmin(member._id)}
                                                className={`p-1.5 rounded-lg border transition-all ${group.admins?.includes(member?._id)
                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                                                    : 'bg-primary-500/10 border-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white'}`}
                                                title={group.admins?.includes(member?._id) ? "Revoke Authority" : "Grant Authority"}
                                            >
                                                <Shield size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 shadow-xl space-y-6">
                            <h3 className="text-lg font-bold font-['Outfit'] text-white">Guidelines</h3>
                            <ul className="space-y-4">
                                {[
                                    "Only authorized nodes (admins) can create activity posts.",
                                    "Content must remain relevant to the local group.",
                                    "Security and mutual respect are mandatory.",
                                    "External connections are restricted."
                                ].map((rule, i) => (
                                    <li key={i} className="flex gap-3 text-[12px] text-slate-400 font-medium font-['Outfit']">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-lg bg-primary-500 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showSecurityModal}
                onClose={() => setShowSecurityModal(false)}
                onConfirm={() => setShowSecurityModal(false)}
                title="Security Override Failed"
                message="Only the primary authority node can modify administration rights. Your access level is insufficient for this operation."
                confirmText="Understood"
                isDanger={true}
            />
        </div>
    );
};

export default GroupDetail;
