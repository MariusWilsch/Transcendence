import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';

export type MatchHistory = {
	winnerId: String;
	loserId: String;
	score: String;
	user1Avatar: String;
	user2Avatar: String;
	user1Login: String;
	user2Login: String;
	matchDate: string;
};

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
	createdAt: Date;
	updated_at: Date;
}
export type ChannelMessage = {
	id: number;
	channelId: string;
	sender: string;
	recipient: string;
	content: string;
	createdAt: Date;
};

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
  id: string;
  name: string;
  type: string;
  ownerId: string;
  password: string;
  description: string;
}

export type MemberShip={
  memberId: string;
    intraId: string;
    channelId: string;
    channelName:string;
    Avatar: string;
    login: string;
    isOwner: boolean;
    isModerator: boolean;
    isBanned: boolean;
    onInviteState:boolean;
    isMuted: boolean;
    mutedTime: Date;
    joined_at: Date;
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
	channel: Channel | undefined;
	setChannel: (channel: Channel) => void;
	notifSocket: Socket | null;
	setNotifSocket: (notifSocket: Socket | null) => void;
	notif: boolean;
	setMessageNum: (messageNumb: number) => void;
	messageNumb: number;
	setnotif: (notif: boolean) => void;
	setComponent: (component: string) => void;
	component: string;
	setResponsive: (responsive: boolean) => void;
	responsive: boolean;
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
	const [messageNumb, setMessageNum] = useState(0);
	const [component, setComponent] = useState('conversation'); //for resposive purposes
	const [responsive, setResponsive] = useState(true);
	const [channel, setChannel] = useState<Channel | undefined>();

	const toggleDivVisibility = () => {
		setDivVisible((prev) => !prev);
	};

	const toggleSidebarVisibleVisibility = () => {
		setisSidebarVisible((prev) => !prev);
	};
	const contextValue: AppContextProps = {
		setMessageNum,
		messageNumb,
		setChannel,
		channel,
		setComponent,
		component,
		setResponsive,
		responsive,
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
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
