'use client';
import { FC, use, useEffect, useState } from 'react';
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

interface PageProps {
  params: {
    roomId: string
  }
}

// const Mytoast = (message: string) => {
//   return (
//     toast.custom((t) => (
//       <div
//         className={`${t.visible ? 'animate-enter' : 'animate-leave'
//           } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//       >
//         <div className="flex-1 w-0 p-4">
//           <div className="flex items-start">
//             <div className="flex-shrink-0 pt-0.5">
//               <img
//                 className="h-10 w-10 rounded-full"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//                 alt=""
//               />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm font-medium text-gray-900">
//                 zaki essad
//               </p>
//               <p className="mt-1 text-sm text-gray-500">
//                 {message}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex border-l border-gray-200">
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     ))
//   )
// }

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
    <div className="border border-[#292D39]  w-full  lg:w-1/5 overflow-hidden">
      <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("conversation")} />
      <UserProfileImage
        status={"ONLINE"}
        isProfileOwner={false}
        src={recipient?.Avatar}
        intraId={recipient?.intraId}
      />
      <Friend
        isProfileOwner={false}
        userId={recipient?.intraId}
        friendId={context.userData?.intraId}
      />
      {/* <div className=' flex flex-col justify-center items-center text-white mt-8 ml-8 w-3/5 h-1/5  bg-black rounded-box'>
        <div className='flex flex-col border w-full'>
            <h1 className='p-2 text-2xl'>Username</h1>
            <p className='p-3 italic'> {recipient?.login}</p>
        </div>
        <div className='flex flex-col border w-full'>
            <h1 className='p-2 text-2xl italic'>Full Name</h1>
            <p className='p-3 italic'> {recipient?.fullname}</p>
        </div>
        <div className='flex flex-col border w-full'>
            <h1 className='p-2 text-2xl italic'>Member Since</h1>
            <p className='p-3 italic'> {extractDate(recipient?.created_at)}</p>
        </div>
      </div> */}
      <div className='flex flex-col justify-center items-center  mt-8 ml-8 w-3/5 h-fit bg-black rounded'>
        <div  className='flex flex-col   w-11/12 '>
          <h1 className='text-white p-2 text-base'>Username</h1>
          <p className=' text-white p-3 italic'>{recipient?.login}</p>
        </div>
        <div className='flex flex-col border-t border-[#292D39] w-11/12'>
          <h1 className=' text-white p-2 text-base italic'>Full Name</h1>
          <p className='text-white p-3 italic'>{recipient?.fullname}</p>
        </div>
        <div className='flex flex-col border-t border-[#292D39]   w-11/12'>
          <h1 className='text-white p-2 text-base italic'>Member Since</h1>
          <p className='text-white p-3 italic'>{extractDate(recipient?.created_at)}</p>
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

async function getMessages(userId: string): Promise<any> {
  const res = await fetch(`http://localhost:3001/chat/${userId}/messages`,
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
// const PrivateRoom: FC<PageProps> = ({ params }: PageProps) => {
//   const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
//   const [messageText, setMessageText] = useState('');
//   const [permission, setPermission] = useState<boolean>(true);
//   const [recipient, setRecipient] = useState<User>(); // Provide a type for the recipient state
//   const [loading, setLoading] = useState<boolean>(true);
//   const context = useAppContext();
//   let trigger = 1;
//   const fetchDataAndSetupSocket = async () => {
//     try {
//       if (!context.userData){
//         const userData: User | undefined = await getCurrentUser();
//         if (userData === undefined || !params.roomId.includes(userData.intraId)) {
//           setPermission(false);
//           setLoading(false);
//           console.log('user data lever');
//           return;
//         }
//         context.setUserData(userData);
//       }
//       if (!recipient)
//       {
//         const recp = params.roomId.replace(context.userData.intraId, '');
//         const user: User | undefined = await getUser(recp);
//         const roomid = user !== undefined ? parseInt(user.intraId) > parseInt(context.userData.intraId) ? user.intraId + context.userData.intraId : context.userData.intraId + user.intraId : 1;
//         if (user === undefined || params.roomId !== roomid || user.intraId === context.userData.intraId) {
//           setPermission(false);
//           setLoading(false);
//           console.log('recepient lever ');
//           return;
//         }
//         setRecipient(user);
//         context.setRecipientLogin(recp);
//       }
//       // const friends = await getUserFriends(userData.intraId);
//       // context.setFriends(friends);
//       const rooms = await getRooms(context.userData.intraId);
//       if (rooms ===undefined){
//         console.log('room data lever')
//         return;

//       }
//       context.setRooms(rooms);
//       if (recipient?.intraId && context.socket && context.userData.intraId) {
//         const cookie = new Cookies();
//         const jwt = cookie.get('jwt')
//         context.socket?.emit('createPrivateRoom', { jwt, user2: recipient.intraId, clientRoomid: params.roomId });
//       }
//     } catch (error) {
//       // setPermission(false);
//       // setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (!context.socket) {
//       const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
//       const cookie = new Cookies();
//       const newSocket = io(chatNameSpace, {
//         query: { user: cookie.get('jwt') },
//       });
//       context.setSocket(newSocket);
//     }
//     if (context.socket && permission) {
//       const fetchData = async () => {
//         try {
//           const user: User | undefined = await getUser(context.recipientUserId);
//           const roomid = user !== undefined ? parseInt(user.intraId) > parseInt(context.userData.intraId) ? user.intraId + context.userData.intraId : context.userData.intraId + user.intraId : 1;
//           if (user === undefined || params.roomId !== roomid) {
//             setPermission(false);
//             setLoading(false);
//             return;
//           }
//           setRecipient(user);
//           const dataMessages = await getMessages(params.roomId);
//           if (dataMessages) {
//             if (dataMessages.response !== "no such room") {
//               setMessages(dataMessages);
//             }
//           }
//           setLoading(false);
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       fetchData();
//       fetchDataAndSetupSocket();
//       context.socket.on('privateChat', (message: any) => {
//         if (message.PrivateRoomName === params.roomId)
//         {

//           setMessages((prevMessages: Message[]) => {
//             const newMessages = Array.isArray(prevMessages) ? [...prevMessages, message] : [];
//             return newMessages;
//           });
//         }
//         fetchDataAndSetupSocket();
//         if (message.senderId !== context.userData.intraId) {
//           // Mytoast(message.content);
//         }
//       });
//     }
//     console.log("it renders n-times");
//     setLoading(false);
//     // Cleanup function
//     return () => {
//       if (context.socket) {
//         context.socket.off('privateChat');
//       }
//     };
//   }, [context.socket, trigger]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 1030) {
//         context.setisSidebarVisible(false);
//         context.setResponsive(false);
//       }
//       else {
//         context.setisSidebarVisible(true);
//         context.setResponsive(true);
//       }
//     }
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     console.log('yes we can rerender');
//     return () => {

//       window.removeEventListener('resize', handleResize);
//     }

//   }, [context.component])
//   const sendPrivateMessage = () => {
//     console.log('socket',context.socket);
//     console.log('recipient',context.recipientUserId );
//     console.log(messageText.trimStart().trimEnd());
//     if (context.socket && context.recipientUserId && messageText.trimStart().trimEnd()) {
//       const cookie = new Cookies();
//         const jwt = cookie.get('jwt')
//         console.log('we are here00000000000');
//       context.socket.emit('privateChat', { to: context.recipientUserId, message: messageText.trimStart().trimEnd(), jwt});
//       setMessages((prevMessages: Message[]) => {
//         const newMessages = Array.isArray(prevMessages) ? [...prevMessages] : [];
//         let currentDateVariable: Date = new Date();

//         const singleMsg: Message = {
//           id: 0,
//           sender: context.userData?.intraId,
//           recipient: context.recipientUserId,
//           content: messageText,
//           createdAt: currentDateVariable,
//           PrivateRoomName: params.roomId,
//         };

//         newMessages.push(singleMsg);

//         return newMessages;
//       }
//       );
//       setMessageText('');
//     }
//   };
//   const handleKeyPress = (event: any) => {
//     if (event.key === 'Enter') {
//       sendPrivateMessage();
//     }
//   }
//   const desplayedMessages: Message[] = messages.length ? messages.toReversed() : [];
//   if (loading) {
//     return (
//       <Loading />
//     )
//   }
//   console.log('what a game');
//   return (
//     <div className=" min-h-screen w-screen  bg-[#12141A]">
//       <Navbar isProfileOwner={false} />
//       <div className="flex ">
//         {context.isSidebarVisible && (
//           <div className="w-16 custom-height ">
//             <div
//               className={`transition-all duration-500 ease-in-out ${context.isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
//                 }`}
//             >
//               <Sidebar />
//             </div>
//           </div>
//         )}
//         <div className="flex-1 overflow-y-auto custom-height ">
//           <div className="flex custom-height">
//             {context.responsive
//               ? <Conversations />
//               : context.component === "messages" && <Conversations />
//             }
//             {permission &&
//               (
//                 context.responsive
//                   ?
//                   <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height ">
//                     <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
//                       <div className="relative flex items-center space-x-4">
//                         <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
//                         <div
//                         >
//                           <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="absolute text-green-500 bottom-0 right-0">
//                             <svg width="20" height="20">
//                               <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
//                             </svg>
//                           </span>
//                           {recipient !== undefined && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />}
//                         </div>
//                         <div className="flex flex-col leading-tight">
//                           <div className="text-2xl mt-1 flex items-center">
//                             <span className="text-white mr-3">{recipient?.login}</span>
//                           </div>
//                           <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                       {desplayedMessages?.map((msg: any, index) => (
//                         (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
//                         (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
//                       ))}
//                     </div>
//                     <div className=" ">
//                       <div className="relative flex">
//                         <input
//                           type="text"
//                           placeholder="Write your message!"
//                           value={messageText}
//                           onChange={(e) => setMessageText(e.target.value)}
//                           onKeyDown={handleKeyPress}
//                           className="w-full focus:outline-none focus:placeholder-gray-400  placeholder-gray-600 pl-12  rounded-md p-3 bg-gray-800 text-white" />
//                         <div className="absolute right-0 items-center inset-y-0">
//                           <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
//                             </svg>
//                           </button>
//                           <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
//                             {/* <span className="font-bold hidden sm:block">Send</span> */}
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
//                               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   : context.component === "conversation"
//                   && <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height p-2">
//                     <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
//                       <div className="relative flex items-center space-x-4">
//                         <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
//                         <div
//                           className="relative hover:cursor-pointer"
//                           onClick={() => {

//                             context.setComponent("profile")
//                             console.log('locococo')
//                           }
//                           }
//                         >
//                           <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="absolute text-green-500 right-0 bottom-0">
//                             <svg width="20" height="20">
//                               <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
//                             </svg>
//                           </span>
//                           {recipient !== undefined && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />}
//                         </div>
//                         <div className="flex flex-col leading-tight">
//                           <div className="text-2xl mt-1 flex items-center">
//                             <span className="text-white mr-3">{recipient?.login}</span>
//                           </div>
//                           <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                       {desplayedMessages?.map((msg: any, index) => (
//                         (msg.sender === context.userData?.intraId && <SingleMessageSent key={index} message={msg.content} />) ||
//                         (msg.sender !== context.userData?.intraId && recipient ? <SingleMessageReceived key={index} recipient={recipient} message={msg.content} /> : null)
//                       ))}
//                     </div>
//                     <div className="p-4">
//                       <div className="relative flex">
//                         <input
//                           type="text"
//                           placeholder="Write your message!"
//                           value={messageText}
//                           onChange={(e) => setMessageText(e.target.value)}
//                           onKeyDown={handleKeyPress}
//                           className="w-full focus:outline-none focus:placeholder-gray-400  placeholder-gray-600 pl-12  rounded-md p-3 bg-gray-800 text-white" />
//                         <div className="absolute right-0 items-center inset-y-0">
//                           <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
//                             </svg>
//                           </button>
//                           <button type="button" style={{ display: messageText.length ? "" : "none" }} onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
//                             {/* <span className="font-bold hidden sm:block">Send</span> */}
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
//                               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//               )
//             }
//             {!permission && <PermissionDenied />}

//             {permission
//               &&
//               (context.responsive
//                 ? <ProfileInfo recipient={recipient} />
//                 : context.component === "profile" && <ProfileInfo recipient={recipient} />
//               )
//             }
//           </div>
//         </div>
//       </div>
//       <Toaster />
//     </div>
//   );
// }

const PrivateRoom: FC<PageProps> = ({ params }: PageProps) => {
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [messageText, setMessageText] = useState('');
  const [permission, setPermission] = useState<boolean>(true);
  const [recipient, setRecipient] = useState<User>(); // Provide a type for the recipient state
  const [loading, setLoading] = useState<boolean>(true);
  const context = useAppContext();
  let trigger = 1;
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
      // const friends = await getUserFriends(userData.intraId);
      // context.setFriends(friends);
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
  useEffect(() => {
    fetchDataAndSetupSocket();
    if (context.socket && permission) {
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
          const dataMessages = await getMessages(params.roomId);
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
      fetchData();
      const handlePrivateChat = (message: Message) => {
        if (message.PrivateRoomName === params.roomId) {
          setMessages((prevMessages: Message[]) => {
            const newMessages = Array.isArray(prevMessages) ? [...prevMessages, message] : [];
            return newMessages;
          });
        }
      };
      context.socket.on('privateChat', (message: any) => {
        handlePrivateChat(message);
        fetchDataAndSetupSocket();
        if (message.senderId !== context.userData.intraId) {
          // Mytoast(message.content);
        }
      });
    }
    console.log("it renders n-times");
    setLoading(false);
    // Cleanup function
    return () => {
      if (context.socket) {
        context.socket.off('privateChat');
      }
    };
  }, [context.socket, trigger]);

  useEffect(() => {
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
    handleResize();
    window.addEventListener('resize', handleResize);
    console.log('yes we can rerender');
    return () => {

      window.removeEventListener('resize', handleResize);
    }

  }, [context.component])
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
    
            newMessages.push(singleMsg);
    
            return newMessages;
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
  const desplayedMessages: Message[] = messages.length ? messages.toReversed() : [];
  if (loading) {
    return (
      <Loading />
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
                    <div className="flex sm:items-center justify-between p-2 bg-slate-900  border border-[#292D39] rounded ">
                      <div className="relative flex items-center space-x-4">
                        <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
                        <div
                        >
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="absolute text-green-500 right-0 bottom-0">
                            <svg width="20" height="20">
                              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                            </svg>
                          </span>
                          {recipient !== undefined && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <div className="text-2xl mt-1 flex items-center">
                            <span className="text-white mr-3">{recipient?.login}</span>
                          </div>
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                  && <div className="flex-1 p:2  lg:flex  justify-between flex flex-col custom-height p-2">
                    <div className="flex sm:items-center justify-between p-1 bg-slate-900 ">
                      <div className="relative flex items-center space-x-4">
                        <IoMdArrowBack className="text-white w-8 h-8 hover:cursor-pointer hover:w-10 hover:h-10  justify-center items-center xl:hidden" onClick={() => context.setComponent("messages")} />
                        <div
                          className="relative hover:cursor-pointer"
                          onClick={() => {

                            context.setComponent("profile")
                            console.log('locococo')
                          }
                          }
                        >
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="absolute text-green-500 right-0 bottom-0">
                            <svg width="20" height="20">
                              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                            </svg>
                          </span>
                          {recipient !== undefined && <Image width={144} height={144} src={recipient.Avatar} alt="user avatar" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <div className="text-2xl mt-1 flex items-center">
                            <span className="text-white mr-3">{recipient?.login}</span>
                          </div>
                          <span style={{ display: recipient?.status == "ONLINE" ? "" : "none" }} className="text-lg text-white">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="chat-message  h-screen  flex flex-col-reverse p-2 overflow-x-auto overflow-y-auto bg-slate-650  border-white scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
      <Toaster />
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





