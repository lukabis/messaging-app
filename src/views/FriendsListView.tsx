import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SubPageHeader from "../components/SubPageHeader";
import UserAvatar from "../components/UserAvatar";
import BottomNavigation from "../components/BottomNavigation";

type Friend = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
};

function FriendsListView() {
  const { getAccessTokenSilently } = useAuth0();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFriends(data);
      } catch {
        setFriends([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#292929]">
      <SubPageHeader title="Friends" />

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No friends yet</p>
          </div>
        ) : (
          friends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar user={friend} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{friend.username ?? "—"}</p>
                <p className="text-gray-400 text-xs truncate">{friend.firstName} {friend.lastName}</p>
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default FriendsListView;
