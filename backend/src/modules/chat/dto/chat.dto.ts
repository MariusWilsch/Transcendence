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