'use client'
import { FC, useEffect, useState } from "react"
import { Channel, ChannelMessage, User, useAppContext } from "@/app/AppContext"
import Cookies from "universal-cookie"
import { io } from "socket.io-client"
import { SingleMessageReceived, SingleMessageSent, getCurrentUser, getUser } from "../../[roomId]/page"
import { Loading } from "@/app/components/Loading"
import toast, { Toaster } from "react-hot-toast"
import { Navbar } from "@/app/components/Navbar"
import { Sidebar } from "@/app/components/Sidebar"
import { Conversations } from "../../page"

interface PageProps {
  params: {
    channelId: string
  }
}
async function getChannel(channelId: string): Promise<Channel | undefined> {
  const res = await fetch(`http://localhost:3001/chat/channel/${channelId}`, {
    method: "GET",
    credentials: "include",
  });
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
  const messages = res.json();

  return messages;
}
const ChannelRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [channel, setChannel] = useState<Channel | undefined>();
  const [messages, setMessages] = useState<ChannelMessage[] | []>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const context = useAppContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (context.userData) {
          const userData: User | undefined = await getCurrentUser();
          if (userData === undefined) {
            throw ('you need to login first');
          }
          context.setUserData(userData);
        }
        const chan: Channel | undefined = await getChannel(params.channelId);
        if (chan === undefined) {
          throw ('no such channel')
        }
        setChannel(chan);
        const ChannelMessages = await getChannelMessages(params.channelId);
        if (ChannelMessages) {
          console.log(ChannelMessages);
          setMessages(ChannelMessages);
        }
        if (!context.socket) {
          const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
          const cookie = new Cookies();
          const newSocket = io(chatNameSpace, {
            query: { user: cookie.get('jwt') },
          });
          context.setSocket(newSocket);
        }
        setLoading(false);
      }
      catch (e) {
        e === "you need to login first"
          ? toast.error("you need to login first")
          : e === "no such channel"
            ? toast.error("no such channel") : true;
      }
    }
    fetchData();
  }, [])
  const broadCastMessage = () => {
    if (context.socket && channel && messageText.trimStart().trimEnd()) {

      context.socket.emit('channelBroadcast', { to: channel.name, message: messageText, senderId: context.userData });
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
                    <div className="relative">
                      {/* <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span> */}
                      {/* {recipient !== undefined && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />} */}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-2xl mt-1 flex items-center">
                        <span className="text-white mr-3">{channel?.name}</span>
                      </div>
                      {/* <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span> */}
                    </div>
                  </div>
                </div>
                <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {desplayedMessages?.map((msg: any, index: number) => (
                    (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
                    (msg.sender !== context.userData?.intraId && channel ? <SingleMessageReceived key={index} message={msg.content} /> : null)
                  ))}
                </div>
                <div className=" ">
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
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  )
}

export default ChannelRoom;