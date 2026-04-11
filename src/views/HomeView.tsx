import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

type Conversation = {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "David Mason",
    avatarInitials: "DM",
    avatarColor: "bg-purple-600",
    lastMessage: "Hey! Are you free to catch up later?",
    timestamp: "12:45",
    unreadCount: 3,
    online: true,
  },
];

function ConversationItem({ conversation }: { conversation: Conversation }) {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#1a2a3e] transition-colors text-left">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-full ${conversation.avatarColor} flex items-center justify-center`}>
          <span className="text-white font-semibold text-sm">{conversation.avatarInitials}</span>
        </div>
        {conversation.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#292929]" />
        )}
      </div>

      {/* Message info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white font-semibold text-sm truncate">{conversation.name}</span>
          <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{conversation.timestamp}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function HomeView() {
  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <AppHeader />

      <main className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[#1a2a3e]">
          {conversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default HomeView;
