import { useEffect, useState } from "react";
import { User, useAppContext } from "../AppContext";
import { Loading } from "../components/Loading";
import Link from "next/link";
import Image from "next/image";



const ConversationCard = ({ room }: any) => {
    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState(true);
    const context = useAppContext();
    const roomName = room.name;
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response3 = await fetch(`http://localhost:3001/users/${room.participantsIds[0]}`, {
            method: "GET",
            credentials: "include",
          });
          const recp: User | undefined = await response3.json();
          if (recp === undefined) {
            setLoading(false)
            return
          }
          setUser(recp);
          setLoading(false);
        }
        catch (e) {
          console.log(e);
        }
      }
      fetchUser();
    }, [room])
    if (loading || user === undefined) {
      return (
        <div>loading....</div>
      )
    }
    // const users = context.friendsData.friends.find((user:User) => user.intraId === room.participantsIds[0]);
    return (
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomName}`}
      >
        <div onClick={() => {
          context.setRecipientLogin(user.intraId);
          context.setComponent('conversation');
        }
        } className="flex items-center p-3 text-xs h-max
        my-1 hover:bg-gray-800 rounded ">
          <div className="flex  flex-col space-y-2 text-white  max-w-xs mx-2 order-2 items-start">
            <div><span >{user?.login}</span></div>
            {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
          </div>
          <Image width={50} height={50} src={user?.Avatar} alt="My profile" className="w-10 sm:w-10 h-10 sm:h-10 rounded-full" />
        </div>
      </Link>
    );
  }

  export default ConversationCard;