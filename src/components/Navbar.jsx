import { useLocation } from "react-router-dom";
import { Logo } from "./navbar-components/logo";
import { MobileNavbar } from "./navbar-components/MobileNavabr";
import { ProfileButton } from "./navbar-components/ProfileButton";
import { WebNavigation } from "./navbar-components/WebNavigation";
import GenericSearchBar from "./navbar-components/GenericSearchBar";
import { NotificationButton } from "./navbar-components/NotificationButton";

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <nav className="sticky p-2 md:p-3 top-0 z-50 glass border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl">
        <div className="px-4 flex items-center justify-between gap-0">
          <Logo />
          <WebNavigation location={location} />
          <div className="flex items-center gap-3 shrink-0">
            <GenericSearchBar />
            {/* <NotificationButton /> */}
            <ProfileButton />
          </div>
        </div>
      </nav>
      <MobileNavbar location={location} />
    </>
  );
};

export default Navbar;
