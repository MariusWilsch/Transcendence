import React, { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  isRegistred: boolean;
  isTfaEnabled: boolean;
  created_at: Date;
  updated_at: Date;
};

type AppContextProps = {
  isDivVisible: boolean;
  toggleDivVisibility: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDivVisible, setDivVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleDivVisibility = () => {
    setDivVisible((prev) => !prev);
  };

  const contextValue: AppContextProps = {
    isDivVisible,
    toggleDivVisibility,
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
