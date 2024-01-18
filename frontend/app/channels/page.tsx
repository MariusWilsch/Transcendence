'use client';
import { Channel, User, useAppContext } from "@/app/AppContext";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import Cookies from "universal-cookie";
import { motion } from "framer-motion";
import { RiSearchLine } from "react-icons/ri";
import { Popover, Button, TextInput } from '@mantine/core';
import { GrGroup } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";


const JoinProtectedChannel = ({ selectedChannel }: any) => {
  const context = useAppContext();
  const [password, setPassword] = useState('');
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit(password);
      setPassword('');
    }
  }
  const handleSubmit = (pass: string) => {
    if (context.socket && ((selectedChannel.type === "PROTECTED" && pass) || (selectedChannel.type !== "PROTECTED" && pass === "default"))) {
      const cookie = new Cookies();
      const jwt = cookie.get('jwt');
      context.socket.emit('JoinAChannel', { channelId: selectedChannel.name, type: selectedChannel.type, password: pass, jwt})
    }
    else {
      toast.error('enter a password first');
    }
    setPassword('');
  }
  return (
    <>
      {
        selectedChannel.type === "PROTECTED" &&
        <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button>JOIN</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex ">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                type="password"
                placeholder="password"
              />
              <Button onClick={() => handleSubmit(password)}>submit</Button>
            </div>
          </Popover.Dropdown>
        </Popover>
      }
      {
        selectedChannel.type !== "PROTECTED" &&
        <Button onClick={() => handleSubmit("default")}>JOIN</Button>
      }
    </>
  );
}

const ChannelsLobby = () => {
  const context = useAppContext();
  const [availabelChannels, setAvailableChannels] = useState<Channel[] | []>([]);
  const [channels, setUserChannels] = useState<Channel[]>([]); // Provide a type for the messages stat

  useEffect(() => {
    const checkJwtCookie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        var data: User = await response.json();

        if (data !== undefined) {
          context.setUserData(data);
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
    if (!context.socket) {
      const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
      const cookie = new Cookies();
      const newSocket = io(chatNameSpace, {
        query: { user: cookie.get('jwt') },
      });
      context.setSocket(newSocket);
    }
    if (context.socket) {
      context.socket.on('JoinAChannel', (res: any) => {
        const msg = res.e;
        if (msg === "password incorrect") {
          toast.error(msg);
        }
        else {
          toast.success(msg);
          exploreChannels();
        }
      })
    }
  }, [context.socket, availabelChannels]);

  // const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const [selectedFeild, setselectedFeild] = useState("my channels");

  const userChannels = async () => {
    if (!context.userData) {
      return;
    }
    try {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.userData?.intraId}/userChannels`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data) {
        const msg = "Error getting channels";
        toast.error(msg);
        console.log(msg);
      }
      if (data) {
        setUserChannels(data);
      }
    } catch (error: any) {
      const msg = "Error getting friends: " + error.message;
      toast.error(msg);
      console.error("Error getting friends:", error.message);
    }
  };
  const exploreChannels = async () => {
    if (!context.userData) {
      return;
    }
    try {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.userData.intraId}/availabelChannels`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data) {
        const msg = "Error getting channels";
        toast.error(msg);
        console.log(msg);
      }
      if (data) {
        setAvailableChannels(data);
      }
    } catch (error: any) {
      const msg = "Error getting channels: " + error.message;
      toast.error(msg);
      console.error("Error getting channels:", error.message);
    }
  };

  return (
    <div className=" min-h-screen w-screen bg-[#12141A]">
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
          <div className="p-10">
            <div className="">
              <div className="mb-5 text-white font-sans">Channels </div>
              <div className="border-b border-gray-500 my-4 mb-10"></div>
              <div className="flex justify-center mb-8">
                <div className="flex flex-row justify-between md:w-[50vw] w-full  bg-gray-600 rounded-md mb-4">
                  <button
                    className="w-full"
                    onClick={() => {
                      userChannels();
                      setselectedFeild("my channels");
                    }}
                  >
                    <div
                      className={`${selectedFeild === "my channels"
                          ? "underline underline-offset-8 text-slate-200"
                          : "text-slate-300"
                        } font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
                    >
                      My channels
                    </div>
                  </button>
                  <button
                    className="w-full"
                    onClick={() => {
                      exploreChannels();
                      setselectedFeild("Explore");
                    }}
                  >
                    <div
                      className={`${selectedFeild === "Explore"
                          ? "underline underline-offset-8 text-slate-200"
                          : "text-slate-300"
                        } font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
                    >
                      Explore
                    </div>
                  </button>
                  <button
                    className="w-full"
                    onClick={() => {
                      // PendingInvite();
                      setselectedFeild("Invitations");
                    }}
                  >
                    <div
                      className={`${selectedFeild === "Invitations"
                          ? "underline underline-offset-8 text-slate-200"
                          : "text-slate-300"
                        } font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
                    >
                      Invitations
                    </div>
                  </button>
                </div>
              </div>
              {selectedFeild === "Explore" && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <div className="w-full flex items-center justify-center mb-6">
                    <div className="md:w-[50vw] w-full flex items-center justify-center">
                      <div className="md:w-[50vw] w-full flex flex-row-reverse">
                        <form className="min-w-[80vw] md:min-w-[50vw]" onSubmit={() => console.log('need to be handled')}>
                          <label className=" flex flex-grow ">
                            <input
                              id="searchField"
                              name={`inputValue${Math.random()}`}
                              type="text"
                              value={inputValue}
                              placeholder="Search ..."
                              onChange={(e) => {
                                setInputValue(e.target.value);
                                console.log(e);
                              }}
                              className="min-w-[80vw] md:min-w-[50vw] bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
                            />
                            <div className="md:hidden">&nbsp; &nbsp;</div>
                            <button
                              onClick={() => console.log('cho-fo-uniiiii')}
                              className="md:hidden flex-grow items-center justify-center p-2 rounded-lg bg-[#292D39] text-white"
                              type="submit"
                            >
                              <RiSearchLine size="30" className="" />
                            </button>
                          </label>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 }}
              >
                <div className="mt-4 flex  justify-center ">
                  <div className="mt-4 w-full flex flex-col items-center">
                    {availabelChannels && selectedFeild === "Explore" &&
                      availabelChannels.map((channel: Channel) => (
                        <div
                          key={channel.name}
                          className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
                        >
                          <motion.div
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.02 }}
                          >
                            <div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                              <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                  <div className="relative flex-shrink-0 pt-0.5">
                                    <GrGroup
                                      className="h-10 w-10 rounded-full"
                                    />
                                  </div>

                                  <div className="ml-3 f">
                                    <p className="text-md font-sans text-white">
                                      {channel.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-center items-center border-l border-gray-900">
                                <JoinProtectedChannel selectedChannel={channel} />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    {channels && selectedFeild === "my channels" &&
                      channels?.map((channel: any) => (
                        <div
                          key={channel.channelId}
                          className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
                        >
                          <motion.div
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.02 }}
                          >
                            <Link
                              href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels/${channel.channelId}`}
                            >
                              <div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                                <div className="flex-1 w-0 p-4">
                                  <div className="flex items-start">
                                    <div className="relative flex-shrink-0 pt-0.5">
                                      <GrGroup
                                        className="h-10 w-10 rounded-full"
                                      />
                                    </div>

                                    <div className="ml-3 f">
                                      <p className="text-md font-sans text-white">
                                        {channel.channelId}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* link to the channelRoom */}
                                <div className="flex justify-center items-center border-l border-gray-900"  >
                                  <FaRegMessage className="h-10 w-10" />
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default ChannelsLobby;