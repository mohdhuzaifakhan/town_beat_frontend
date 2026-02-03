import { useState, useEffect } from "react";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { CreatePostWidget } from "../components/CreatePostWidget";
import { PostCard } from "../components/PostCard";
import { AdWidget } from "../components/AdWidget";
import { TrendingGroups } from "../components/TrendingGroups";
import { AdFeedItem } from "../components/AdFeedItem";
import { PollCard } from "../components/PollCard";
import { CampaignCard } from "../components/CampaignCard";
import { FeedHeader } from "../components/post-components/FeedHeader";
import { NewsFilter } from "../components/post-components/NewsFilter";
import { EmptyPostComponent } from "../components/post-components/EmptyPostComponent";

const Home = ({ onCreatePostClick, isCreateModalOpen, setCreateModalOpen }) => {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [polls, setPolls] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [locationScope, setLocationScope] = useState("Local");
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    fetchContent();
  }, [category, locationScope, search]);

  const fetchContent = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let url = `/posts?category=${category}`;
      if (locationScope === "Local") {
        url += `&location=${user?.location || "Rampur"}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const [postsRes, adsRes, pollsRes, campaignsRes] = await Promise.all([
        api.get(url),
        api.get("/ads?placement=home_feed"),
        api.get("/polls"),
        api.get("/campaigns"),
      ]);

      setPosts(postsRes.data);
      setAds(adsRes.data);
      setPolls(pollsRes.data);
      setCampaigns(campaignsRes.data);
    } catch (err) {
      console.error("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const getMixedFeed = () => {
    let mixed = [];
    let adIndex = 0;
    let pollIndex = 0;
    let campaignIndex = 0;

    posts.forEach((post, index) => {
      mixed.push({ type: "post", data: post });

      if ((index + 1) % 3 === 0 && campaigns.length) {
        mixed.push({ type: "campaign", data: campaigns[campaignIndex] });
        campaignIndex = (campaignIndex + 1) % campaigns.length;
      }

      if ((index + 1) % 4 === 0 && polls.length && (index + 1) % 3 !== 0) {
        mixed.push({ type: "poll", data: polls[pollIndex] });
        pollIndex = (pollIndex + 1) % polls.length;
      }

      if (
        (index + 1) % 5 === 0 &&
        ads.length &&
        (index + 1) % 3 !== 0 &&
        (index + 1) % 4 !== 0
      ) {
        mixed.push({ type: "ad", data: ads[adIndex] });
        adIndex = (adIndex + 1) % ads.length;
      }
    });

    return mixed;
  };

  const feedItems = getMixedFeed();

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-20 no-scrollbar">
      {/* Search/Create Bar & Filters (Mobile Only) */}
      {/* <div className="md:hidden sticky top-13.75 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 pb-2 pt-3 px-3 space-y-2"> */}
        {/* <div className="flex items-center justify-between gap-3"> */}
          {/* <div
            onClick={onCreatePostClick}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3 text-slate-500 active:scale-[0.98] transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-500/10">
              <Plus size={16} className="text-primary-500" />
            </div>
            <span className="text-[12px]   font-medium  ">
              Post an update...
            </span>
          </div> */}

          {/* <button
            onClick={() =>
              setLocationScope(locationScope === "Local" ? "Global" : "Local")
            }
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex flex-col items-center justify-center min-w-[70px] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${locationScope === "Local" ? "bg-primary-500 animate-pulse" : "bg-blue-400"}`}
              />
              <span className="text-[12px]   font-medium text-white truncate max-w-20">
                {locationScope === "Local"
                  ? user?.location || "Local"
                  : "Global"}
              </span>
            </div>
          </button> */}
        {/* </div> */}

        {/* <div className="px-0.5 mt-1">
          <NewsFilter
            locationScope={locationScope}
            location={user?.location}
            category={category}
            setCategory={setCategory}
          />
        </div> */}
      {/* </div> */}

      <div className="px-3 md:px-4 hidden md:block my-4">
        <FeedHeader
          location={user?.location || "Rampur"}
          locationScope={locationScope}
          setLocationScope={setLocationScope}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-0 md:px-4">
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          <div className="px-3 md:block display:none md:px-0 mt-4 md:mt-0">
            <CreatePostWidget
              onPostCreated={fetchContent}
              isExpanded={isCreateModalOpen}
              setIsExpanded={setCreateModalOpen}
            />
          </div>

          <div className="sticky top-15 z-30 bg-slate-950/60 backdrop-blur-md py-2 -mx-0 hidden md:block">
            <div className="px-3 md:px-0">
              <NewsFilter
                locationScope={locationScope}
                location={user?.location}
                category={category}
                setCategory={setCategory}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary-500/10 border-t-primary-500 animate-spin shadow-[0_0_20px_rgba(227,67,67,0.1)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <Sparkles
                      className="text-primary-500 animate-pulse"
                      size={16}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-[12px]   font-medium  ">
                  Updating Your Feed
                </p>
                <p className="text-slate-500 text-[12px]      font-medium   mt-1">
                  Syncing with local signal...
                </p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="px-4 md:px-0">
              <EmptyPostComponent />
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 px-3 md:px-0">
              {feedItems.map((item, index) => {
                if (item.type === "post") {
                  return (
                    <PostCard
                      key={item.data._id}
                      post={item.data}
                      onUpdate={fetchContent}
                    />
                  );
                }
                if (item.type === "ad") {
                  return (
                    <AdFeedItem
                      key={item.data._id || `ad-${index}`}
                      ad={item.data}
                    />
                  );
                }
                if (item.type === "poll") {
                  return (
                    <PollCard
                      key={item.data._id}
                      poll={item.data}
                      user={user}
                      onVote={async (optionId) => {
                        await api.post(`/polls/vote/${optionId}`);
                        fetchContent(true);
                      }}
                    />
                  );
                }
                if (item.type === "campaign") {
                  return (
                    <CampaignCard
                      key={item.data._id}
                      campaign={item.data}
                      onSupported={() => fetchContent(true)}
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <AdWidget />
          <TrendingGroups />
        </div>
      </div>
    </div>
  );
};

export default Home;
