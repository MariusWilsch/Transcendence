// components/Chat.tsx
'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { useAppContext } from '../AppContext';
import PrivateRoom from './[roomId]/page';
import { Navbar, Sidebar } from '../profile/[intraId]/page';
import { Toaster } from 'react-hot-toast';

var data: User;
interface Message {
  sender: string;
  message: string;
}

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  created_at: Date;
  updated_at: Date;
};

const ConversationCard = ({ user }: any, {lastMessage}:any) => {
  const context = useAppContext();
  return (
    <div onClick={()=>context.setRecipientLogin(user.intraId)} className="flex items-center p-2 my-1 border-4">
      <div className="flex  flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span>{user?.login}</span></div>
        {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
      </div>
      <Image width={56} height={56} src={user.Avatar} alt="My profile" className="rounded-full order-1" />
    </div>
  );
}

const SearchStart = () => {
  return (
    <div className="flex items-center p-2 my-1 border-4">
      <input type='button' placeholder='find or start a new conversation' />
    </div>
  );
}
const Conversations = ({friends}:any) => {
  return (
    <div className="border w-1/5 flex flex-col  p-3">
    {/* <SearchStart /> */}
      <h1 className='text-center text-lg'>Conversations</h1>
      <div>
        {friends?.friends.map((friend:any, index:any) => (
          <ConversationCard key={index} user={friend} lastMessage={"last message"} />
        ))}
      </div>
    </div>
  );
};
const SingleMessageReceived = ({ message }: any, { user }: any) => {
  return (
    <div className="flex items-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{message}</span></div>
      </div>
      <Image width={24} height={24} src="https://cdn.intra.42.fr/users/b3084a191fa21003419890965f63f753/zessadqu.jpg" alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
}
const SingleMessageSent = ({ message }: any, { user }: any) => {
  return (
    <div className="flex items-end justify-end p-2 my-1">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message}</span></div>
      </div>
      <Image width={24} height={24} src="https://cdn.intra.42.fr/users/b3084a191fa21003419890965f63f753/zessadqu.jpg" alt="My profile" className="w-6 h-6 rounded-full order-1" />
    </div>
  );
}
// const Messages = () => {

//   return (
//     <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
//       <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
//         <div className="relative flex items-center space-x-4">
//           <div className="relative">
//             <span style={{ display: "" }} className="absolute text-green-500 right-0 bottom-0">
//               <svg width="20" height="20">
//                 <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
//               </svg>
//             </span>
//             <Image width={144} height={144} src="https://cdn.intra.42.fr/users/b3084a191fa21003419890965f63f753/zessadqu.jpg" alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
//           </div>
//           <div className="flex flex-col leading-tight">
//             <div className="text-2xl mt-1 flex items-center">
//               <span className="text-gray-700 mr-3">Zessadqu</span>
//             </div>
//             <span style={{ display: "" }} className="text-lg text-gray-600">Actif</span>
//           </div>
//         </div>
//       </div>
//       <div className="chat-message border-8 h-screen  flex  p-2 overflow-x-auto overflow-y-auto">
//         <SingleMessageReceived message={"khiiiiiiiiiiiiiar"} />
//         <SingleMessageSent message={"hi it s  me working on the chatApp"} />
//       </div>
//       <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
//         <div className="relative flex">
//           <input type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
//           <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
//             <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
//               </svg>
//             </button>
//             <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
//               </svg>
//             </button>
//             <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </button>
//             <button type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
//               <span className="font-bold">Send</span>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
//                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





const ProfileInfo = () => {
  return (
    <div className="border w-1/5 xl:hidden">
      <h1>Profile Info</h1>
    </div>
  );
}
const Chat = () => {
  const context = useAppContext();
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
        context.setFriends(friends);
        console.log("user data:", userData);
        // console.log("friends:", friends);
        const newSocket = io('http://localhost:3001', {
          query: { userId: userData.intraId },
        });
        context.setSocket(newSocket);
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
  }, [context.recipientUserId]);
  return (



    <div className=" min-h-screen w-screen bg-[#12141A]">
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
      <div className="flex border-4 custom-height">
      <Conversations friends={context.friendsData} />
      { context.recipientUserId && (parseInt(context.userData?.intraId) > parseInt(context.recipientUserId)
      ?<PrivateRoom  params={{roomId: context.userData?.intraId+context.recipientUserId}} />
      :<PrivateRoom  params={{roomId: context.recipientUserId + context.userData?.intraId}} />)}
      {/* <ProfileInfo></ProfileInfo> */}
    </div>
      </div>
    </div>
    <Toaster />
  </div>








  );
};


export default Chat;