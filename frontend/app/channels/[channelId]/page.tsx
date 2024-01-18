'use client'
import { FC, useEffect, useState } from "react"
import { Channel, ChannelMessage, MemberShip, User, useAppContext } from "@/app/AppContext"
import Cookies from "universal-cookie"
import { io } from "socket.io-client"
import { SingleMessageSent, getCurrentUser, getUser } from "../../chat/[roomId]/page"
import { Loading } from "@/app/components/Loading"
import toast, { Toaster } from "react-hot-toast"
import { Navbar } from "@/app/components/Navbar"
import { Sidebar } from "@/app/components/Sidebar"
import { Conversations } from "../../chat/page"
import { IoMdArrowBack } from "react-icons/io"
import { Avatar, AvatarGroup, ComboboxItem } from "@mantine/core"
import { FaUserEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Image from "next/image"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { Select,  } from '@mantine/core';
import { PiFlagBannerFill } from "react-icons/pi";
import { PiFlagBannerLight } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";


import Search from "@/app/notif/page"
import { time } from "console"
import Link from "next/link"

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
function addHoursToNow(hours:string) {
  const hoursToAdd = parseInt(hours, 10);
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + hoursToAdd);
  return currentDate;
}
async function searchMember(query:string, channelId:string) {
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
const EditMemberShip = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const context = useAppContext();
  const {member, currentMember} = props;
  const {memberId ,
      intraId ,
      channelId ,
      Avatar ,
      login,
      isOwner,
      isModerator,
      isBanned ,
      isMuted,
      mutedTime,
      joined_at,
  }= member;

  // const []
  const [ModeValue, setModeValue] = useState('');
  const [muteValue, setMuteValue] = useState('');
  const handleSubmit = () => {
    if (ModeValue || muteValue)
    {
      if (context.socket)
      {
        const cookie = new Cookies();
        const jwt = cookie.get('jwt')
        console.log('are we here');
        //schema
        //{jwt,memberId, info:{userPrivilige:ModeValue==="moderator"?true:false,banning:member.isBanned,Muting:(member.isMuted && muteValue==='UnMute')?{action:false, time:new Date()}:muteValue?{action:true, time:addHoursToNow(muteValue)}:{action:member.isMuted,time:addHoursToNow(muteValue)}}}
        //{moderatorId:string, memberId:string, info:{userPrivilige:boolean, banning:boolean, Muting:{action:boolean, time:Date}}}
        context.socket.emit('updateChannelUser',{jwt,memberId, info:{userPrivilige:ModeValue==="moderator"?true:false,banning:member.isBanned,Muting:(member.isMuted && muteValue==='UnMute')?{action:false, time:new Date()}:muteValue?{action:true, time:addHoursToNow(muteValue)}:{action:member.isMuted,time:addHoursToNow(muteValue)}}})
      }
    }
  }
  const dataMode= member.isModerator ? [{value:'remove Moderator', label:'remove moderator'}] : [{value:'moderator', label:'moderator'}];
  const dataMute = member.isMuted
                  ?[{value:'UnMute', label:'UnMute'}]
                  :[
                    {value:'1', label:'Mute for 1h'},
                    {value:'2', label:'Mute for 2h'},
                    {value:'6', label:'Mute for 6h'},
                    {value:'12', label:'Mute for 12h'},
                    {value:'131651616516165167', label:'until Unmute'},
                     
                  ];
                  console.log(currentMember);
                  console.log(addHoursToNow(muteValue));
  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Member" centered>
        <div>
          <div className="member-avatar">

          </div>
          <div className="login">

          </div>
          <div className="change-privilege">
            <Select
               data={dataMode}
               label="change Member privilege"
               value={ModeValue ? ModeValue : ''}
               onChange={(_value:string | null) => {
                _value ?setModeValue(_value):setMuteValue('');
               }}
            />
            <div className="banne"></div>
          </div>
          <div className="muted">
          <Select
               data={dataMute}
               label="Mute Member for "
               value={muteValue? muteValue : ''}
               onChange={(_value:string | null) => {
                _value ?setMuteValue(_value):setMuteValue('');
               }}
            />
          </div>
          <Button onClick={()=>{
            setModeValue('');
            setMuteValue('');
            close();
            handleSubmit();
          }}> submit </Button>
        </div>
      </Modal>
      <FaUserEdit className="text-white w-6 h-6 transform transition-transform hover:scale-150" onClick={open} />
    </>
  );
}

const MemberCard = (props: any) => {
  const {member, currentMember} = props;
  return (
      <div className="flex flex-row space-y-2  text-xs p-3 hover:bg-gray-800 rounded w-full bg-black">
        <div className="flex flex-row  ml-0">
          <Image
            width={50}
            height={50}
            src={member?.Avatar}
            alt="My profile"
            className="w-10 sm:w-10 h-10 sm:h-10 rounded-full"
            />
          <span className="p-2 text-white text-center">{member?.login}</span>

          </div>
        <div>
        {(currentMember?.isOwner || currentMember?.isModerator)
          ? (<div className=" flex flex-row space-x-5  ">
          <PiFlagBannerLight onClick={()=>console.log(`the member ${member.login} is banned`)}
          className="text-white w-6 h-6 transform transition-transform hover:scale-150" />
          <EditMemberShip member={member} currentMember={currentMember} />
          </div>
          )
          : (<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${member.intraId}`}>
            <CgProfile  className="text-white w-6 h-6 transform transition-transform hover:scale-150 " />
            </Link>
            )
        }
        </div>
      </div>

  );
}
async function getChannelFirstMembers(channelId: string): Promise<MemberShip[] | []> {
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
async function getChannel(channelId: string): Promise<Channel | undefined> {
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
async function getCurrentMember(channelId: string, intraId:string): Promise<MemberShip | undefined> {
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
async function getChannelMessages(channelId: string): Promise<ChannelMessage[] | []> {
  const res = await fetch(`http://localhost:3001/chat/channels/messages/${channelId}`,
    {
      method: "GET",
      credentials: "include"
    },
  );
  if (!res.ok){
    return [];
  }
  const messages = res.json();

  return messages;
}

const MemberCards = (props: any) => {
  const {members, currentMember} = props;
  return (
    <div className="space-y-2">
      {
        members?.filter((member:MemberShip)=>member.memberId !== currentMember?.memberId).map((member: any, index: number) => (
          <MemberCard key={index} member={member} currentMember={currentMember} />
        )
        )
      }
    </div>
  )
}
const ChannelAvatar = ({ firstMembers }: any) => {
  return (
    <AvatarGroup className="justify-center items-center ">
      {firstMembers &&
        firstMembers.map((member: MemberShip, index: number) => (
          <Avatar key={index} src={member.Avatar} ></Avatar>
        ))
      }
      <Avatar>+N</Avatar>
    </AvatarGroup>
  )
}
const ChannelDashBoard = (props: any) => {
  const [query, setQuery] = useState('');
  const [members, setmembers] = useState<MemberShip[] | []>();
  const {firstMembers , channelId, currentMember} = props;
  const context = useAppContext();
  useEffect(() => {
    const fetchAvatar = async () => {
      const members = await getChannelFirstMembers(channelId);
    }
    fetchAvatar();
  }, [channelId])
  useEffect(() => {
    const search = async () => {
        const members = await searchMember(query, channelId); 
        setmembers(members);
    }
      query && search();
  }, [query])
  const handleQuery = (event: any) => {
    event.preventDefault(); // Fix the typo here
    setQuery(event.target.value);
  };
  console.log('member');
  return (
    <div className="flex flex-col w-full  lg:w-1/5 overflow-hidden border border-[#292D39]">
      <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("conversation")} />
      <div className="p-4 mt-20 flex flex-col justify-center items-center ">
        {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}
        <div className="flex flex-row p-3 space-x-3">
      <CiLogout onClick={()=>{
        console.log('leave the channel');
      }} className="text-red-900   hover:scale-125" />
      <CiSettings className="text-white hover:scale-125" 
                  onClick={()=>{
                    console.log('change the channel Settings');
                  }}
      />
      </div>
      </div>
      <div className='justify-center items-center text-white  border border-[#292D39] p-4'>
        <h1 className="text-center">{channelId}</h1>
      </div>
      <div className="info-card text-white p-4 m-5border border-[#292D39] ">
        <h1 className="text-start"> Members :</h1>
      </div>
      <div className=" text-white p-4 w-full">
        <label className="">
          <input
            id="searchField"
            name={`inputValue${Math.random()}`}
            type="text"
            value={query}
            placeholder="Search for a member ..."
            onChange={handleQuery}
            className="  bg-[#1E2028] w-full items-center justify-center p-2 rounded-lg border border-[#292D39]   text-sm outline-none text-white"
          />
        </label>
      </div>
      <div className="p-3 h-2/5 overflow-hidden scroll-m-0">
        {members && <MemberCards members={members} currentMember={currentMember} />}
      </div>
    </div>
  );
}

const ChannelRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [channel, setChannel] = useState<Channel | undefined>();
  const [messages, setMessages] = useState<ChannelMessage[] | []>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [currentMember, setCurrentMember] = useState<MemberShip | undefined>();
  const [loading, setLoading] = useState(false);
  const context = useAppContext();
  const [firstMembers, setFirstMembers] = useState<MemberShip[] | []>();
  useEffect(() => {
    const fetchAvatar = async () => {
      const members = await getChannelFirstMembers(params.channelId);
      setFirstMembers(members);
      if (!context.socket){

      }
    }
    fetchAvatar();
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!context.userData) {
          const userData: User | undefined = await getCurrentUser();
          if (userData === undefined) {
            throw ('you need to login first');
          }
          context.setUserData(userData);
        }
        if (channel===undefined || !channel){

          const chan: Channel | undefined = await getChannel(params.channelId);
          if (chan === undefined || !chan) {
            throw ('no such channel')
          }
          setChannel(chan);
        }
        const userMemberShip = await getCurrentMember(params.channelId, context.userData.intraId );
        if (userMemberShip === undefined)
        {
          return;
        }
        setCurrentMember(userMemberShip);
        if (!context.socket || context.socket === undefined)
        {
          const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
          const cookie = new Cookies();
          const newSocket = io(chatNameSpace, {
            query: { user: cookie.get('jwt') },
          });
          context.setSocket(newSocket);
        }
        const ChannelMessages = await getChannelMessages(params.channelId);
        if (ChannelMessages) {
          setMessages(ChannelMessages);
        }
        loading? setLoading(false):true;
      }
      catch (e) {
        e === "you need to login first"
          ? toast.error("you need to login first")
          : e === "no such channel"
            ? toast.error("no such channel") : true;
      }
    }
    if (!context.socket) {
      const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
      const cookie = new Cookies();
      const newSocket = io(chatNameSpace, {
        query: { user: cookie.get('jwt') },
      });
      context.setSocket(newSocket);
    }
    fetchData();
    if (context.socket){
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
      }
    };
  }, [context.socket])
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
  console.log('what the fuck');
  const channelName = channel!==undefined? channel?.name.replace(channel.ownerId,''): '';
  return (
    <>
      <div className=" min-h-screen w-screen  bg-[#12141A]">
        <Navbar isProfileOwner={false} />
        <div className="flex ">
          {context.isSidebarVisible && (
            <div className="w-16 custom-height ">
              <div
                className={`transition-all duration-500 ease-in-out ${context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
                  }`}
              >
                <Sidebar />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <div className="flex custom-height">
              <Conversations />
              <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height">
                <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
                  <div className="relative flex items-center space-x-4">
                    <div className="relative p-4">
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
                        {/* <span className="font-bold hidden sm:block">Send</span> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ChannelDashBoard currentMember={currentMember} firstMembers={firstMembers} channelId={params.channelId} />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  )
}

export default ChannelRoom;