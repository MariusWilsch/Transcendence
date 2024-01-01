// components/Chat.tsx
'use client';
import { BiConversation } from "react-icons/bi";
import { useEffect, useState, useRef, useContext, use } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { Room, useAppContext, User } from '../AppContext';
import PrivateRoom from './[roomId]/page';
import { Navbar, Sidebar } from '../profile/[intraId]/page';
import { Toaster } from 'react-hot-toast';
import { ImBubbles2 } from "react-icons/im";
import { MdGroups } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import Link from "next/link";

export const ConversationCard = ({ user }: any, {lastMessage}:any) => {
  const context = useAppContext();
  const roomName = parseInt(context.userData?.intraId) > parseInt(user.intraId)?context.userData?.intraId+user.intraId:user.intraId+context.userData?.intraId;
  return (
    <Link
    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomName}`}
    >
    <div onClick={()=>context.setRecipientLogin(user.intraId)} className="flex items-center text-xs  my-1 hover:bg-gray-800 ">
      <div className="flex  flex-col space-y-2 text-white  max-w-xs mx-2 order-2 items-start">
        <div><span className='hidden sm:block'>{user?.login}</span></div>
        {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
      </div>
      <Image width={50} height={50} src={user.Avatar} alt="My profile" className="rounded-full order-1" />
    </div>
    </Link>
  );
}

const SearchStart = () => {
  return (
    <div className="flex items-center p-2 my-1 border-4">
      <input type='button' placeholder='find or start a new conversation' />
    </div>
  );
}
export const ConversationNotSelected = () => {
  return (
    <div className="flex  flex-1 flex-col items-center justify-center p-2 my-1  w-screen">
      <BiConversation className="h-40 w-40  " />
      <h1> no Conversation has been selected</h1>
    </div>
  );
}
export const Conversations = ({friends}:any) => {
  const context = useAppContext();
  const [selected, setSelected] = useState<string>('messages');
  const style = {borderBottom: "1px solid gray"};
  return (
    <div  className=" w-1/5 flex flex-col h-full p-4">
    {/* <SearchStart /> */}
      {/* <h1 className='text-center text-lg text-white hidden sm:block'>Conversations</h1> */}
      <div className='flex justify-center py-3'>
        <ImBubbles2
        style={selected === 'messages'?style:{}}
        onClick={()=>{
          selected !== 'messages' && setSelected('messages');
        }}
        className='h-8 w-1/3'
        />
        <MdGroups
        style={selected === 'channels'?style:{}}
         onClick={()=>{
          selected !== 'channels' && setSelected('channels');
        }}
        className='h-8 w-1/3' />
        <BsPersonLinesFill
        style={selected === 'onlineFriends'?style:{}}
         onClick={()=>{
          selected !== 'onlineFriends' && setSelected('onlineFriends');
        }}
        className='h-8 w-1/3 ' />
      </div>
      {
        selected === 'messages' &&
        <div>
        {friends?.friends.map((friend:any, index:any) => (
          <ConversationCard key={index} user={friend} lastMessage={"last message"} />
          ))}
      </div>
        }
    </div>
  );
};

const ProfileInfo = () => {
  return (
    <div className="border w-1/5 xl:hidden">
      <h1>Profile Info</h1>
    </div>
  );
}
const Chat = () => {
  const context = useAppContext();
  const [romms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    const fetchDataAndSetupSocket = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const userData = await response.json();
        context.setUserData(userData);
        const response2 = await fetch(`http://localhost:3001/users/${userData.intraId}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const friends = await response2.json();
        const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3003/chat`;
        const newSocket = io(chatNameSpace, {
          query: { userId: userData.intraId },
        });
        context.setSocket(newSocket);
        context.setFriends(friends);
        // context.socket?.on('privateChat', (data: Message) => {
        //   setMessages((prevMessages:Message[]) => [...prevMessages, data]);
        // });
        if (context.recipientUserId && context.socket) {
          context.socket?.emit('createPrivateRoom', { user1:context.userData?.intraId, user2:context.recipientUserId });
        }
        return () => {
          context.socket?.disconnect();
        };
      } catch (error) {
        console.error("Error during login:", error);
      }
    };

    fetchDataAndSetupSocket();
  }, []);
  // useEffect(() => {
  //   const rooms:Room[] = [];
  //   if (context.socket && context.recipientUserId){
  //     const roomId = parseInt(context.userData?.intraId) > parseInt(context.recipientUserId)?context.userData?.intraId+context.recipientUserId:context.recipientUserId+context.userData?.intraId;
  //     context.socket.on('privateChat',()=>{
        
  //     })
  //   }
  // } , [context.socket]);
  return (
    <div className=" min-h-screen w-screen  bg-[#12141A]">
    <Navbar isProfileOwner={false} />
    <div className="flex ">
      {context.isSidebarVisible && (
        <div className="w-16 custom-height ">
          <div
            className={`transition-all duration-500 ease-in-out ${
              context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
      <div className="flex custom-height">
      <Conversations friends={context.friendsData} />
      {/* { context.recipientUserId && (parseInt(context.userData?.intraId) > parseInt(context.recipientUserId)
      ?<PrivateRoom  params={{roomId: context.userData?.intraId+context.recipientUserId}} />
      :<PrivateRoom  params={{roomId: context.recipientUserId + context.userData?.intraId}} />)} */}
      <ConversationNotSelected />
      {/* <ProfileInfo></ProfileInfo> */}
    </div>
      </div>
    </div>
    <Toaster />
  </div>
  );
};


export default Chat;