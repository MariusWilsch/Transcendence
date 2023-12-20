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
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Send a POST request here using the input value
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        toast.error("User not found");
        console.log("User not found");
        return;
      }

      const users: User[] = await response.json();
      setUsers(users);
      console.log(users);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="h-screen w-screen ">
      <Navbar isProfileOwner={false} />
      <div className="flex items-center justify-center">
        <div className="">
          <form
            className=""
            onSubmit={handleSubmit}
            // onChange={handleSubmit}
          >
            <label className="inline-block">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="p-2 inline-block rounded-lg border-opacity-40 border-2 border-slate-300 bg-white text-sm outline-none text-black"
              />
              &nbsp;
              <button
                className="inline-block p-2 rounded-lg bg-slate-400 text-white"
                type="submit"
              >
                Submit
              </button>
            </label>
          </form>
        </div>
      </div>
      <div className="mt-4">
        {users &&
          users?.map((user) => (
            <div key={user.intraId} className=" p-2 mb-2">
              <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.Avatar}
                        alt=""
                      />
                    </div>
                    <div className="ml-3 f">
                      <p className="text-md font-medium text-gray-900">
                        {user.login}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Link
                      href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${user.intraId}`}
                    >
                      visite
                    </Link>
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
