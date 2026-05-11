import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const SEARCH_DEBOUNCE_MS = 200;

type SearchUser = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  relationship: string;
};

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PersonAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function PersonCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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

/*
  When user has no profile image, this function ensures that same user id
  matches the same color every time
*/
function avatarColor(id: string): string {
  const colors = [
    "bg-purple-600",
    "bg-green-600",
    "bg-pink-600",
    "bg-yellow-600",
    "bg-orange-600",
    "bg-teal-600",
    "bg-blue-600",
    "bg-red-600"
  ];

  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return colors[hash % colors.length];
}

function UserRow({ user }: { user: SearchUser }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const color = avatarColor(user.id);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        {user.profileImage ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${user.profileImage}`}
            alt={user.username ?? ""}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-sm">{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{user.username ?? "—"}</p>
        <p className="text-gray-400 text-xs truncate">{user.firstName} {user.lastName}</p>
      </div>

      {user.relationship === "pending_received" ? (
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="w-9 h-9 rounded-full bg-[#2bc267] flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            aria-label="Accept friend request"
          >
            <CheckIcon />
          </button>
          <button
            className="w-9 h-9 rounded-full bg-[#f6695e] flex items-center justify-center text-white hover:bg-red-700 transition-colors"
            aria-label="Decline friend request"
          >
            <XIcon />
          </button>
        </div>
      ) : (
        <button
          className={[
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
            user.relationship === "friends"
              ? "bg-[#33d375] text-white hover:bg-[#2bc267]"
              : "bg-[#3a4a5e] text-gray-300 hover:bg-[#4a5a6e]",
          ].join(" ")}
          aria-label={`Add ${user.username} as friend`}
        >
          {user.relationship === "friends" && <PersonCheckIcon />}
          {user.relationship === "pending_sent" && <ClockIcon />}
          {user.relationship === "not_friends" && <PersonAddIcon />}
        </button>
      )}
    </div>
  );
}

function AddFriendView() {
  const navigate = useNavigate();
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

  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <header className="bg-[#135caf] px-4 pt-4 pb-2 relative">
        <div className="flex items-center h-[50px]">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[22px]">Add Friend</h1>
        </div>
      </header>

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
          results.map((user) => <UserRow key={user.id} user={user} />)
        )}
      </main>
    </div>
  );
}

export default AddFriendView;
