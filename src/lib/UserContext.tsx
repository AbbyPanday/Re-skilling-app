import { createContext, useContext, useState, ReactNode } from "react";

type LanguageLevel = "simple" | "standard";

interface UserContextType {
  languageLevel: LanguageLevel;
  setLanguageLevel: (level: LanguageLevel) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>("simple");
  return (
    <UserContext.Provider value={{ languageLevel, setLanguageLevel }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within UserProvider");
  return context;
};
