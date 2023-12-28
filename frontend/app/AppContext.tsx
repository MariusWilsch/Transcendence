import React, { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  sender: string;
  message: string;
}

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
  setDivVisible: (isDivVisible : boolean ) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isSidebarVisible: boolean;
  setisSidebarVisible: (isSidebarVisible : boolean ) => void;
  toggleSidebarVisibleVisibility: () => void;
  recipientUserId: string;
  setRecipientLogin: (recipientUserId: string) => void;
  setUserData: (userData: any) => void;
  userData: any;
  setMessages: (messages: any) => void;
  messages: any;
  messageText: string;
  setMessageText: (messageText: string) => void;
  socket: any;
  setSocket: (socket: any) => void;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDivVisible, setDivVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarVisible, setisSidebarVisible] = useState<boolean>(true);
  const [recipientUserId, setRecipientLogin] = useState<string>('');
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState<any>(null); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState<any>(null);

  const toggleDivVisibility = () => {
    setDivVisible((prev) => !prev);
  };

  const toggleSidebarVisibleVisibility = () => {
    setisSidebarVisible((prev) => !prev);
  };
  const contextValue: AppContextProps = {
    socket,
    setSocket,
    messages,
    setMessages,
    messageText,
    setMessageText,
    setUserData,
    userData,
    recipientUserId,
    setRecipientLogin,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    user,
    setUser,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
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
