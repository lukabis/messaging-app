import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import UserAvatar from "../components/UserAvatar";

type Friend = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImage: string | null;
  lastMessage: { text: string; sentAt: string } | null;
};

function formatTimestamp(sentAt: string): string {
  const date = new Date(sentAt);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function ConversationItem({ friend, onSelect }: { friend: Friend; onSelect: () => void }) {
  const displayName =
    friend.firstName && friend.lastName
      ? `${friend.firstName} ${friend.lastName}`
      : (friend.username ?? friend.id);

  return (
    <button onClick={onSelect} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#1a2a3e] transition-colors text-left">
      <div className="relative flex-shrink-0">
        <UserAvatar user={friend} />
        {/* todo: make active/inactive state work */}
        {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#292929]" /> */}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white font-semibold text-sm truncate">{displayName}</span>
          <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
            {formatTimestamp(friend.lastMessage!.sentAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm truncate">{friend.lastMessage!.text}</p>
          {/* todo: make this count of unread messages work */}
          {/* <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
        </div>
      </div>
    </button>
  );
}

function HomeView() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Friend[] = await res.json();

        const withMessages = data
          .filter((f) => f.lastMessage !== null)
          .sort(
            (a, b) =>
              new Date(b.lastMessage!.sentAt).getTime() -
              new Date(a.lastMessage!.sentAt).getTime()
          );

        setFriends(withMessages);
      } catch {
        setFriends([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <AppHeader />

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full pt-20">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : (
          <div>
            {friends.map((friend) => (
              <ConversationItem key={friend.id} friend={friend} onSelect={() => navigate(`/chat/${friend.id}`)} />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default HomeView;
