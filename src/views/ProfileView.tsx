import { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImage: string | null;
}

function ProfileView() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data: UserProfile = await res.json();
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setUsername(data.username ?? "");
        if (data.profileImage) {
          setAvatarUrl(`${import.meta.env.VITE_API_BASE_URL}${data.profileImage}`);
        }
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, []);

  const isValid =
    firstName.trim().length >= 3 &&
    lastName.trim().length >= 3 &&
    username.trim().length >= 3;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    fileRef.current = file;
    setAvatarUrl(URL.createObjectURL(file));
    setSaved(false);
  }

  function handleFieldChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setSaved(false);
      setError(null);
    };
  }

  async function handleSave() {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const body = new FormData();
      body.append("firstName", firstName);
      body.append("lastName", lastName);
      body.append("username", username);
      if (fileRef.current) body.append("profileImage", fileRef.current);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (res.ok) {
        setSaved(true);
        fileRef.current = null;
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <AppHeader />

      <main className="flex-1 overflow-y-auto">

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-center mt-20 mb-8">
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

            <div className="flex flex-col gap-4 px-6 pb-6">
              <label className="sr-only" htmlFor="firstName">First Name</label>
              <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFieldChange(setFirstName)}
                  className="flex-1 bg-transparent text-white placeholder-white/60 text-base outline-none"
                />
              </div>

              <label className="sr-only" htmlFor="lastName">Last Name</label>
              <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleFieldChange(setLastName)}
                  className="flex-1 bg-transparent text-white placeholder-white/60 text-base outline-none"
                />
              </div>

              <label className="sr-only" htmlFor="username">Username</label>
              <div className="flex items-center gap-3 border-b border-[#2a4a6a] pb-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleFieldChange(setUsername)}
                  className="flex-1 bg-transparent text-white placeholder-white/60 text-base outline-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {saved && (
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 text-green-400 text-sm px-4 py-3 rounded-xl">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Profile updated successfully
                </div>
              )}

              <button
                type="button"
                disabled={!isValid || loading}
                onClick={handleSave}
                className="w-full py-3 bg-[#4a9eff] text-white font-semibold rounded-xl hover:bg-[#3a8eef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default ProfileView;
