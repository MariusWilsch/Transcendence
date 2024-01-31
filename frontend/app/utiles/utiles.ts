
import { Channel, ChannelMessage, MemberShip, Room, User } from "../AppContext";


export async function searchUsers(query: string) {
  const response = await fetch(`http://localhost:3001/chat/search?q=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

    });

  const data = await response.json();
  return data;
}

export async function searchMember(query:string, channelId:string) {
    const response = await fetch(`http://localhost:3001/chat/chan/${channelId}/Search?q=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    
    });
  
    const data = await response.json();
    return data;
  }
  
  export async function getChannelFirstMembers(channelId: string): Promise<MemberShip[] | []> {
    const res = await fetch(`http://localhost:3001/chat/chanAvatar/${channelId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok){
      return [];
    }
    const members = res.json();
  
    return members;
  }

  export async function getChannel(channelId: string): Promise<Channel | undefined> {
    const res = await fetch(`http://localhost:3001/chat/channel/${channelId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok){
      return undefined;
    }
    const channel = res.json();
  
    return channel;
  }

  export async function getCurrentMember(channelId: string, intraId:string): Promise<MemberShip | undefined> {
    const res = await fetch(`http://localhost:3001/chat/chanMember/${channelId}/${intraId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok){
      return undefined;
    }
    const channel = res.json();
  
    return channel;
  }

 export async function getChannelMessages(channelId: string, userId:string | undefined): Promise<ChannelMessage[] | []> {
    const res = await fetch(`http://localhost:3001/chat/channels/messages/${channelId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    // if (!res.ok){
    //   return [];
    // }
    const messages = res.json();
  
    return messages;
  }

  export async function getMessages(userId: string, page:number): Promise<any> {
    const res = await fetch(`http://localhost:3001/chat/${userId}/messages?page=${page}`,
      {
        method: "GET",
        credentials: "include"
      },
    );
    const room = res.json();
  
    return room;
  }
  
  export async function getCurrentUser(): Promise<any> {
    const res = await fetch("http://localhost:3001/auth/user", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok)
    {
      return undefined;
    }
    const user = res.json();
    return user;
  }

  export async function getUser(intraId: string): Promise<any> {
    const res = await fetch(`http://localhost:3001/users/${intraId}`, {
      method: "GET",
      credentials: "include",
    });
    const user = res.json();
    return user;
  }

  export async function getUserFriends(intraId: string): Promise<any> {
    const res = await fetch(`http://localhost:3001/users/${intraId}/friends`, {
      method: "GET",
      credentials: "include",
    });
    const friends = res.json();
    return friends;
  }

  export async function getRooms(userId: string): Promise<Room[] | undefined> {
    const res = await fetch(`http://localhost:3001/chat/${userId}/privateRooms/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
  
      })
    if (!res.ok) {
      return undefined;
    }
  
    const room = await res.json();
  
  
    // console.log(room)
    return room;
  }