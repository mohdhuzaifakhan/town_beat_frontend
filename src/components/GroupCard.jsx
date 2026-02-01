import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, LogOut } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ConfirmationModal } from "./ConfirmationModal";

import { InviteModal } from "./InviteModal";

export const GroupCard = ({ group, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const isOwner = user?._id === group.owner;
  const isMember = group.members.includes(user?._id);

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.post(`/groups/${group._id}/join`);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      await api.post(`/groups/${group._id}/leave`);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsLeaving(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/groups/${group._id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const handleInviteTrigger = async () => {
    if (!group.inviteCode) {
      try {
        await api.post(`/groups/${group._id}/invite`);
        onUpdate();
      } catch (err) {
        console.error(err);
      }
    }
    setShowInvite(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-slate-900/40 border border-white/5 rounded-lg p-3 sm:p-5 hover:border-primary-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-900/10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-600/10 transition-colors duration-500" />
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-2xl font-medium text-primary-500 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-2xl">
              {group.image ? (
                <img src={group.image} className="w-full h-full object-cover" />
              ) : (
                group.name[0]
              )}
            </div>
            {isMember && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-medium text-white    truncate group-hover:text-primary-300 transition-colors duration-300">
                  {group.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium   bg-white/5 border border-white/5 text-slate-500">
                    {group.type}
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium   bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      Authority
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500   bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                <Users size={12} className="text-primary-500" />
                {group.membersCount}
              </div>
            </div>

            <p className="text-[12px] text-slate-300 font-medium line-clamp-2">
              {group.description ||
                "Connecting local citizens through shared objectives."}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInviteTrigger();
                  }}
                  className="
                    w-full sm:w-auto
                    px-4 py-2
                    rounded-lg
                    bg-emerald-500/10 hover:bg-emerald-500
                    text-emerald-400 hover:text-white
                    border border-emerald-500/20
                    transition-all duration-300
                    font-medium text-[11px]
                    active:scale-95
                    flex items-center justify-center gap-2
                "
                >
                  Group Code
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {isOwner ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleting(true);
                    }}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-all duration-300 font-medium text-[11px]   disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={12} /> Dismantle
                  </button>
                ) : isMember ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLeaving(true);
                    }}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 border border-white/5 hover:border-rose-500/20 transition-all duration-300 font-medium text-[11px] disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <LogOut size={12} /> Disconnect
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoin();
                    }}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg 
                      bg-primary-500/10 hover:bg-primary-500 
                      text-primary-500 hover:text-white 
                        border border-primary-500/20 
                        transition-all duration-300 
                        font-medium text-[11px] 
                        disabled:opacity-50 
                        active:scale-95 
                        shadow-sm hover:shadow-md"

                  >
                    {loading ? "Connecting..." : "Join Group"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isDeleting && (
        <ConfirmationModal
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Dismantle Sector"
          message="Are you sure you want to permanently dismantle this sector? This action will disconnect all linked nodes."
          onConfirm={handleDelete}
          confirmText="Dismantle"
          isDanger={true}
        />
      )}

      {isLeaving && (
        <ConfirmationModal
          isOpen={isLeaving}
          onClose={() => setIsLeaving(false)}
          title="Disconnect from Sector"
          message="Are you sure you want to disconnect your local node from this community sector?"
          onConfirm={handleLeave}
          confirmText="Disconnect"
          isDanger={true}
        />
      )}

      {showInvite && (
        <InviteModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          inviteCode={group.inviteCode}
          groupName={group.name}
        />
      )}
    </>
  );
};
