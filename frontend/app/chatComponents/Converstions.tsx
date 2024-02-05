import { useEffect, useState } from "react";
import { Room, useAppContext } from "../AppContext";
import FindAConversation from "./FindAConversation";
import Toggle from "./Toggle";
import ConversationCard from "./ConversationCard";
import ChannelCards from "./ChannelCards";

const Conversations = () => {
    const context = useAppContext();
    const [selected, setSelected] = useState<string>('messages');
    const [aRooms, setARooms] = useState<Room[] | []>([]);
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const activeRoom = Array.isArray(context.rooms)
            ? context.rooms.map((room: Room) => {
              room.participantsIds = room.participantsIds.filter(
                (id: string) => id !== context.userData?.intraId
              );
              return room;
            })
            : [];
  
          const sortedRooms = activeRoom.sort((a: Room, b: Room) =>
            a.updated_at > b.updated_at ? -1 : 1
          );
          setARooms(sortedRooms);
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
  
      const handlePrivateChatEvent = () => {
        fetchRooms();
      };
      fetchRooms();
      if (context.socket) {
        context.socket.on('privateChat', handlePrivateChatEvent);
        return () => {
  
        };
      }
    }, [context.socket, context.rooms]);
    return (
      <>
      { context.userData &&
        <div className=" z-40 flex flex-col h-full p-4 w-full  lg:w-1/5 xl:1/5   text-white space-y-3 rounded  border border-[#292D39]">
        <FindAConversation />
        <div className='flex justify-center py-3'>
        {selected === "channels" && <div
        onClick={() => setSelected("messages")}
        className='h-8  text-gray-400 rounded overflow-hidden'
        >
        <Toggle val={"switch to messages"} />
        </div>}
        {selected === "messages" && <div
        className='h-8 text-gray-400 rounded overflow-hidden'
        onClick={() => setSelected("channels")}
        >
        <Toggle val={"switch to channels"} />
        </div>
      }
      </div>
      {
        selected === 'messages' &&
        <div>
          {aRooms?.map((room: any, index: any) => (
            <ConversationCard
            key={index}
            room={room}
            />
            )
            )}
            </div>
          }
          {
            selected == 'channels' && 
            <>
            <ChannelCards />
            </>
          }
          </div>
        }
        </>
          );
        };
        
  export default Conversations;