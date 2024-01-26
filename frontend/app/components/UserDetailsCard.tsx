"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../AppContext";
import { CiSaveUp2 } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";




export const UserDetailsCard = ({
    value,
    intraId,
  }: {
    value: string;
    intraId: string | undefined;
  }) => {
    const { user, setUser } = useAppContext();
    const { isDivVisible, toggleDivVisibility } = useAppContext();
    const [newLoginInput, setNewLoginInput] = useState("");
  
    const updateLogin = async () => {
      
      if (newLoginInput.trim().length > 20 || newLoginInput.trim().length < 3) {
        toast.error("Login must be between 3 and 20 characters");
        return;
      }
      if (newLoginInput.trim() !== "" && intraId !== undefined) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ newLogin: newLoginInput }),
            }
          );
          let updatedUser = { ...user, login: newLoginInput };
          setUser(updatedUser as User);
  
          const data = await response.json();
          if (data.success === false) {
            const msg = "Failed to update login : " + newLoginInput;
            toast.error(msg);
            console.log(newLoginInput, ": -maybe- not unique");
          } else {
            toast.success("Login updated successfully");
            console.log(newLoginInput, ": updated successfully");
          }
        } catch (error: any) {
          const msg = "Error updating login: " + newLoginInput;
          toast.error(msg);
          console.error("Error updating login:", error.message);
        }
        setNewLoginInput("");
      } else {
        toast.error("Please enter a valid login");
        console.log("Please enter a valid login");
      }
    };
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        updateLogin();
        toggleDivVisibility();
      }
    };
  
    return (
      <div className="flex items-center justify-center ">
        <div
          className="flex items-center justify-center p-4
          rounded-md "
        >
          <div className="text-2xl font-medium font-sans days left text-white">
            {value}&nbsp;
          </div>
          {isDivVisible && (
            <div className="flex flex-row">
              &nbsp;
              <input
                type="text"
                placeholder=" the new login"
                name={`login${Math.random()}`}
                value={newLoginInput}
                onChange={(e) => setNewLoginInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`rounded-lg border-opacity-50 border-2 ${
                  newLoginInput !== "" ? "border-green-500" : "border-slate-300"
                } bg-[#1F212A] text-sm outline-none text-white`}
              />
              &nbsp;
              <button
                onClick={() => {
                  updateLogin();
                  toggleDivVisibility();
                }}
                className=""
              >
                <CiSaveUp2
                  className="md:hidden text-slate-400 inline-block"
                  size="24"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };