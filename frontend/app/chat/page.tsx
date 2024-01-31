// components/Chat.tsx
'use client';
import { BiConversation } from "react-icons/bi";
import { useEffect, useState, useRef, useContext, use } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { Room, useAppContext, User } from '../AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { CgDanger } from "react-icons/cg";
import Link from "next/link";
import { useDisclosure } from '@mantine/hooks';
import { BackgroundImage, Modal } from '@mantine/core';
import { IoMdAdd } from "react-icons/io";
import Cookies from "universal-cookie";
import { Loading } from "../components/Loading";
import { useToggle } from '@mantine/hooks';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { Badge, Button, Center, Group, Text } from '@mantine/core';
import { CiSearch } from "react-icons/ci";
import { getCurrentUser, getRooms } from "../utiles/utiles";
import FindAConversation from "../chatComponents/FindAConversation";
import Conversations from "../chatComponents/Converstions";
import ConversationNotSelected from "../chatComponents/ConversationNotSelected";

const Chat = () => {
  const context = useAppContext();
  const fetchDataAndSetupSocket = async () => {
    try {

      const userData: User | undefined = await getCurrentUser();
      if (userData === undefined) {
        return;
      }
      context.setUserData(userData);
      const rooms = await getRooms(userData.intraId);
      if (rooms === undefined) {
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
      if (context.recipientUserId && context.socket) {
        context.socket?.emit('createPrivateRoom', { user1: context.userData?.intraId, user2: context.recipientUserId });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  useEffect(() => {
    fetchDataAndSetupSocket();
      if (context.socket) {

        context.socket?.on('privateChat', (message: any) => {
          fetchDataAndSetupSocket();
          const msg = message.content;

          toast.success(`you have a new message : ${msg}`);
        })
      }
      return ()=>{
        if (context.socket){

          context.socket.off('privateChat');
        }
      }
  }, [context.socket]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 950) {
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
  console.log('this is the chat');
  return (
    <div className=" custom-height w-screen  bg-[#12141A] ">
      <div className="flex ">
        <div className="flex-1 overflow-y-auto">
          <div className="flex custom-height">
            <Conversations />
            {context.responsive && <ConversationNotSelected />}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};


export default Chat;