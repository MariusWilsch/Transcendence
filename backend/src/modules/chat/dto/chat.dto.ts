export type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  isRegistred: Boolean;
  isTfaEnabled: Boolean;
  created_at: Date;
  updated_at: Date;
};

export type Message = {
  id: number;
  sender: string;
  recipient: string;
  content: string;
  createdAt: Date;
  senderUser: User;
  recipientUser: User;
  PrivateRoomName:string
  PrivateRoom: Room[]
}

export type Room =
  {
    id: number;
    name: string;
    participantsIds: string[];
    participants: User[]
    messages: Message[]
    createdAt: Date;
    updated_at: Date;
  }

export type Channel = {
    id: number;
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
    Avatar: string;
    login: string;
    isOwner: boolean;
    isModerator: boolean;
    isBanned: boolean;
    isMuted: boolean;
    onInviteState:boolean;
    mutedTime: Date;
    joined_at: Date;
}

export type ChannelMessage = {
  id: number,
  channelId: string,
  sender: string,
  recipient: string,
  content: string,
  createdAt: Date,
}

