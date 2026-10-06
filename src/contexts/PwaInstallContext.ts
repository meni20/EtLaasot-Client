import { createContext, useContext } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface PwaInstallContextValue {
  canInstall: boolean;
  installed: boolean;
  iosDevice: boolean;
  mobileDevice: boolean;
  requestInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

export const PwaInstallContext = createContext<PwaInstallContextValue | null>(
  null,
);

export const usePwaInstall = () => {
  const context = useContext(PwaInstallContext);
  if (!context) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }
  return context;
};
