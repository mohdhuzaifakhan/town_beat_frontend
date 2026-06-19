import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, Shield, MapPin, Loader2, Plus, ArrowLeft, Vote, UserX, ChevronRight } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { PostCard } from "../components/PostCard";
import { CreatePostWidget } from "../components/CreatePostWidget";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { PollCard } from "../components/PollCard";
import { CreateCommunityPollModal } from "../components/CreateCommunityPollModal";
import { motion } from "framer-motion";

const GroupDetail = ({ isCreateModalOpen, setCreateModalOpen }) => {
    const { id } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("posts");
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showCreatePollModal, setShowCreatePollModal] = useState(false);
    const [removingMember, setRemovingMember] = useState(null); // { id, name }
    const [removeLoading, setRemoveLoading] = useState(false);
    const [pollToDelete, setPollToDelete] = useState(null);
    const [securityModalMsg, setSecurityModalMsg] = useState(
        "Only the primary authority node can modify administration rights."
    );

    useEffect(() => {
        fetchGroupAndPosts();
    }, [id]);

    const fetchGroupAndPosts = async () => {
        try {
            const [groupRes, postsRes] = await Promise.all([
                api.get(`/groups/${id}`),
                api.get(`/posts/community/${id}`),
            ]);

            if (!groupRes.data) {
                setError("Group not found");
                return;
            }
            setGroup(groupRes.data);
            setPosts(postsRes.data);

            // Fetch community polls
            try {
                const pollsRes = await api.get(`/polls/community/${id}`);
                setPolls(pollsRes.data || []);
            } catch {
                setPolls([]);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("You must join this group to view its content.");
            } else {
                setError("Failed to load group details.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (memberId) => {
        try {
            await api.patch(`/groups/${id}/admins`, { memberId });
            fetchGroupAndPosts();
        } catch (err) {
            console.error("Failed to toggle authority", err);
            setSecurityModalMsg(
                err.response?.data?.message ||
                "Only the primary authority node can modify administration rights. Your access level is insufficient for this operation."
            );
            setShowSecurityModal(true);
        }
    };

    const handleRemoveMember = async () => {
        if (!removingMember) return;
        setRemoveLoading(true);
        try {
            await api.delete(`/groups/${id}/members/${removingMember.id}`);
            setRemovingMember(null);
            fetchGroupAndPosts();
        } catch (err) {
            console.error("Failed to remove member", err);
            setSecurityModalMsg(
                err.response?.data?.message ||
                "Failed to remove member from the group."
            );
            setRemovingMember(null);
            setShowSecurityModal(true);
        } finally {
            setRemoveLoading(false);
        }
    };

    const handleVotePoll = async (optionId) => {
        try {
            await api.post(`/polls/vote/${optionId}`);
            fetchGroupAndPosts();
        } catch (err) {
            console.error("Vote failed", err);
            setSecurityModalMsg(err.response?.data?.message || "Failed to cast vote.");
            setShowSecurityModal(true);
        }
    };

    const handleDeletePoll = async () => {
        if (!pollToDelete) return;
        try {
            await api.delete(`/polls/${pollToDelete._id}`);
            setPollToDelete(null);
            fetchGroupAndPosts();
        } catch (err) {
            console.error("Delete poll failed", err);
        }
    };

    // Fix: compare as strings to handle both ObjectId and plain string cases
    const userId = user?._id;
    const isMember =
        group?.members?.some((m) => (m._id || m).toString() === userId) ||
        group?.owner?._id?.toString() === userId ||
        group?.owner?.toString() === userId;

    const isAdmin =
        group?.owner?._id?.toString() === userId ||
        group?.owner?.toString() === userId ||
        group?.admins?.some((a) => a.toString() === userId || a._id?.toString() === userId);

    const isOwner =
        group?.owner?._id?.toString() === userId ||
        group?.owner?.toString() === userId;

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
                {(error?.includes("join") || error?.includes("member")) && (
                    <p className="text-slate-400 text-sm">Join this group first to view its content.</p>
                )}
                <Link to="/groups" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Groups
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: "posts", label: "Posts", count: posts.length },
        { id: "polls", label: "Polls", count: polls.length },
    ];

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

                    {/* Post widget — visible to all members */}
                    {isMember && activeTab === "posts" && (
                        <div className="px-3 md:px-0">
                            <CreatePostWidget
                                onPostCreated={fetchGroupAndPosts}
                                groupId={id}
                                placeholder={`Share something with ${group.name}...`}
                                isExpanded={isCreateModalOpen}
                                setIsExpanded={setCreateModalOpen}
                            />
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="px-3 md:px-0">
                        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-white/10 shadow-inner w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[12px] font-medium transition-all ${
                                        activeTab === tab.id
                                            ? "bg-primary-600 text-white shadow-lg shadow-primary-900/40"
                                            : "text-slate-500 hover:text-white"
                                    }`}
                                >
                                    {tab.id === "polls" ? <Vote size={12} /> : null}
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                                            activeTab === tab.id
                                                ? "bg-white/20 text-white"
                                                : "bg-white/5 text-slate-500"
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Posts Tab */}
                    {activeTab === "posts" && (
                        <div className="space-y-4 md:space-y-6 px-3 md:px-0">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-3">
                                    Recent Activity
                                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-primary-500/10 text-primary-500 border border-primary-500/10 uppercase tracking-widest font-bold">Live</span>
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
                                    <p className="text-slate-500 font-medium font-['Outfit']">No posts yet. Be the first to share something!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Polls Tab */}
                    {activeTab === "polls" && (
                        <div className="space-y-4 md:space-y-6 px-3 md:px-0">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-3">
                                    Community Polls
                                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 uppercase tracking-widest font-bold">Active</span>
                                </h3>
                                {isMember && (
                                    <button
                                        onClick={() => setShowCreatePollModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-[12px] font-medium transition-all shadow-lg shadow-primary-900/30 border border-white/10 active:scale-95"
                                    >
                                        <Vote size={13} />
                                        Create Poll
                                    </button>
                                )}
                            </div>

                            {polls.length > 0 ? (
                                polls.map((poll, idx) => (
                                    <PollCard
                                        key={poll._id || idx}
                                        poll={poll}
                                        user={user}
                                        onVote={handleVotePoll}
                                        onDelete={setPollToDelete}
                                    />
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4 opacity-40">
                                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center mx-auto border border-white/10">
                                        <Vote size={32} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-500 font-medium font-['Outfit']">No polls yet. Create one to get the community's opinion!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6 hidden lg:block">
                    <div className="sticky top-20 space-y-6">
                        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 shadow-xl space-y-6">
                            <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-3">
                                Members
                                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 uppercase tracking-widest font-bold">Active</span>
                            </h3>
                            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                                {group.members?.map((member, idx) => {
                                    const memberId = member?._id?.toString();
                                    const memberIsAdmin = group.admins?.some(
                                        (a) => a.toString() === memberId || a._id?.toString() === memberId
                                    );
                                    const memberIsOwner = group.owner?._id?.toString() === memberId || group.owner?.toString() === memberId;

                                    return (
                                        <motion.div
                                            key={memberId || idx}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/member"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={member?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member?.name || 'U')}
                                                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                                                        alt=""
                                                    />
                                                    {memberIsOwner && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-amber-500 border-2 border-slate-900 flex items-center justify-center">
                                                            <Shield size={8} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-bold text-white truncate">
                                                        {member?.name || 'Unknown'}
                                                        {memberIsOwner && <span className="ml-1 text-amber-500 text-[10px]">(Owner)</span>}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="text-[10px] text-slate-500 font-medium">{member?.location || 'Unknown'}</span>
                                                        {memberIsAdmin && !memberIsOwner && (
                                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase tracking-wider">Admin</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Owner/Admin controls */}
                                            {isOwner && memberId !== userId && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover/member:opacity-100 transition-opacity">
                                                    {/* Toggle Admin */}
                                                    <button
                                                        onClick={() => handleToggleAdmin(memberId)}
                                                        className={`p-1.5 rounded-lg border transition-all ${
                                                            memberIsAdmin
                                                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white'
                                                                : 'bg-primary-500/10 border-primary-500/20 text-primary-500 hover:bg-primary-500 hover:text-white'
                                                        }`}
                                                        title={memberIsAdmin ? "Revoke Admin" : "Make Admin"}
                                                    >
                                                        <Shield size={11} />
                                                    </button>
                                                    {/* Remove Member */}
                                                    <button
                                                        onClick={() => setRemovingMember({ id: memberId, name: member?.name || 'this member' })}
                                                        className="p-1.5 rounded-lg border bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                        title="Remove from group"
                                                    >
                                                        <UserX size={11} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Admin (non-owner) can remove non-admin members */}
                                            {isAdmin && !isOwner && memberId !== userId && !memberIsOwner && !memberIsAdmin && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover/member:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setRemovingMember({ id: memberId, name: member?.name || 'this member' })}
                                                        className="p-1.5 rounded-lg border bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                        title="Remove from group"
                                                    >
                                                        <UserX size={11} />
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-6 shadow-xl space-y-6">
                            <h3 className="text-lg font-bold font-['Outfit'] text-white">Guidelines</h3>
                            <ul className="space-y-4">
                                {[
                                    "All members can post and create polls.",
                                    "Content must remain relevant to the local group.",
                                    "Respect and mutual courtesy are mandatory.",
                                    "Admins can manage membership and content."
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

            {/* Remove Member Confirmation */}
            <ConfirmationModal
                isOpen={!!removingMember}
                onClose={() => setRemovingMember(null)}
                onConfirm={handleRemoveMember}
                title="Remove Member"
                message={`Are you sure you want to remove ${removingMember?.name} from ${group.name}? They will need to rejoin to access the group again.`}
                confirmText={removeLoading ? "Removing..." : "Remove"}
                isDanger={true}
            />

            {/* Security / Error Modal */}
            <ConfirmationModal
                isOpen={showSecurityModal}
                onClose={() => setShowSecurityModal(false)}
                onConfirm={() => setShowSecurityModal(false)}
                title="Action Failed"
                message={securityModalMsg}
                confirmText="Understood"
                isDanger={true}
            />

            {/* Create Community Poll Modal */}
            {showCreatePollModal && (
                <CreateCommunityPollModal
                    communityId={id}
                    communityName={group.name}
                    onClose={() => setShowCreatePollModal(false)}
                    onCreated={() => {
                        setShowCreatePollModal(false);
                        fetchGroupAndPosts();
                    }}
                />
            )}

            {/* Delete Poll Confirmation */}
            <ConfirmationModal
                isOpen={!!pollToDelete}
                onClose={() => setPollToDelete(null)}
                onConfirm={handleDeletePoll}
                title="Delete Poll"
                message="Are you sure you want to delete this poll? All votes will be lost."
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default GroupDetail;
