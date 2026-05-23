import { useNavigate } from "react-router-dom";
import { BackIcon } from "./svg-icons/AddFriendIcons";

function SubPageHeader({ title, bgColor = "bg-[#135caf]" }: { title: string; bgColor?: string }) {
  const navigate = useNavigate();
  return (
    <header className={`${bgColor} px-4 pt-4 pb-2 relative`}>
      <div className="flex items-center h-[50px]">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[22px]">{title}</h1>
      </div>
    </header>
  );
}

export default SubPageHeader;
