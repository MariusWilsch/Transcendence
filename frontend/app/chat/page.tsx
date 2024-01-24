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
import { getCurrentUser } from "./[roomId]/page";

// const ChannelSection=()=>{
async function searchUsers(query: string) {
  const response = await fetch(`http://localhost:3001/chat/search?q=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

    });

  const data = await response.json();
  return data;
}

function FindAConversation() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<User[] | undefined>();
  const context = useAppContext();
  const roomIdExtractor = (user1: string, user2: string) => {
    return parseInt(user1) > parseInt(user2) ? user1 + user2 : user2 + user1;
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await searchUsers(query);
      data !== undefined
        ? setData(data)
        : setData([])
    }
    if (query) {
      fetchData();
    }
  }, [query]);
  // if (data ===undefined )
  // {
  //   setData([]);
  // };
  const items = data
    ?.map((item: User) => (
      <Link
        key={item.intraId}
        href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomIdExtractor(context.userData?.intraId, item.intraId)}`}
      >
        <Spotlight.Action key={item.intraId} onClick={() => {
          item.intraId != context.userData?.intraId ? context.setRecipientLogin(item.intraId) : 1;
          context.setComponent('conversation');
        }
        }
        >
          <Group wrap="nowrap" w="100%">
            {item.Avatar && (
              <Center>
                <Image src={item.Avatar} alt={item.login} width={50} height={50} className="w-16 h-16 rounded-full p-2" />
              </Center>
            )}

            <div style={{ flex: 1 }}>
              <Text>{item.fullname}</Text>

              {item.login && (
                <Text opacity={0.6} size="xs">
                  {item.login}
                </Text>
              )}
            </div>
            <Badge className="ml-auto" variant="default">{item.status}</Badge>
          </Group>
        </Spotlight.Action>
      </Link>
    ));

  return (
    <>
      <div onClick={spotlight.open} className="relative text-sm ">
        <input
          type="text"
          value={"search or start a new conversation"}

          className="w-full px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-slate-800"
          readOnly
        />
      </div>
      <div className="max-w-545 mx-auto bg-black">
        <Spotlight.Root  query={query} overlayProps={{bga:'black'}} onQueryChange={setQuery}>
          <Spotlight.Search placeholder="Search by username..." leftSection={<CiSearch stroke={1.5} />} />
          <Spotlight.ActionsList>
            {data !== undefined && data.length > 0
              ? (
                <div className="flex flex-col">
                  {items}
                </div>
              )
              : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
          </Spotlight.ActionsList>
        </Spotlight.Root>
      </div>
    </>
  );
}

function Toggle({ val }: any) {
  const [value, toggle] = useToggle(['channels', 'Direct messages']);
  return (
    <Button color={'salt'} onClick={() => toggle()}>
      {val}
    </Button>
  );
}
const CreateChannelForm = () => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [password, setPassword] = useState('');
  const context = useAppContext();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setChannelName('');
    setPassword('');
  };
  const handleSelectChange = (e: any) => {
    setChannelType(e.target.value);
  }
  const createAChannel = (e: any) => {
    e.preventDefault();
    if (context.socket && channelName) {
      const cookie = new Cookies();
      const jwt = cookie.get('jwt')
      context.socket.emit("createChannel", { jwt, name: channelName, typePass: { type: channelType, password: password } }, () => {
        console.log({ owner: context.userData.intraId, name: channelName, typePass: { type: channelType, password: password } })
      });
      handleSubmit(e);
    }
    else {
      toast.error('you should enter atleast the name of your channel');
    }
  }
  // useEffect(()=>{
  //   console.log('i did mount');
  // }, [channelType]);
  return (
    // <form onSubmit={createAChannel} className="max-w-md mx-auto mt-8">
    <>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Channel Name
        </label>
        <input
          type="text"
          id="channelName"
          name="channelName"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2" >
          Type
        </label>
        <select
          id="choseBox"
          value={channelType}
          onChange={handleSelectChange}
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>
            Select the channel type
          </option>
          <option value="PUBLIC">Public</option>
          <option value="PROTECTED">Protected</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>
      {
        channelType === "PROTECTED" &&
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      }
      <div className="flex items-center justify-between">
        <button
          onClick={createAChannel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Channel
        </button>
      </div>
      {/* </form> */}
    </>
  );
};

const Demo = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal  opened={opened} onClose={close} title="Create A Channel" centered>
        <CreateChannelForm />
      </Modal>
      <div className="flex flex-row justify-center space-x-3 text-white">
        <h2>channels</h2>
        <IoMdAdd className='hover:cursor-pointer' onClick={open} />
      </div>
    </>
  );
}

export async function getRooms(userId: string): Promise<Room[] | undefined> {
  const res = await fetch(`http://localhost:3001/chat/${userId}/privateRooms/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",

    })
  if (!res.ok) {
    toast.error("xxxx");
    return undefined;
  }

  const room = await res.json();


  // console.log(room)
  return room;
}


export const FriendsCard = () => {
  const context = useAppContext();
  const users = context.friendsData.friends;
  const roomIdExtractor = (user1: string, user2: string) => {
    return parseInt(user1) > parseInt(user2) ? user1 + user2 : user2 + user1;
  }
  const creatRoomEvent = (user: User) => {
    context.setRecipientLogin(user.intraId);
    const cookie = new Cookies();
    const jwt = cookie.get('jwt')
    context.socket?.emit('createPrivateRoom', { jwt, user2: user.intraId });
  }
  return (
    <div className="flex flex-row overflow-x-auto  md:overflow-scroll ">
      {users.map((user: User, index: number) => (
        <Link
          onClick={() => creatRoomEvent(user)}
          href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomIdExtractor(context.userData?.intraId, user.intraId)}`}
          key={index}
        >
          <div key={index} className="flex flex-row items-center text-xs p-3  my-1 hover:bg-gray-800 rounded ">
            <div className=" flex flex-col text-white  max-w-xs mx-2 order-2 items-start">
              <Image width={50} height={50} src={user.Avatar} alt="My profile" className="w-10 sm:w-10 h-10 sm:h-10 rounded-full" />
              <div><span className='hidden sm:block'>{user?.login}</span></div>
              {/* <div className="sm:hidden" ><span>{lastMessage}</span></div> */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
export const ConversationCard = ({ room }: any) => {
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
      <Loading />
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

export const ConversationNotSelected = () => {
  return (
    <div className="flex  flex-1 flex-col items-center justify-center p-3 my-1  w-screen text-white">
      <BiConversation className="text-slate-400  h-40 w-40  " />
      <h1 className="text-slate-400"> no Conversation has been selected</h1>
    </div>
  );
}
export const PermissionDenied = () => {
  return (
    <div className="flex  flex-1 flex-col items-center justify-center p-2 my-1  w-screen text-slate-500">
      <CgDanger className="h-40 w-40  " />
      <h1> Permission Denied</h1>
    </div>
  );
}
export const Conversations = () => {
  const context = useAppContext();
  const [selected, setSelected] = useState<string>('messages');
  const [aRooms, setARooms] = useState<Room[] | []>([]);
  const style = { borderBottom: "1px solid gray" };
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
    <div className=" flex flex-col h-full p-4 w-full  lg:w-1/5 xl:1/5   text-white space-y-3 rounded  border border-[#292D39]">
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
        <Demo />
      }
    </div>
  );
};
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
      return () => {
        context.socket?.disconnect();
      };
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  useEffect(() => {
    fetchDataAndSetupSocket();
    if (context.socket) {
      context.socket.on("createChannel", (data: any) => {
        console.log(data);
      })
      if (context.socket) {
        
        context.socket?.on('privateChat', (message: any) => {
          fetchDataAndSetupSocket();
          const msg = message.content;

          toast.success(`you have a new message : ${msg}`);
        })
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
    <div className=" min-h-screen w-screen  bg-[#12141A] ">
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
            {context.responsive && <ConversationNotSelected />}
            {/* <ProfileInfo></ProfileInfo> */}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};


export default Chat;