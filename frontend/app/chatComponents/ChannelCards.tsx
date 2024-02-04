import { useEffect, useState } from "react";
import { Channel, User, useAppContext } from "../AppContext";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@mantine/core";
import { RiWechatChannelsLine } from "react-icons/ri";



const ChannelCards = () => {
    const [channels, setChannels] = useState<Channel[] | []>();
    const [loading, setLoading] = useState(true);
    const context = useAppContext();
    useEffect(() => {
      const fetchChannels = async () => {
        try {
          const response3 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channelsRoom/${context.userData.intraId}`, {
            method: "GET",
            credentials: "include",
          });
          const channels: Channel[] | [] = await response3.json();
          if (!channels) {
            setLoading(false)
            return
          }
          setChannels(channels);
          setLoading(false);
        }
        catch (e) {
          console.log(e);
        }
      }
      fetchChannels();
    }, [context.userData, context.component])
    if (loading) {
      return (
        <div>loading....</div>
      )
    }
    // const users = context.friendsData.friends.find((user:User) => user.intraId === room.participantsIds[0]);
    return (
        <>
        {channels && 
            channels.map((channel)=>(
                <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels/${channel.id}`}
                key={channel.id}
                >
        <div onClick={() => {
            context.setChannel(channel);
            context.setComponent('conversation');
        }
    } className="flex items-center p-3 text-xs h-max
    my-1 hover:bg-gray-800 rounded ">
          <div className="flex  flex-col space-y-2 text-white  max-w-xs mx-2 order-2 items-start">
            <div><span >{channel?.name}</span></div>
            {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
          </div>
          <RiWechatChannelsLine size={"40"} className='text-white' />
          {/* <Image width={50} height={50} src={user?.Avatar} alt="My profile" className="w-10 sm:w-10 h-10 sm:h-10 rounded-full" /> */}
        </div>
      </Link>
            ))
    }
        </>
    );
  }

  export default ChannelCards;