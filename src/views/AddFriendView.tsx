import { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  avatarColor: string;
};

const USERS: User[] = [
  { id: "1", username: "david_wayne", firstName: "David", lastName: "Wayne", profileImage: null, avatarColor: "bg-purple-600" },
  { id: "2", username: "edward_mint", firstName: "Edward", lastName: "Mint", profileImage: null, avatarColor: "bg-green-600" },
  { id: "3", username: "may_kang", firstName: "May", lastName: "Kang", profileImage: null, avatarColor: "bg-pink-600" },
  { id: "4", username: "lily_dare", firstName: "Lily", lastName: "Dare", profileImage: null, avatarColor: "bg-yellow-600" },
  { id: "5", username: "dennis_dang", firstName: "Dennis", lastName: "Dang", profileImage: null, avatarColor: "bg-orange-600" },
  { id: "6", username: "cayla_raiji", firstName: "Cayla", lastName: "Raiji", profileImage: null, avatarColor: "bg-teal-600" },
];

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

function UserRow({ user }: { user: User }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={`w-12 h-12 rounded-full ${user.avatarColor} flex items-center justify-center flex-shrink-0`}>
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.username} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-white font-semibold text-sm">{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{user.username}</p>
        <p className="text-gray-400 text-xs truncate">{user.firstName} {user.lastName}</p>
      </div>

      <button
        className="w-9 h-9 rounded-full bg-[#3a4a5e] flex items-center justify-center text-gray-300 hover:bg-[#4a5a6e] transition-colors flex-shrink-0"
        aria-label={`Add ${user.username} as friend`}
      >
        <PersonAddIcon />
      </button>
    </div>
  );
}

function AddFriendView() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? USERS.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.firstName.toLowerCase().includes(query.toLowerCase()) ||
        u.lastName.toLowerCase().includes(query.toLowerCase())
      )
    : USERS;

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
        {filtered.length > 0 ? (
          filtered.map((user) => <UserRow key={user.id} user={user} />)
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

export default AddFriendView;
