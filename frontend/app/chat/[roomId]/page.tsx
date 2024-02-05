'use client';
// import '@mantine/core/styles.css';
import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User, useAppContext, Message} from '@/app/AppContext';
import { io } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { IoMdArrowBack } from "react-icons/io";
import { Avatar, Indicator, MantineProvider } from '@mantine/core';
import { SingleMessageSent } from '@/app/chatComponents/SingleMessageSent';
import { SingleMessageReceived } from '@/app/chatComponents/SingleMessageReceived';
import ProfileInfo from '@/app/chatComponents/ProfileInfo';
import { getCurrentUser, getMessages, getRooms, getUser } from '@/app/utiles/utiles';
import Conversations from '@/app/chatComponents/Converstions';
import PermissionDenied from '@/app/chatComponents/PermissionDenied';

interface PageProps {
  params: {
    roomId: string
  }
}

const PrivateRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [permission, setPermission] = useState<boolean>(true);
  const [recipient, setRecipient] = useState<User>(); // Provide a type for the recipient state
  const [loading, setLoading] = useState<boolean>(true);
  const [noMoreData, setNoMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const context = useAppContext();
  const fetchDataAndSetupSocket = async () => {
    try {
      const userData: User | undefined = !context.userData ? await getCurrentUser() : context.userData;
      if (userData === undefined || !params.roomId.includes(userData.intraId)) {
        setPermission(false);
        setLoading(false);
        return;
      }
      !context.userData ? context.setUserData(userData) :context.userData;
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
      setPermission(false);
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const dataMessages = await getMessages(params.roomId, 0);
      if (dataMessages) {
        if (dataMessages.response !== "no such room") {
          setMessages(dataMessages);
        }
      }
      setLoading(false);
    } catch (error) {
      setPermission(false);
      setLoading(false);
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
    context.setMessageNum(0);
    if (context.socket && permission) {
      fetchData();
      context.socket.on('privateChat', (message: any) => {
        handlePrivateChat(message);
        fetchDataAndSetupSocket();
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
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      
      window.removeEventListener('resize', handleResize);
    }
    
  }, [context.component])
  
  const sendPrivateMessage = () => {
        if (context.socket && context.recipientUserId && messageText.trimStart().trimEnd()) {
          const cookie = new Cookies();
            const jwt = cookie.get('jwt');
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

            return [singleMsg,...newMessages];
          }
          );
          setMessageText('');
        }
      };
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      sendPrivateMessage();
      chatContainerRef.current?.scrollTo(0,0);
    }
  }
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll =  () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollTop <= -(scrollHeight - clientHeight -1)  && noMoreData) {
        fetchNewMessages();
      }
    }
  };

  const fetchNewMessages = async () => {
    try {
      const data = await getMessages(params.roomId, page);
      if (data) {
        data.length < 30 ? setNoMoreData(false):true;
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
      if (chatContainerRef.current){
      }
    }
  };

  const desplayedMessages: Message[] = messages.length ? messages : [];
  if (loading) {
    return (
      <h1>
        loading....
      </h1>
    )
  }
  return (
    // <MantineProvider>
    <div className=" w-full  bg-[#12141A]">
      <div className="flex ">
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
                          : ( recipient &&
                          // <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                          // />
                          <Image
                          unoptimized={true}
                          src={recipient.Avatar}
                          alt="user avatar"
                          width={144}
                          height={144}
                          priority={true}
                          quality={100}
                          className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src =
                              'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
                          }}
                        />
                          )
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
                    <div
                      ref={chatContainerRef}
                      onScroll={()=>{
                        handleScroll();
                      }
                    }
                    className="chat-message  z-40 h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {desplayedMessages?.map((msg: any, index) => (
                        (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                        (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
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
                    <div
                      ref={chatContainerRef}
                      onScroll={()=>{
                        handleScroll();
                      }
                    }
                    className="chat-message z-40  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {desplayedMessages?.map((msg: any, index) => (
                        (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                        (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
                      ))}
                    {
                      
                    }
                    
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
                          <button
                          type="button"
                          style={{ display: messageText.length ? "" : "none" }}
                          onClick={()=>{
                            sendPrivateMessage();
                            chatContainerRef.current?.scrollTo(0,0);
                          }
                        }
                          className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                          >
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
    // </MantineProvider>
  );
}

export default PrivateRoom;





