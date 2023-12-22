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
import { Navbar } from "../profile/[intraId]/page";

export default function Search() {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[] | null>(null);

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
  }, [user]);

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
      console.log(data);
      if (data.success === false) {
        const msg = "Error accepting friend request";
        toast.error(msg);
        console.log(msg);
      }
      if (data.success === true) {
        const msg = "Friend request accepted";
        toast.success(msg);
        console.log(msg);
      }
    }
  };

  return (
    <div className="h-screen w-screen ">
      <Navbar isProfileOwner={false} />

      <div className="mt-4">
        {friends &&
          friends?.map((friend) => (
            <div key={friend.intraId} className=" p-2 mb-2">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
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
                      <p className="text-md font-medium text-gray-900">
                        {friend.login}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200 bg-green-200">
                  <button
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() =>
                      acceptFriendRequest(user?.intraId, friend.intraId)
                    }
                  >
                    accept
                  </button>
                </div>
                <div className="flex border-l border-gray-200 bg-red-200">
                  <button className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    decline
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Toaster />
    </div>
  );
}
