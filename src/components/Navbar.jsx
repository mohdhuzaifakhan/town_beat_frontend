import { useLocation } from "react-router-dom";
import { Logo } from "./navbar-components/logo";
import { MobileNavbar } from "./navbar-components/MobileNavabr";
import { ProfileButton } from "./navbar-components/ProfileButton";
import { WebNavigation } from "./navbar-components/WebNavigation";
import GenericSearchBar from "./navbar-components/GenericSearchBar";
import { NotificationButton } from "./navbar-components/NotificationButton";

const Navbar = ({ onCreatePost, onCreateGroup, onCreatePoll, onCreateCampaign, onCreateAd }) => {
  const location = useLocation();

  const handleCreateTrigger = () => {
    if (location.pathname === "/groups") {
      onCreateGroup();
    } else if (location.pathname === "/polls") {
      onCreatePoll();
    } else if (location.pathname === "/campaigns") {
      onCreateCampaign();
    } else if (location.pathname === "/ads/manager") {
      onCreateAd();
    } else {
      onCreatePost();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 px-3 py-2 md:p-3 glass rounded-none! border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Logo />

          <div className="hidden md:block flex-1 max-w-md">
            <WebNavigation location={location} />
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden sm:block">
              <GenericSearchBar />
            </div>
            <ProfileButton />
          </div>
        </div>
      </nav>
      <MobileNavbar
        location={location}
        onCreatePost={handleCreateTrigger}
      />
    </>
  );
};

export default Navbar;
