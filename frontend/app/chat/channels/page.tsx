'use client';
import { User, useAppContext } from "@/app/AppContext";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import Cookies from "universal-cookie";
import { motion } from "framer-motion";
import { FaCircle } from "react-icons/fa";
import { RiSearchLine } from "react-icons/ri";
import { Popover, Button, TextInput } from '@mantine/core';
import { GrGroup } from "react-icons/gr";
import { FaRegMessage } from "react-icons/fa6";


function Demo() {
  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>JOIN</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex ">
        <input type="password" placeholder="password" />
        <Button>submit</Button>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

const ChannelsLobby = ()=>{
    const context = useAppContext();
      const [socket, setsocket] = useState<Socket | null>(null);
    
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
    
            if (data !== null) {
              context.setUserData(data);
            }
          } catch (error: any) {
            const msg = "Error during login" + error.message;
            toast.error(msg);
            console.error("Error during login:", error);
          }
        };
        checkJwtCookie();
      }, []);
    
      useEffect(() => {
        context.setisSidebarVisible(window.innerWidth > 768);
      }, []);
    
      const [users, setUsers] = useState<User[] | undefined>(undefined);
      const [inputValue, setInputValue] = useState("");
      const [selectedFeild, setselectedFeild] = useState("Online");
    
      const PendingInvite = async () => {
        if (!context.user) {
          return;
        }
        try {
          const response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.user?.intraId}/PendingInvite`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
    
          if (data.success === false) {
            const msg = "Error getting friends";
            toast.error(msg);
            console.log(msg);
          }
          if (data.friendsDetails) {
            setUsers(data.friendsDetails);
          }
        } catch (error: any) {
          const msg = "Error getting friends: " + error.message;
          toast.error(msg);
          console.error("Error getting friends:", error.message);
        }
      };
    
      const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (
          inputValue === "" ||
          inputValue === undefined ||
          inputValue === null ||
          inputValue.trim().length === 0
        ) {
          return;
        }
    
        try {
          const data = {
            searchTerm: inputValue,
          };
    
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(data),
            }
          );
          if (!response.ok) {
            toast.error("User not found");
            return;
          }
    
          const users: User[] = await response.json();
          setUsers(users);
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      const getFriends = async () => {
        if (!context.user) {
          return;
        }
        try {
          const response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.user?.intraId}/friends`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          if (response.success === false) {
            const msg = "Error getting friends";
            toast.error(msg);
            console.log(msg);
          }
          if (data.friends) {
            setUsers(data.friends);
    
            // console.log("User friends ", users);
          }
        } catch (error: any) {
          const msg = "Error getting friends: " + error.message;
          toast.error(msg);
          console.error("Error getting friends:", error.message);
        }
      };
    
      const onlineFriends = async () => {
        if (!context.user) {
          return;
        }
        try {
          const response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.user?.intraId}/onlinefriends`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          if (response.success === false) {
            const msg = "Error getting friends";
            toast.error(msg);
            console.log(msg);
          }
          if (data.onlinefriends) {
            setUsers(data.onlinefriends);
          }
        } catch (error: any) {
          const msg = "Error getting friends: " + error.message;
          toast.error(msg);
          console.error("Error getting friends:", error.message);
        }
      };
    
      useEffect(() => {
        onlineFriends();
      }, [context.user]);
    
      useEffect(() => {}, [inputValue]);
    
      const createsocket = () => {
        const handleClientsConnection = `${process.env.NEXT_PUBLIC_API_URL}:3002/handleClientsConnection`;
    
        const cookies = new Cookies();
        const newSocket = io(handleClientsConnection, {
          auth: { jwt: cookies.get("jwt") },
        });
    
        setsocket(newSocket);
      };
    
      const listenForEvents = () => {
        if (socket !== null) {
          socket.on("update", () => {
            onlineFriends();
            setselectedFeild("Online");
          });
        }
      };
    
      useEffect(() => {
        if (!socket) {
          createsocket();
        }
      }, []);
    
      useEffect(() => {
        if (socket) {
          listenForEvents();
        }
      }, [socket]);
    
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
              <div className="p-10">
                <div className="">
                  <div className="mb-5 text-white font-sans">Channels </div>
                  <div className="border-b border-gray-500 my-4 mb-10"></div>
                  <div className="flex justify-center mb-8">
                    <div className="flex flex-row justify-between md:w-[50vw] w-full  bg-gray-600 rounded-md mb-4">
                      <button
                        className="w-full"
                        onClick={() => {
                          onlineFriends();
                          setselectedFeild("My channels");
                        }}
                      >
                        <div
                          className={`${
                            selectedFeild === "My channels"
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
                          getFriends();
                          setselectedFeild("Explore");
                        }}
                      >
                        <div
                          className={`${
                            selectedFeild === "Explore"
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
                          PendingInvite();
                          setselectedFeild("Invitations");
                        }}
                      >
                        <div
                          className={`${
                            selectedFeild === "Invitations"
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
                            <form className="min-w-[80vw] md:min-w-[50vw]" onSubmit={handleSubmit}>
                              <label className=" flex flex-grow ">
                                <input
                                  id="searchField"
                                  name={`inputValue${Math.random()}`}
                                  type="text"
                                  value={inputValue}
                                  placeholder="Search ..."
                                  onChange={(e) => {
                                    setInputValue(e.target.value);
                                    handleSubmit(e);
                                  }}
                                  className="min-w-[80vw] md:min-w-[50vw] bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
                                />
                                <div className="md:hidden">&nbsp; &nbsp;</div>
                                <button
                                  onClick={handleSubmit}
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
                        {users &&
                          users?.map((user) => (
                              <div
                                key={user.intraId}
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
                                         
                                          {(selectedFeild === "My channels" ||
                                            selectedFeild === "Explore") && (
                                            <div className="absolute right-0 bottom-0">
                                              <div className="">
                                                <FaCircle
                                                  className={`${
                                                    user.status === "ONLINE"
                                                      ? "text-green-600 border-slate-950 border rounded-full"
                                                      : ""
                                                  } ${
                                                    user.status === "OFFLINE"
                                                      ? "text-red-600 border-slate-950 border rounded-full"
                                                      : ""
                                                  } ${
                                                    user.status != "ONLINE" &&
                                                    user.status != "OFFLINE"
                                                      ? "hidden"
                                                      : ""
                                                  }`}
                                                  size="14"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
    
                                        <div className="ml-3 f">
                                          <p className="text-md font-sans text-white">
                                            {user.login}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex border-l border-gray-900">
                                      {selectedFeild==="Explore" &&  <Demo /> }
                                      {selectedFeild=== "my channels" && <FaRegMessage className="h-7 w-7 rounded-full" />}
                                    </div>
                                  </div>
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