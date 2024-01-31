'use client'
import { FC, useEffect, useState } from "react"
import { Channel, ChannelMessage, MemberShip, User, useAppContext } from "@/app/AppContext"
import Cookies from "universal-cookie"
import { io } from "socket.io-client"
import { Loading } from "@/app/components/Loading"
import toast, { Toaster } from "react-hot-toast"
import { Navbar } from "@/app/components/Navbar"
import { Sidebar } from "@/app/components/Sidebar"
import { IoMdArrowBack } from "react-icons/io"
import Image from "next/image"
import { MantineProvider, Select,  } from '@mantine/core';
import { FcInvite } from "react-icons/fc";
import { PiFlagBannerLight } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import EditMemberShip from "@/app/chatComponents/EditMemberShip"
import Search from "@/app/notif/page"
import { time } from "console"
import Link from "next/link"
import ChannelAvatar from "@/app/chatComponents/ChannelAvatar"
import ChannelDashBoard from "@/app/chatComponents/ChannelDashBoard"
import { getChannel, getChannelFirstMembers, getChannelMessages, getCurrentMember, getCurrentUser, getRooms } from "@/app/utiles/utiles"
import Conversations from "@/app/chatComponents/Converstions"
import { SingleMessageSent } from "@/app/chatComponents/SingleMessageSent"
import PermissionDenied from "@/app/chatComponents/PermissionDenied"



interface PageProps {
  params: {
    channelId: string
  }
}
const SingleMessageReceived = ({channelMessage}: any) => {
  const { content, Avatar } = channelMessage;
  return (
    <div className="flex items-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{content}</span></div>
      </div>
      <Image width={24} height={24} src={Avatar} alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
};

// async function searchMember(query:string, channelId:string) {
//   const response = await fetch(`http://localhost:3001/chat/chan/${channelId}/Search?q=${query}`,
//   {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
  
//   });

//   const data = await response.json();
//   return data;
// }

// async function getChannelFirstMembers(channelId: string): Promise<MemberShip[] | []> {
//   const res = await fetch(`http://localhost:3001/chat/chanAvatar/${channelId}`, {
//     method: "GET",
//     credentials: "include",
//   });
//   if (!res.ok){
//     return [];
//   }
//   const members = res.json();

//   return members;
// }
// async function getChannel(channelId: string): Promise<Channel | undefined> {
//   const res = await fetch(`http://localhost:3001/chat/channel/${channelId}`, {
//     method: "GET",
//     credentials: "include",
//   });
//   if (!res.ok){
//     return undefined;
//   }
//   const channel = res.json();

//   return channel;
// }
// async function getCurrentMember(channelId: string, intraId:string): Promise<MemberShip | undefined> {
//   const res = await fetch(`http://localhost:3001/chat/chanMember/${channelId}/${intraId}`, {
//     method: "GET",
//     credentials: "include",
//   });
//   if (!res.ok){
//     return undefined;
//   }
//   const channel = res.json();

//   return channel;
// }
// async function getChannelMessages(channelId: string): Promise<ChannelMessage[] | []> {
//   const res = await fetch(`http://localhost:3001/chat/channels/messages/${channelId}`,
//     {
//       method: "GET",
//       credentials: "include"
//     },
//   );
//   if (!res.ok){
//     return [];
//   }
//   const messages = res.json();

//   return messages;
// }

const ChannelRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [channel, setChannel] = useState<Channel | undefined>();
  const [permission, setPermission] = useState(true);
  const [messages, setMessages] = useState<ChannelMessage[] | []>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [currentMember, setCurrentMember] = useState<MemberShip | undefined>();
  const [loading, setLoading] = useState(false);
  const context = useAppContext();
  const [firstMembers, setFirstMembers] = useState<MemberShip[] | []>();
 

  const fetchData = async () => {
    try {
      if (context.userData)
      {
        if (channel===undefined || !channel){
          
          const chan: Channel | undefined = await getChannel(params.channelId);
          if (chan === undefined || !chan) {
            throw ('no such channel')
          }
          setChannel(chan);
          context.setChannel(chan);
          console.log('the channel is ', chan);
        }
        const userMemberShip = await getCurrentMember(params.channelId, context.userData.intraId );
        if (userMemberShip === undefined || userMemberShip.isBanned || userMemberShip.onInviteState)
        {
          throw('permission denied');
        }
        setCurrentMember(userMemberShip);
        console.log('userMembership', userMemberShip);
        if (!context.socket || context.socket === undefined)
        {
          const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
          const cookie = new Cookies();
          const newSocket = io(chatNameSpace, {
            query: { user: cookie.get('jwt') },
          });
          context.setSocket(newSocket);
          console.log('socket ', context.socket);
        }
        const ChannelMessages = await getChannelMessages(params.channelId, context.user?.intraId);
        if (ChannelMessages) {
          setMessages(ChannelMessages);
          console.log(ChannelMessages);
        }
        const rooms = await getRooms(context.userData.intraId);
        if (rooms !==undefined){
            console.log('this is the rooms', rooms);
            context.setRooms(rooms);
          }
        setLoading(false);
      }
    }
    catch (e) {
      e === "you need to login first"
      ? toast.error("you need to login first")
      : e === "no such channel"
      ? toast.error("no such channel") : true;
      setPermission(false);
      console.log('we have a problem');
      console.log(e);
      setLoading(false);
    }
  }
  const fetchAvatar = async () => {
    const members = await getChannelFirstMembers(params.channelId);
    setFirstMembers(members);
  }
  const fetchUserData=async()=>{
    if (!context.userData)
    {
      const userData: User | undefined = await getCurrentUser();
      if (userData === undefined) { 
        throw ('you need to login first');
      }
      console.log(userData);
      context.setUserData(userData);
      console.log('this is the context', context.userData);
    }
    console.log('userData', context.userData);
  }
  const handleResize = () => {
    if (window.innerWidth <= 1030) {
      context.setisSidebarVisible(false);
      context.setResponsive(false);
    }
    else {
      context.setisSidebarVisible(true);
      context.setResponsive(true);
    }
  }
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
    
  }, [context.component])
  useEffect(() => {
    fetchUserData();
    fetchData();
    fetchAvatar();
    if (context.socket && !currentMember?.isBanned){
      context.socket.on('channelBroadcast', (message: any) => {
        if (message.channelId === params.channelId)
        {
          setMessages((prevMessages: ChannelMessage[]) => {
            const newMessages = Array.isArray(prevMessages) ? [...prevMessages, message] : [];
            return newMessages;
          });
        }
      });
      context.socket.on('updateChannelUser', (data:any)=>{
        const msg = 'user update : ' + data.e;
        fetchData();
        toast.success(msg);
      })
    }
    return () => {
      if (context.socket) {
        context.socket.off('channelBroadcast');
        context.socket.off('updateChannelUser');
      }
    };
  }, [context.socket,context.userData])
  const broadCastMessage = () => {
    console.log("this is the socket",context.socket);
    console.log("this is the channel",channel);
    console.log("message ",messageText.trimStart().trimEnd());
    if (context.socket && channel && messageText.trimStart().trimEnd()) {
      const cookie = new Cookies();
      const jwt = cookie.get('jwt')
      context.socket.emit('channelBroadcast', { to: channel.name, message: messageText,jwt });
      setMessages((prevMessages: ChannelMessage[]) => {
        const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];

        let currentDateVariable: Date = new Date();

        const singleMsg: ChannelMessage = {
          id: 0,
          sender: context.userData?.intraId,
          recipient: "",
          content: messageText,
          createdAt: currentDateVariable,
          channelId: params.channelId,
        };

        newMessages.push(singleMsg);

        return newMessages;
      }
      );
      setMessageText('');
    }
  };
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      broadCastMessage();
    }
  }
  if (loading) {
    return (
      <Loading />
    )
  }
  const desplayedMessages: ChannelMessage[] = messages.length ? messages.toReversed() : [];
  console.log('permission', permission);
  const channelName = channel!==undefined? channel?.name.replace(channel.ownerId,''): '';
  return (
    <>
    <MantineProvider>

      <div className=" custom-height w-screen  bg-[#12141A]">
        <div className="flex ">
          {
            permission
            ?
            (<div className="flex-1 overflow-y-auto">
            <div className="flex custom-height">
            {context.responsive
              ? <Conversations />
              : context.component === "messages" && <Conversations />
            }
            {context.responsive
            ?
              <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height">
                <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
                  <div className="relative flex items-center space-x-4">
                    <div
                    onClick={()=>context.setComponent('profile')}
                    className="relative p-4">
                      {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-2xl mt-1 flex items-center">
                        <span className="text-white mr-3">
                          {channelName}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {desplayedMessages?.map((msg: any, index: number) => (
                    (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                    (msg.sender !== context.userData?.intraId && channel ? <SingleMessageReceived key={index}  channelMessage={msg} /> : null)
                    ))}
                </div>
                <div className="p-4">
                  <div className="relative flex">
                    <input
                      type="text"
                      placeholder="Write your message!"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full focus:outline-none focus:placeholder-gray-400  placeholder-gray-600 pl-12  rounded-md p-3 bg-gray-800 text-white" />
                    <div className="absolute right-0 items-center inset-y-0">
                      <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                      </button>
                      <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={broadCastMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              : context.component === 'conversation' &&
              <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height">
                <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
                  <div className="relative flex items-center space-x-4">
                <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:scale-110 justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
                    <div
                    onClick={()=>context.setComponent('profile')}
                    className="relative p-4">
                      {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-2xl mt-1 flex items-center">
                        <span className="text-white mr-3">
                          {channelName}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {desplayedMessages?.map((msg: any, index: number) => (
                    (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                    (msg.sender !== context.userData?.intraId && channel ? <SingleMessageReceived key={index}  channelMessage={msg} /> : null)
                    ))}
                </div>
                <div className="p-4">
                  <div className="relative flex">
                    <input
                      type="text"
                      placeholder="Write your message!"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full focus:outline-none focus:placeholder-gray-400  placeholder-gray-600 pl-12  rounded-md p-3 bg-gray-800 text-white" />
                    <div className="absolute right-0 items-center inset-y-0">
                      <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                      </button>
                      <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={broadCastMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              }
              {
                context.responsive ?
                <ChannelDashBoard currentMember={currentMember} firstMembers={firstMembers} channelId={params.channelId} />
                : context.component === 'profile' &&
                <ChannelDashBoard
                currentMember={currentMember}
                firstMembers={firstMembers}
                />
              }
            </div>
          </div>)
          : <PermissionDenied />
        }
        </div>
        <Toaster />
      </div>
    </MantineProvider>
    </>
  )
}

export default ChannelRoom;