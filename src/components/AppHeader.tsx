import { useState } from "react";
import logo from "../assets/logo.png";

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PersonAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    setAddMenuOpen(false);
  };

  const handleAddToggle = () => {
    setAddMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-[#135caf] px-4 pt-4 pb-2 relative flex flex-col">
      <div className="flex items-center justify-between mt-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="E-Chat logo" className="w-[92px] h-[50px] object-contain" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSearchToggle}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>

          {!searchOpen && (
            <button
              onClick={handleAddToggle}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={addMenuOpen ? "Close menu" : "Add friend or group"}
            >
              {addMenuOpen ? <CloseIcon /> : <PlusIcon />}
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            className="w-full bg-[#1a2a3e] text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm outline-none border border-[#2a3a4e] focus:border-blue-500 transition-colors"
          />
        </div>
      )}

      {/* Add menu dropdown */}
      {addMenuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
          <div className="absolute right-4 top-14 bg-[#1a2a3e] rounded-xl shadow-lg overflow-hidden z-20 border border-[#2a3a4e] min-w-40">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-[#2a3a4e] transition-colors">
              <PersonAddIcon />
              Add Friend
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-[#2a3a4e] transition-colors">
              <GroupIcon />
              Create Group
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default AppHeader;
