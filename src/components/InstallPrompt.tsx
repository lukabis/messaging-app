import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const isStandalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => setInstallPromptEvent(null);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (isStandalone || !installPromptEvent || dismissed) return null;

  const handleInstall = async () => {
    await installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === "accepted") setInstallPromptEvent(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-[#1a2a3e] border-t border-[#2a3a4e] px-4 py-3 text-white">
      <span className="text-sm">Install Chat App for quick access</span>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="bg-[#135caf] hover:bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
