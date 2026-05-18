import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { SearchIcon } from "../components/svg-icons/AddFriendIcons";
import SubPageHeader from "../components/SubPageHeader";
import { UserRow } from "../components/FriendRow";
import type { SearchUser } from "../components/FriendRow";

const SEARCH_DEBOUNCE_MS = 200;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-20 text-[#3a4a5e]">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="10" y="20" width="80" height="60" rx="12" fill="currentColor" opacity="0.25" />
        <path d="M10 68 L30 85 L10 85 Z" fill="currentColor" opacity="0.25" />
        <circle cx="82" cy="72" r="22" fill="#292929" stroke="currentColor" strokeWidth="6" opacity="0.5" />
        <line x1="98" y1="88" x2="110" y2="100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        <circle cx="82" cy="72" r="10" fill="currentColor" opacity="0.2" />
      </svg>
      <p className="text-gray-500 text-sm">No users found</p>
    </div>
  );
}

function AddFriendView() {
  const { getAccessTokenSilently } = useAuth0();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length <= 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/friends/search?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const showEmpty = !loading && results.length === 0;

  async function handleAddFriend(toUser: string) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friend-requests`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ toUser }),
    });
    if (res.status === 404) {
      setResults((prev) => prev.filter((u) => u.id !== toUser));
      return;
    }
    setResults((prev) =>
      prev.map((u) => (u.id === toUser ? { ...u, relationship: "pending_sent" } : u))
    );
  }

  async function handleAcceptRequest(fromUser: string) {
    const token = await getAccessTokenSilently();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friend-requests/${fromUser}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED" }),
    });
    setResults((prev) =>
      prev.map((u) => (u.id === fromUser ? { ...u, relationship: "friends" } : u))
    );
  }

  async function handleDeclineRequest(fromUser: string) {
    const token = await getAccessTokenSilently();
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/friend-requests/${fromUser}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setResults((prev) =>
      prev.map((u) => (u.id === fromUser ? { ...u, relationship: "not_friends" } : u))
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <SubPageHeader title="Add Friend" />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-[#1a2a3e] rounded-full px-4 py-2 border border-[#2a3a4e] focus-within:border-blue-500 transition-colors">
          <span className="text-gray-400">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Searching...</p>
          </div>
        ) : showEmpty ? (
          <EmptyState />
        ) : (
          results.map((user) => <UserRow key={user.id} user={user} onAddFriend={handleAddFriend} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} />)
        )}
      </main>
    </div>
  );
}

export default AddFriendView;
