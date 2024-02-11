'use client';
import { useEffect } from 'react';
import io from 'socket.io-client';
import {useAppContext, User } from '../AppContext';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "universal-cookie";
import { getCurrentUser, getRooms } from "../utiles/utiles";
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
        if (message){
          // context.setMessageNum(() =>context. prevMessageNum + 1 );
        }
      })
    }
    return () => {
      if (context.socket) {

        context.socket.off('privateChat');
      }
    }
  }, [context.socket]);
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
    return () => {

      window.removeEventListener('resize', handleResize);
    }

  }, [context.component])
  return (
      <div className=" custom-height w-full   bg-[#12141A] ">
        <div className="flex ">
          <div className="flex-1 overflow-y-auto">
            <div className="flex custom-height">
              <Conversations />
              {context.responsive && <ConversationNotSelected />}
            </div>
          </div>
        </div>
        {/* <Toaster /> */}
      </div>
  );
};


export default Chat;