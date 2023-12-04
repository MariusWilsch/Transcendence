"use client";

import Image from "next/image";
import backArrow from "../../public/backArrow.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  created_at: Date;
  updated_at: Date;
}


export default function Profile() {

  const [userData, setUserData] = useState<User | null>(null);


  useEffect(() => {
    const checkJwtCookie = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        var data : User = await response.json();

        setUserData(data);

        console.log("data : ", data);
      } catch (error) {
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
  }, []);


  const Login = userData?.login || "Login";


  const FullName = userData?.fullname || "Full Name";

  const Title = userData?.intraId || "Title";
  const Content = userData?.email || "Email";

  const IntraPic = userData?.Avatar || "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";

  return (
    <div
      className="bg-[#DDE6ED] h-screen w-screen 
     "
    >
      <div className="pt-[7%] px-[7%] hover:opacity-80">
        <Link href="http://localhost:3000" className="">
          <Image
            src={backArrow}
            alt="backArrow"
            width={30}
            priority={true}
            quality={75}
            className=""
          />
        </Link>
      </div>

      <div
        className="flex flex-col items-center justify-center
        mb-[5%]"
      >
        <Image
          src={IntraPic}
          alt="backArrow"
          width={200}
          height={200}
          priority={true}
          quality={100}
          className="rounded-full border-2 border-black"
        />
      </div>

      <div className="flex items-center justify-center w-screen h-[10%]">
        <div
          className="flex items-center justify-center w-1/6 p-4
         bg-[#27374D] shadow-inner  rounded-md "
        >
          <div className="text-white text-xl  font-serif"> {Login} </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-screen h-[10%] mb-[5%]">
        <div
          className="flex items-center justify-center w-1/4 p-4
         bg-[#27374D] shadow-inner rounded-md"
        >
          <div className="text-white text-xl  font-serif"> {FullName} </div>
        </div>
      </div>

      <div className="flex justify-center h-[50%]">
        <div className="flex justify-around w-[90%] h-[100%]">
          <div className="flex-1 h-[100%] mx-[3%]">
            <div
              className="text-white  h-[10%] pt-[7%] text-center 
            text-xl font-bold font-mono bg-[#526D82] rounded-md"
            >
              {" "}
              {Title}{" "}
            </div>
            <div className="text-[#27374D] pt-[7%] text-start bg-[#9DB2BF] h-[50%] rounded-lg mt-2 break-words overflow-hidden p-3">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {Content}{" "}
            </div>
          </div>
          <div className="flex-1 h-[100%] ml-5vw mx-[3%]">
            <div
              className="text-white  h-[10%] pt-[7%] text-center 
            text-xl font-bold font-mono bg-[#526D82] rounded-md"
            >
              {" "}
              {Title}{" "}
            </div>
            <div className="text-[#27374D] pt-[7%] text-start bg-[#9DB2BF] h-[50%] rounded-lg mt-2 break-words overflow-hidden p-3">
              {" "}
              {Content}{" "}
            </div>{" "}
          </div>
          <div className="flex-1 h-[100%] ml-5vw mx-[3%]">
            <div
              className="text-white  h-[10%] pt-[7%] text-center 
            text-xl font-bold font-mono bg-[#526D82] rounded-md"
            >
              {" "}
              {Title}{" "}
            </div>
            <div className="text-[#27374D] pt-[7%] text-start bg-[#9DB2BF] h-[50%] rounded-lg mt-2 break-words overflow-hidden p-3">
              {" "}
              {Content}{" "}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
