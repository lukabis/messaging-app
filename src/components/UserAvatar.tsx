type AvatarUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImage: string | null;
};

const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-green-600",
  "bg-pink-600",
  "bg-yellow-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-red-600",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function UserAvatar({ user }: { user: AvatarUser }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const color = avatarColor(user.id);

  return (
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
  );
}

export default UserAvatar;
