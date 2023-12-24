"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { Navbar, Sidebar } from "../profile/[intraId]/page";
import { FiCheckCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";

export default function Search() {
  const [Change, setChange] = useState<boolean>(false);
  const togleChange = () => {
    setChange((prev) => !prev);
  };

  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[] | null>(null);
  const {
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  useEffect(() => {
    setisSidebarVisible(window.innerWidth > 768);
  }, []);

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
          setUser(data);
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
    const getFriends = async () => {
      try {
        if (user?.intraId) {
          const response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${user.intraId}/freindrequest`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const data = await response.json();

          if (data.success === false) {
            const msg = "Error getting friends";
            toast.error(msg);
            console.log(msg);
          }
          if (data.success === true && data.friendsDetails) {
            setFriends(data.friendsDetails);
          }
        }
      } catch (error: any) {
        const msg = "Error getting friends: " + error.message;
        toast.error(msg);
        console.error("Error getting friends:", error.message);
      }
    };
    getFriends();
  }, [user, Change]);

  const acceptFriendRequest = async (
    userId: string | undefined,
    friendId: string
  ) => {
    if (userId !== undefined) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userId}/acceptFriend/${friendId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success === false) {
        const msg = "Error accepting friend request";
        toast.error(msg);
        console.log(msg);
        togleChange();
      }
      if (data.success === true) {
        const msg = "Friend request accepted";
        toast.success(msg);
        console.log(msg);
        togleChange();
      }
    }
  };

  const declineFriendRequest = async (
    userId: string | undefined,
    friendId: string
  ) => {
    if (userId !== undefined) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userId}/declineFriend/${friendId}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        const msg = "Error declining friend request";
        toast.error(msg);
        console.log(msg);
        togleChange();
      }
      if (data.success === true) {
        const msg = "Friend request declined";
        toast.success(msg);
        console.log(msg);
        togleChange();
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#12141A]">
      <Toaster />
      <div className=" h-screen w-screen ">
        <Navbar isProfileOwner={false} />

        <div className="flex ">
          {isSidebarVisible && (
            <div className="w-16 custom-height ">
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <Sidebar />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto bg-[#12141A] custom-height">
            <div className="p-10 ">
              <div className="">
                <div className="mb-5 text-white font-sans">Notifications </div>
                <div className="border-b border-gray-500 my-4 mb-10"></div>

                {friends &&
                  friends?.map((friend) => (
                    <div
                      key={friend.intraId}
                      className=" p-2 mb-2 flex justify-center"
                    >
                      <div className="max-w-md w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                        <div className="max-w-md w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                          <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 pt-0.5">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={friend.Avatar}
                                  alt=""
                                />
                              </div>
                              <div className="ml-3 f">
                                <p className="text-md font-sans text-white">
                                  {friend.login}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex ">
                            <button
                              className="w-full flex items-center justify-center text-sm font-medium text-indigo-600  hover:text-indigo-500 "
                              onClick={() =>
                                acceptFriendRequest(
                                  user?.intraId,
                                  friend.intraId
                                )
                              }
                            >
                              <FiCheckCircle
                                size="30"
                                className="text-green-300"
                              />
                            </button>
                          </div>
                          <div className="flex ">
                            <button
                              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
                              onClick={() =>
                                declineFriendRequest(
                                  user?.intraId,
                                  friend.intraId
                                )
                              }
                            >
                              <FiXCircle size="30" className="text-red-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
