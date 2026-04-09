import { useState, useRef } from "react";

function OnboardingView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = firstName.trim() !== "" && lastName.trim() !== "" && username.trim() !== "";

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2e]">
      {/* Header */}
      <div className="bg-[#162236] px-6 pt-10 pb-16">
        <h1 className="text-[#4a9eff] text-2xl font-bold text-right">Onboarding</h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-12 mb-8">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full bg-[#1e2e42] border-2 border-[#1e2e42] overflow-visible focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff]"
          aria-label="Upload profile photo"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[#1e2e42] flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-14 h-14 text-[#4a6a8a]" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </div>
          {/* Edit badge */}
          <span className="absolute bottom-0 right-0 w-7 h-7 bg-[#4a9eff] rounded-full flex items-center justify-center shadow-md" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          aria-hidden="true"
        />
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 px-6">
        {/* First Name */}
        <label className="sr-only" htmlFor="firstName">First Name</label>
        <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4a9eff] shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#4a6a8a] text-base outline-none"
          />
        </div>

        {/* Last Name */}
        <label className="sr-only" htmlFor="lastName">Last Name</label>
        <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4a9eff] shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#4a6a8a] text-base outline-none"
          />
        </div>

        {/* Username */}
        <label className="sr-only" htmlFor="username">Username</label>
        <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4a9eff] shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#4a6a8a] text-base outline-none"
          />
        </div>

        {/* Next button */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            disabled={!isValid}
            aria-label="Next"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isValid
                ? "bg-[#4a9eff] cursor-pointer"
                : "bg-[#1e2e42] cursor-not-allowed"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingView;
