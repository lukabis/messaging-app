import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function ChatIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GroupsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function BottomNavigation() {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const tabClass = (active: boolean) =>
    `flex flex-col items-center gap-1 px-4 transition-colors ${active ? "text-blue-500" : "text-gray-500 hover:text-gray-300"}`;

  return (
    <>
      {moreMenuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMoreMenuOpen(false)} />
      )}

      <nav className="bg-[#292929] border-t border-[#3a3a3a] flex items-center justify-around px-2 py-3 relative">
        <button onClick={() => navigate("/")} className={tabClass(pathname === "/")}>
          <ChatIcon active={pathname === "/"} />
          <span className="text-xs font-medium">Chats</span>
        </button>
        <button className={tabClass(false)}>
          <GroupsIcon />
          <span className="text-xs font-medium">Groups</span>
        </button>
        <button onClick={() => navigate("/profile")} className={tabClass(pathname === "/profile")}>
          <ProfileIcon />
          <span className="text-xs font-medium">Profile</span>
        </button>
        <div className="relative">
          {moreMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#1a2a3e] rounded-xl shadow-lg overflow-hidden z-20 border border-[#2a3a4e] min-w-40">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-[#2a3a4e] transition-colors"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
          <button
            onClick={() => setMoreMenuOpen((prev) => !prev)}
            className="flex flex-col items-center gap-1 px-4 transition-colors text-gray-500 hover:text-gray-300"
          >
            <MoreIcon />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default BottomNavigation;
