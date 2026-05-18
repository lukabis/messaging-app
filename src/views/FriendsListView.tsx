import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SubPageHeader from "../components/SubPageHeader";
import UserAvatar from "../components/UserAvatar";
import BottomNavigation from "../components/BottomNavigation";
import { UserRow } from "../components/FriendRow";
import type { SearchUser } from "../components/FriendRow";

type Friend = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
};

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </p>
  );
}

function FriendsListView() {
  const { getAccessTokenSilently } = useAuth0();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const base = import.meta.env.VITE_API_BASE_URL;

        const [friendsRes, pendingRes] = await Promise.all([
          fetch(`${base}/api/friends`, { headers }),
          fetch(`${base}/api/friend-requests`, { headers }),
        ]);

        const [friendsData, pendingData] = await Promise.all([
          friendsRes.json(),
          pendingRes.json(),
        ]);

        setFriends(friendsData);
        setPendingFriendRequests(pendingData.map((u: Friend) => ({ ...u, relationship: "pending_received" as const })));
      } catch {
        setFriends([]);
        setPendingFriendRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAccept(fromUser: string) {
    const token = await getAccessTokenSilently();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friend-requests/${fromUser}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED" }),
    });
    const accepted = pendingFriendRequests.find((u) => u.id === fromUser);
    setPendingFriendRequests((prev) => prev.filter((u) => u.id !== fromUser));
    if (accepted) setFriends((prev) => [...prev, accepted]);
  }

  async function handleDecline(fromUser: string) {
    const token = await getAccessTokenSilently();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friend-requests/${fromUser}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingFriendRequests((prev) => prev.filter((u) => u.id !== fromUser));
  }

  const isEmpty = !loading && friends.length === 0 && pendingFriendRequests.length === 0;

  return (
    <div className="flex flex-col h-screen bg-[#292929]">
      <SubPageHeader title="Friends" />

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No friends yet</p>
          </div>
        ) : (
          <>
            {pendingFriendRequests.length > 0 && (
              <>
                <SectionLabel label="Friend Requests" />
                {pendingFriendRequests.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onAddFriend={async () => {}}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))}
              </>
            )}

            {pendingFriendRequests.length > 0 && friends.length > 0 && (
              <hr className="border-[#3a4a5e] mx-4 my-1" />
            )}

            {friends.length > 0 && (
              <>
                <SectionLabel label="Friends" />
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 px-4 py-3">
                    <UserAvatar user={friend} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{friend.username ?? "—"}</p>
                      <p className="text-gray-400 text-xs truncate">{friend.firstName} {friend.lastName}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default FriendsListView;
