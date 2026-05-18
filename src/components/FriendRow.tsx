import { useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  PersonAddIcon,
  PersonCheckIcon,
  SpinnerIcon,
  XIcon,
} from "./svg-icons/AddFriendIcons";
import UserAvatar from "./UserAvatar";

export type SearchUser = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  relationship: string;
};

export function UserRow({
  user,
  onAddFriend,
  onAccept,
  onDecline,
}: {
  user: SearchUser;
  onAddFriend: (userId: string) => Promise<void>;
  onAccept: (userId: string) => Promise<void>;
  onDecline: (userId: string) => Promise<void>;
}) {
  const [sending, setSending] = useState(false);
  const [responding, setResponding] = useState<"idle" | "accepting" | "declining">("idle");

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <UserAvatar user={user} />

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{user.username ?? "—"}</p>
        <p className="text-gray-400 text-xs truncate">{user.firstName} {user.lastName}</p>
      </div>

      {user.relationship === "pending_received" ? (
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="w-9 h-9 rounded-full bg-[#2bc267] flex items-center justify-center text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            aria-label="Accept friend request"
            disabled={responding !== "idle"}
            onClick={async () => {
              setResponding("accepting");
              await onAccept(user.id);
              setResponding("idle");
            }}
          >
            {responding === "accepting" ? <SpinnerIcon /> : <CheckIcon />}
          </button>
          <button
            className="w-9 h-9 rounded-full bg-[#f6695e] flex items-center justify-center text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            aria-label="Decline friend request"
            disabled={responding !== "idle"}
            onClick={async () => {
              setResponding("declining");
              await onDecline(user.id);
              setResponding("idle");
            }}
          >
            {responding === "declining" ? <SpinnerIcon /> : <XIcon />}
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
          disabled={sending}
          onClick={async () => {
            if (user.relationship !== "not_friends") return;
            setSending(true);
            await onAddFriend(user.id);
            setSending(false);
          }}
        >
          {sending && <SpinnerIcon />}
          {!sending && user.relationship === "friends" && <PersonCheckIcon />}
          {!sending && user.relationship === "pending_sent" && <ClockIcon />}
          {!sending && user.relationship === "not_friends" && <PersonAddIcon />}
        </button>
      )}
    </div>
  );
}
