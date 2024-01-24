'use client';
import { FC, use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User, useAppContext, Message, Room, AppContextProps } from '@/app/AppContext';
import { Conversations, PermissionDenied, getRooms } from '../page';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { Navbar } from '@/app/components/Navbar';
import { Sidebar } from '@/app/components/Sidebar';
import { Loading } from '@/app/components/Loading';
import { FaCircle } from 'react-icons/fa';
import { Friend } from '@/app/components/Friend';
import { IoMdArrowBack } from "react-icons/io";
import { Avatar, Indicator } from '@mantine/core';
import { FaCircleArrowDown } from "react-icons/fa6";

interface PageProps {
  params: {
    roomId: string
  }
}

const Mytoast = (props:any) => {
 
   let {message , user} = props;
   message = message.length > 30 ? message.substring(0, 25) + '....':message;
  return (
    toast.custom((t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={user?.Avatar}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user.login}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ))
  )
}

const UserProfileImage = ({
  status,
  isProfileOwner,
  src,
  intraId,
}: {
  status: string | undefined;
  isProfileOwner: boolean;
  src: string;
  intraId: string | undefined;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 "
    >
      <div
        className=" flex justify-center items-center border-white border-y-4 border-x-4 rounded-full"
        style={{ position: "relative", display: "inline-block" }}
      >
        <Image
          src={src}
          alt="image Preview"
          width={120}
          height={120}
          className="rounded-full border-2 border-black w-40 h-40  "
          onError={(e: any) => {
            e.target.onerror = null;
          }}
        />
      </div>
    </div>
  );
};

const ProfileInfo = ({ recipient }: any) => {
  const context = useAppContext();
  return (
    <div className="flex flex-col border border-[#292D39]  w-full h-full  lg:w-2/5 overflow-hidden  items-center p-4">
      <div className='w-full '>
      <IoMdArrowBack style={{'display':!context.responsive ? "":"none"}} className=" text-white w-8 h-8 hover:cursor-pointer hover:scale-110 " onClick={() => context.setComponent("conversation")} />
      </div>
      <div className=''>
      <UserProfileImage
        status={"ONLINE"}
        isProfileOwner={false}
        src={recipient?.Avatar}
        intraId={recipient?.intraId}
        />
      <Friend
        isProfileOwner={false}
        friendId={recipient?.intraId}
        userId={context.userData?.intraId}
        />
        </div>
      <div className='flex flex-col  justify-center mt-4 items-center  px-1 w-3/4 h-fit bg-[#1a1d24] rounded border border-[#292D39] p-2'>
        <div  className='flex flex-col   w-11/12 '>
          <h1 className='text-white p-2 text-base'>Login </h1>
          <p className=' text-white px-2 pb-1'>{recipient?.login}</p>
        </div>
        <div className='flex flex-col border-t border-[#292D39] w-11/12'>
          <h1 className=' text-white p-2 text-base '>Full name </h1>
          <p className='text-white px-2 pb-1'>{recipient?.fullname}</p>
        </div>
        <div className='flex flex-col border-t border-[#292D39]   w-11/12'>
          <h1 className='text-white p-2 text-base '>Member since </h1>
          <p className='text-white px-2 pb-2'>{extractDate(recipient?.created_at)}</p>
        </div>
      </div>

    </div>
  );
}
export const SingleMessageReceived = (props: any) => {
  const { message, recipient } = props;
  return (
    <div className="flex items-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message}</span></div>
      </div>
      <Image width={24} height={24} src={recipient?.Avatar} alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
};
export const SingleMessageSent = ({ message }: any) => {
  const context = useAppContext();
  return (
    <div className="flex items-end justify-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message}</span></div>
      </div>
      <Image width={24} height={24} src={context.userData?.Avatar} alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
}

async function getMessages(userId: string, page:number): Promise<any> {
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

const PrivateRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [permission, setPermission] = useState<boolean>(true);
  const [recipient, setRecipient] = useState<User>(); // Provide a type for the recipient state
  const [loading, setLoading] = useState<boolean>(true);
  const [messageLoading, setMessageLoading] = useState<boolean>(true);
  const [noMoreData, setNoMoreData] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [page, setPage] = useState(2);
  const context = useAppContext();
  const fetchDataAndSetupSocket = async () => {
    try {
      const userData: User | undefined = await getCurrentUser();
      if (userData === undefined || !params.roomId.includes(userData.intraId)) {
        setPermission(false);
        setLoading(false);
        return;
      }
      context.setUserData(userData);
      const recp = params.roomId.replace(userData.intraId, '');
      const user: User | undefined = await getUser(recp);
      const roomid = user !== undefined ? parseInt(user.intraId) > parseInt(userData.intraId) ? user.intraId + userData.intraId : userData.intraId + user.intraId : 1;
      if (user === undefined || params.roomId !== roomid || user.intraId === userData.intraId) {
        setPermission(false);
        setLoading(false);
        return;
      }
      setRecipient(user);
      context.setRecipientLogin(recp);
      const rooms = await getRooms(userData.intraId);
      if (rooms === undefined)
      {
        setPermission(false);
        setLoading(false);
        return;
      }
      context.setRooms(rooms);
      const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
      if (!context.socket) {
        const cookie = new Cookies();
        const newSocket = io(chatNameSpace, {
          query: { user: cookie.get('jwt') },
        });
        context.setSocket(newSocket);
      }
      if (user.intraId && context.socket && userData.intraId) {
        context.socket?.emit('createPrivateRoom', { user1: userData.intraId, user2: user.intraId, clientRoomid: params.roomId });
      }
    } catch (error) {
      // setPermission(false);
      // setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const user: User | undefined = await getUser(context.recipientUserId);
      const roomid = user !== undefined ? parseInt(user.intraId) > parseInt(context.userData.intraId) ? user.intraId + context.userData.intraId : context.userData.intraId + user.intraId : 1;
      if (user === undefined || params.roomId !== roomid) {
        setPermission(false);
        setLoading(false);
        return;
      }
      setRecipient(user);
      const dataMessages = await getMessages(params.roomId, 1);
      if (dataMessages) {
        if (dataMessages.response !== "no such room") {
          setMessages(dataMessages);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrivateChat = (message: Message) => {
    if (message.PrivateRoomName === params.roomId) {
      setMessages((prevMessages: Message[]) => {
        const newMessages = Array.isArray(prevMessages) ? [message, ...prevMessages] : [];
        return newMessages;
      });
    }
  };
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
    fetchDataAndSetupSocket();
    if (context.socket && permission) {
      fetchData();
      context.socket.on('privateChat', (message: any) => {
        handlePrivateChat(message);
        fetchDataAndSetupSocket();
        if (message.senderId !== context.userData.intraId) {
          // const props = {message:message.content, user:context.userData}
          // Mytoast(props);
        }
      });
    }
    setLoading(false);
    // Cleanup function
    return () => {
      if (context.socket) {
        context.socket.off('privateChat');
      }
    };
  }, [context.socket]);
  // useEffect(() => {
  //   console.log('hereeeee');
  //   const scrollPosition = window.scrollY;
  //   console.log('Scroll Position:', scrollPosition);
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [loading]);
  // const chatContainerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (myElementRef.current) {
  //     const elementHeight = myElementRef.current.clientHeight;
  //     console.log('Element Height:', elementHeight);
  //   }
  // }, []);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      
      window.removeEventListener('resize', handleResize);
    }
    
  }, [context.component])
  
  useEffect(()=>{
    const updateUser= async ()=>{
      const recp = await getUser(context.recipientUserId);
      setRecipient(recp);
    }
    if(context.socket)
    {
      context.socket.on("update", () => {
        updateUser();
        });
      
    }
  },[context.socket]);
  useEffect(()=>{

  },[])
  const sendPrivateMessage = () => {
        console.log('socket',context.socket);
        console.log('recipient',context.recipientUserId );
        console.log(messageText.trimStart().trimEnd());
        if (context.socket && context.recipientUserId && messageText.trimStart().trimEnd()) {
          const cookie = new Cookies();
            const jwt = cookie.get('jwt');
            console.log('ssssss');
          context.socket.emit('privateChat', { to: context.recipientUserId, message: messageText.trimStart().trimEnd(), jwt});
          setMessages((prevMessages: Message[]) => {
            const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
            let currentDateVariable: Date = new Date();
    
            const singleMsg: Message = {
              id: 0,
              sender: context.userData?.intraId,
              recipient: context.recipientUserId,
              content: messageText,
              createdAt: currentDateVariable,
              PrivateRoomName: params.roomId,
            };

            return[singleMsg,...newMessages];
          }
          );
          setMessageText('');
        }
      };
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      sendPrivateMessage();
    }
  }

  // const fetchNewMessges=async()=>{
  //   try{
  //   setLoading(true);
  //   const data = await getMessages(context.userData.intraId, page);
  //   console.log('i m here')
  //   if (data){
  //     setMessages((prevMessages: Message[]) => {
  //       const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
  //       let currentDateVariable: Date = new Date();

  //       const singleMsg: Message = {
  //         id: 0,
  //         sender: context.userData?.intraId,
  //         recipient: context.recipientUserId,
  //         content: messageText,
  //         createdAt: currentDateVariable,
  //         PrivateRoomName: params.roomId,
  //       };

  //       newMessages.push(singleMsg);

  //       return newMessages;
  //     }
  //     );
  //   }
  //   setPage((prevPage) => prevPage + 1);
  //   }
  //   catch(e){
  //     console.log(e)
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // }
  // const handleScroll = () => {
  //   console.log('this is me');
  //   const scrollY = window.scrollY;
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;
  //   if (scrollY + windowHeight >= documentHeight - 200 && !loading) {
  //     fetchNewMessges();
  //   }
  // };

  /* this is the start*/
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      console.log('the scrollTop', scrollTop);
      console.log('the scrollHeight', scrollHeight);
      console.log('the client height', clientHeight);
      console.log('result', scrollHeight - clientHeight);
      if (scrollTop <= -(scrollHeight - clientHeight - 0.5) && !messageLoading && noMoreData) {
        setLastScrollPosition(scrollTop);
        console.log('i m right here')
        fetchNewMessages(scrollTop);
      }
    }
  };

  const fetchNewMessages = async (scrollTop:number) => {
    try {
      setLoading(true);
      const data = await getMessages(params.roomId, page);
      if (data) {
        data.length < 20 ? setNoMoreData(false):true;
        setMessages((prevMessages: Message[]) =>
        {
          return [...prevMessages,...data];
        }
        
        );
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching new messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attach scroll event listener to the chat container
    console.log('referevce for good');
    console.log(chatContainerRef.current);
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = lastScrollPosition;
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatContainerRef.current]);
  /* this is the end*/
  const desplayedMessages: Message[] = messages.length ? messages : [];
  if (loading) {
    return (
      <h1>
        loading....
      </h1>
    )
  }
  console.log('this is the chat');
  return (
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
        <div className="flex-1 overflow-y-auto custom-height ">
          <div className="flex custom-height">
            {context.responsive
              ? <Conversations />
              : context.component === "messages" && <Conversations />
            }
            {permission &&
              (
                context.responsive
                  ?
                  <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height ">
                    <div className="flex sm:items-center justify-between  bg-slate-900  border border-[#292D39] rounded ">
                      <div className="relative flex items-center space-x-4">
                        <div
                        className='p-2'
                        >
                          {recipient?.status === "ONLINE" 
                          ? 
                          <Indicator inline size={16} offset={7} position="bottom-end" color={recipient?.status == "ONLINE" ? "green" : "none" } withBorder >
                          <Avatar
                            size="lg"
                            radius="xl"
                            src={recipient.Avatar}
                          />
                        </Indicator>
                          : ( recipient && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />)
                          }
                        </div>
                        <div className="flex flex-col leading-tight">
                          <div className="text-2xl mt-1 flex items-center">
                            <span className="text-white mr-3">{recipient?.login}</span>
                          </div>
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
                        </div>
                      </div>
                    </div>
                    <div ref={chatContainerRef} className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {desplayedMessages?.map((msg: any, index) => (
                        (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                        (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
                      ))}
                    </div>
                    { page > 3 &&
                      <div className=' flex justify-center items-center w-full border'>
                       <FaCircleArrowDown size={"30"} className='text-white hover:scale-90' />
                    </div>
                    }
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
                          <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                            {/* <span className="font-bold hidden sm:block">Send</span> */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  : context.component === "conversation"
                  && <div className="flex-1   lg:flex  justify-between flex flex-col custom-height ">
                    <div className="flex sm:items-center justify-between  bg-slate-900 ">
                      <div className="relative flex items-center space-x-4">
                        <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:scale-110  justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
                        <div
                        className='p-2'
                        onClick={()=>context.setComponent("profile")}
                        >
                          {recipient?.status === "ONLINE" 
                          ? 
                          <Indicator inline size={16} offset={7} position="bottom-end" color={recipient?.status == "ONLINE" ? "green" : "none" } withBorder >
                          <Avatar
                            size="lg"
                            radius="xl"
                            src={recipient.Avatar}
                          />
                        </Indicator>
                          : ( recipient && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />)
                          }
                        </div>
                        <div className="flex flex-col leading-tight">
                          <div className="text-2xl mt-1 flex items-center">
                            <span className="text-white mr-3">{recipient?.login}</span>
                          </div>
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
                        </div>
                      </div>
                    </div>
                    <div  ref={chatContainerRef}  className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {desplayedMessages?.map((msg: any, index) => (
                        (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                        (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
                      ))}
                    <FaCircleArrowDown size={"100"} className='text-white' />
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
                          <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                            {/* <span className="font-bold hidden sm:block">Send</span> */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              )
            }
            {!permission && <PermissionDenied />}

            {permission
              &&
              (context.responsive
                ? <ProfileInfo recipient={recipient} />
                : context.component === "profile" && <ProfileInfo recipient={recipient} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}


function extractDate(isoDateString: string): string | null {
  if (!isoDateString)
  {
    return null;
  }
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date format");
    return null;
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export default PrivateRoom;





