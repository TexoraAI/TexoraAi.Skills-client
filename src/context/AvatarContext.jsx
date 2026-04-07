/**
 * AvatarContext.jsx  ← .jsx extension zaroori hai (JSX syntax hai andar)
 *
 * ✅ Global avatar state — wrap your ENTIRE app with <AvatarProvider>
 * ✅ Image persisted in localStorage → survives page refresh
 * ✅ Navbar, Sidebar, ProfilePage — sab sync rahenge
 *
 * Usage in main.jsx:
 *   import { AvatarProvider } from "./context/AvatarContext";
 *   <AvatarProvider><App /></AvatarProvider>
 *
 * Usage in any component:
 *   import { useAvatarContext } from "./context/AvatarContext";
 *   const { profileImage, uploadImage, removeImage } = useAvatarContext();
 */

import { createContext, useContext, useState, useCallback } from "react";

const AVATAR_KEY = "lms_profile_avatar";

const AvatarCtx = createContext(null);

export const AvatarProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(AVATAR_KEY) || null
  );

  const uploadImage = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setProfileImage(dataUrl);
      try {
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } catch {
        console.warn("localStorage full — avatar not persisted.");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setProfileImage(null);
    localStorage.removeItem(AVATAR_KEY);
  }, []);

  return (
    <AvatarCtx.Provider value={{ profileImage, uploadImage, removeImage }}>
      {children}
    </AvatarCtx.Provider>
  );
};

export const useAvatarContext = () => {
  const ctx = useContext(AvatarCtx);
  if (!ctx) {
    throw new Error("useAvatarContext must be used inside <AvatarProvider>");
  }
  return ctx;
};