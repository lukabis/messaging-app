import GoogleGIcon from "./google-icon";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function GoogleSignInButton({
  onClick,
  disabled,
  className,
  label = "Continue with Google",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "h-12 px-6 rounded-full mt-auto mb-20",
        // look (blue pill)
        "bg-sky-500 text-slate-900 font-semibold",
        "shadow-sm",
        // interaction
        "hover:bg-sky-400 active:bg-sky-600",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className ?? "",
      ].join(" ")}
      aria-label={label}
    >
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white">
        <GoogleGIcon className="w-4 h-4" />
      </span>
      <span className="text-[16px] leading-none pl-3">{label}</span>
    </button>
  );
}
