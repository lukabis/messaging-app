import ChatRoundImage from "../../assets/chat-round.svg";

function ChatRound() {
  return (
    <div className="relative mx-auto w-fit mt-20">
      <img src={ChatRoundImage} alt="chat-round" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[22px] leading-[36px]">
        <p className="text-cyan-400 font-semibold">Stay Connected</p>
        <p className="text-cyan-400 font-semibold">Stay Chatting</p>
      </div>
    </div>
  );
}

export default ChatRound;
