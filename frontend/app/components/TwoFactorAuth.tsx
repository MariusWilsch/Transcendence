"use client";

import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../AppContext";


export const TwoFactorAuth = ({
    intraId,
    isTfa,
  }: {
    intraId: string | undefined;
    isTfa: boolean;
  }) => {
    const { isDivVisible, toggleDivVisibility } = useAppContext();
    const [isChecked, setIsChecked] = useState(isTfa);
  
    const handleCheckboxChange = async (event: any) => {
      setIsChecked((prev) => {
        return !prev;
      });
  
      if (event.target.checked) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/enableOtp`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const res = await response.json();
  
        if (res.sucess) {
          toast.success("2FA is enabled");
        } else {
          toast.error("Error in enabling 2FA");
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/disableOtp`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const res = await response.json();
  
        if (res.sucess) {
          toast.success("2FA is disabled");
        } else {
          toast.error("Error in disabling 2FA");
        }
      }
    };
  
    return (
      <div>
        {isDivVisible && (
          <div>
            <div className="flex flex-col items-center justify-center">
              <div>
                <span className="label-text font-sans text-white text-base inline-block">
                  Enable 2FA &nbsp;
                </span>
                <div className="inline-block">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="toggle [--tglbg:black] bg-white 
                   hover:bg-slate-500 border-bg-slate-800 "
                    style={{ transform: "scale(0.9)", verticalAlign: "middle" }}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  