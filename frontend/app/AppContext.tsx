import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "universal-cookie";

export interface Message {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  createdAt: Date;
  PrivateRoomName: string;
}

export interface Room {
  id: number;
  name: string;
  paraticipants: string[];
  participantsIds: string[];
  participants: User[];
  messages: Message[];
  createdAt: Date
  updated_at: Date
}
export type ChannelMessage = {
  id: number,
  channelId: string,
  sender: string,
  recipient: string,
  content: string,
  createdAt: Date,
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
  status: string;
};
export type Channel = {
  id: number;
  name: string;
  type: string;
  ownerId: string;
  password: string;
  description: string;
}

export type AppContextProps = {
  isDivVisible: boolean;
  toggleDivVisibility: () => void;
  setDivVisible: (isDivVisible: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isSidebarVisible: boolean;
  setisSidebarVisible: (isSidebarVisible: boolean) => void;
  toggleSidebarVisibleVisibility: () => void;
  recipientUserId: string;
  setRecipientLogin: (recipientUserId: string) => void;
  setUserData: (userData: any) => void;
  userData: any;
  setUsersData: (userData: any) => void;
  usersData: any;
  friendsData: any;
  setFriends: (userData: any) => void;
  setMessages: (messages: Message[]) => void;
  messages: Message[];
  messageText: string;
  setMessageText: (messageText: string) => void;
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  notifSocket: Socket | null;
  setNotifSocket: (notifSocket: Socket | null) => void;
  notif: boolean;
  setnotif: (notif: boolean) => void;
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
  const [usersData, setUsersData] = useState(null);
  const [friendsData, setFriends] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]); // Provide a type for the messages state
  const [notifSocket, setNotifSocket] = useState<Socket | null>(null);
  const [notif, setnotif] = useState<boolean>(false);


  const toggleDivVisibility = () => {
    setDivVisible((prev) => !prev);
  };

  const toggleSidebarVisibleVisibility = () => {
    setisSidebarVisible((prev) => !prev);
  };
  const contextValue: AppContextProps = {
    setUsersData,
    usersData,
    rooms,
    setRooms,
    socket,
    setSocket,
    messages,
    setMessages,
    messageText,
    setMessageText,
    setFriends,
    friendsData,
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
    notifSocket,
    setNotifSocket,
    notif,
    setnotif,
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
