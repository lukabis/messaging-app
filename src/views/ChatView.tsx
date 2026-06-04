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

type Message = {
  id: number;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
};

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function ChatView() {
  const { friendId } = useParams<{ friendId: string }>();
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [viewportHeight, setViewportHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      setViewportHeight(window.visualViewport?.height ?? window.innerHeight);
    }
    window.visualViewport?.addEventListener("resize", update);
    return () => window.visualViewport?.removeEventListener("resize", update);
  }, []);

  async function sendMessage() {
    if (!inputText.trim()) return;
    const token = await getAccessTokenSilently();
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/messages/${friendId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      }
    );
    if (!res.ok) return;
    const message: Message = await res.json();
    setMessages((prev) => [...prev, message]);
    setInputText("");
  }

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
      setMessages(data.messages);
    }
    fetchChat();
  }, [friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  });

  return (
    <div className="flex flex-col bg-[#292929]" style={{ position: "fixed", top: 0, left: 0, right: 0, height: viewportHeight }}>
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
        {messages.map((msg) => {
          const sent = msg.fromUserId === user?.sub;
          const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={msg.id} className={`flex ${sent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] px-4 py-2 rounded-2xl ${
                  sent
                    ? "bg-[#4a9eff] rounded-br-sm"
                    : "bg-[#1a2a3e] rounded-bl-sm"
                }`}
              >
                <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${sent ? "text-white/60" : "text-gray-500"} text-right`}>
                  {time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#292929] px-4 pt-3 pb-8 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#545454] text-white placeholder-gray-500 text-sm rounded-full px-4 py-2.5 outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-full bg-[#4a9eff] flex items-center justify-center text-white flex-shrink-0 transition-colors ${!inputText.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3a8eef]"}`}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatView;
