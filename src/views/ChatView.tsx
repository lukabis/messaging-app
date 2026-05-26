import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import SubPageHeader from "../components/SubPageHeader";
import UserAvatar from "../components/UserAvatar";

type Contact = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImage: string | null;
};

const messages = [
  { id: 1, text: "Hey! Long time no see 👋", sent: false, time: "10:00" },
  { id: 2, text: "Hey David! Yeah it's been a while. How are you?", sent: true, time: "10:01" },
  { id: 3, text: "I'm doing well, thanks! Just been busy with work.", sent: false, time: "10:02" },
  { id: 4, text: "Same here honestly. What have you been up to?", sent: true, time: "10:03" },
  { id: 5, text: "Speedy Chow. I'm just around the corner from your place. 😊", sent: false, time: "10:08" },
  { id: 6, text: "Hi!", sent: true, time: "10:10" },
  { id: 7, text: "Awesome, thanks for letting me know! Can't wait for my delivery. 📦", sent: false, time: "10:11" },
  { id: 8, text: "No problem at all! I'll be there in about 15 minutes.", sent: true, time: "10:11" },
  { id: 9, text: "I'll text you when I arrive.", sent: true, time: "10:12" },
  { id: 10, text: "Sounds good! I'll be waiting.", sent: false, time: "10:13" },
  { id: 11, text: "Great! 😊", sent: true, time: "10:12" },
  { id: 12, text: "See you soon!", sent: false, time: "10:14" },
];

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function ChatView() {
  const { friendId } = useParams<{ friendId: string }>();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchChat() {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        navigate("/");
        return;
      }
      const data = await res.json();
      setContact(data.friend);
    }
    fetchChat();
  }, [friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#292929]">
      <div className="bg-[#292929]">
        <SubPageHeader title="Message" bgColor="bg-[#292929]" />
        {contact && (
          <div className="flex items-center gap-3 px-4 pb-4">
            <UserAvatar user={contact} />
            <div>
              <p className="text-white font-semibold text-base leading-tight">
                {contact.firstName} {contact.lastName}
              </p>
              <p className="text-gray-400 text-xs">@{contact.username}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#2c2d3a] flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[72%] px-4 py-2 rounded-2xl ${
                msg.sent
                  ? "bg-[#4a9eff] rounded-br-sm"
                  : "bg-[#1a2a3e] rounded-bl-sm"
              }`}
            >
              <p className="text-white text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sent ? "text-white/60" : "text-gray-500"} text-right`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#292929] px-4 pt-3 pb-8 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-[#545454] text-white placeholder-gray-500 text-sm rounded-full px-4 py-2.5 outline-none"
        />
        <button className="w-10 h-10 rounded-full bg-[#4a9eff] flex items-center justify-center text-white flex-shrink-0 hover:bg-[#3a8eef] transition-colors">
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatView;
