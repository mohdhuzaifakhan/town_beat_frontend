import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { CreatePostWidget } from "../components/CreatePostWidget";
import { PostCard } from "../components/PostCard";
import { PollWidget } from "../components/PollWidget";
import { AdWidget } from "../components/AdWidget";
import { TrendingGroups } from "../components/TrendingGroups";
import { AdFeedItem } from "../components/AdFeedItem";
import { PollCard } from "../components/PollCard";
import { CampaignCard } from "../components/CampaignCard";
import { FeedHeader } from "../components/post-components/FeedHeader";
import { NewsFilter } from "../components/post-components/NewsFilter";
import { EmptyPostComponent } from "../components/post-components/EmptyPostComponent";

const Home = () => {
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
        const loc = user?.location || "Rampur";
        url += `&location=${loc}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const postsRes = await api.get(url);
      const adsRes = await api.get("/ads?placement=home_feed");
      const pollsRes = await api.get("/polls");
      const campaignsRes = await api.get("/campaigns");

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

      if ((index + 1) % 3 === 0 && campaigns.length > 0) {
        mixed.push({ type: "campaign", data: campaigns[campaignIndex] });
        campaignIndex = (campaignIndex + 1) % campaigns.length;
      }

      if ((index + 1) % 4 === 0 && polls.length > 0 && (index + 1) % 3 !== 0) {
        mixed.push({ type: "poll", data: polls[pollIndex] });
        pollIndex = (pollIndex + 1) % polls.length;
      }

      // Insert ad after every 5th item (avoiding others where possible)
      if (
        (index + 1) % 5 === 0 &&
        ads.length > 0 &&
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
    <div className="space-y-4 max-w-6xl mx-auto px-2 sm:px-4 py-4 mb-20 md:mb-0">
      <FeedHeader
        location={user?.location || "Rampur"}
        locationScope={locationScope}
        setLocationScope={setLocationScope}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <CreatePostWidget onPostCreated={fetchContent} />
          <NewsFilter
            locationScope={locationScope}
            location={user?.location}
            category={category}
            setCategory={setCategory}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="animate-spin text-primary-500" size={24} />
              <p className="text-slate-400 text-sm">Loading feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <EmptyPostComponent />
          ) : (
            <div className="space-y-4">
              {feedItems.map((item, index) => {
                if (item.type === "post") {
                  return (
                    <PostCard
                      key={item.data._id}
                      post={item.data}
                      onUpdate={fetchContent}
                    />
                  );
                } else if (item.type === "ad") {
                  return (
                    <AdFeedItem
                      key={item.data._id || `ad-${index}`}
                      ad={item.data}
                    />
                  );
                } else if (item.type === "poll") {
                  return (
                    <div key={item.data._id} className="pb-2">
                      <PollCard
                        poll={item.data}
                        user={user}
                        onVote={async (optionId) => {
                          await api.post(`/polls/vote/${optionId}`);
                          fetchContent(true);
                        }}
                      />
                    </div>
                  );
                } else if (item.type === "campaign") {
                  return (
                    <div key={item.data._id} className="pb-2">
                      <CampaignCard
                        campaign={item.data}
                        onSupported={() => fetchContent(true)}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 hidden lg:block">
          <PollWidget />
          <AdWidget />
          <TrendingGroups />
        </div>

        {/* Mobile-only view for some widgets if needed, or keep them hidden for cleaner feel */}
        <div className="lg:hidden space-y-6 pt-8 border-t border-white/5">
          <TrendingGroups />
        </div>
      </div>
    </div>
  );
};

export default Home;
