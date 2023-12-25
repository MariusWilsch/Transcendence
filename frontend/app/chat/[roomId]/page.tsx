'use client';
import {FC} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { User } from '@/app/AppContext';
import { get } from 'http';

interface Message {
    sender: string;
    recipient :String
    content    :String
    message: string;
}
interface Room {
    id: number;
    name: string;
    paraticipants: string[];
    participants: User[];
    messages: Message[];
}

interface PageProps {
    params: {
        roomId: string
        }
}

async function getRoom(roomId:string):Promise<Room> {
    const res = await fetch(`http://localhost:3001/api/privateRoom/${roomId}`);
    const room = await res.json();
    return room;
}
const  PrivateRoom :FC<PageProps> = ({params}:PageProps) => {
    const room:Promise<Room> = getRoom(params.roomId);
    
    return (
        <div className="flex-1 p:2  md:hidden lg:flex sm:p-6 justify-between flex flex-col h-screen">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span style={{ display: "" }} className="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
              <Image width={144} height={144} src="https://cdn.intra.42.fr/users/b3084a191fa21003419890965f63f753/zessadqu.jpg" alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">Zessadqu</span>
              </div>
              <span style={{ display: "" }} className="text-lg text-gray-600">Actif</span>
            </div>
          </div>
        </div>
        <div className="chat-message border-8 h-screen  flex flex-col p-2 overflow-x-auto overflow-y-auto">
          {room.messages.map((msg, index) => (
            (msg.sender == currentUser?.intraId && <SingleMessageSent message={msg.message} />) || (msg.sender != userData?.intraId && <SingleMessageReceived message={msg.message} />)
          ))}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Write your message!"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
              </button>
              <button type="button" onClick={sendPrivateMessage} className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                <span className="font-bold">Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    }

export default PrivateRoom;