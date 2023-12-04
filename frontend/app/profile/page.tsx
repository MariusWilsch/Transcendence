"use client";

import Image from "next/image";
import backArrow from "../../public/backArrow.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Loading() {
  return (
    <div className="bg-[#DDE6ED] h-screen w-screen flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  created_at: Date;
  updated_at: Date;
};

type UserDescriptionCardProps = {
  title: string;
  content: string;
};

const UserDescriptionCard = ({ title, content }: UserDescriptionCardProps) => {
  return (
    <div className="flex-1 h-[100%] mx-[3%]">
      <div className="text-white h-[20%] pt-4 text-center text-xl font-bold font-mono bg-[#526D82] rounded-md">
        {title}
      </div>
      <div className="text-[#27374D] pt-[7%] text-start bg-[#9DB2BF] h-[60%] rounded-lg mt-2 break-words overflow-hidden p-3">
        &nbsp;&nbsp;&nbsp;&nbsp;{content}
      </div>
    </div>
  );
};


const UserDetailsCard = ({value} : { value: string }) => {
  return (
    <div className="flex items-center justify-center w-screen h-[7vh] mb-[5vh]">
      <div
        className="flex items-center justify-center w-1/4 p-4
       bg-[#27374D] shadow-inner rounded-md"
      >
        <div className="text-white text-xl font-serif"> {value} </div>
      </div>
    </div>
  );
};


type UserProfileImageProps = {
  src: string;
};

const UserProfileImage = ({ src }: UserProfileImageProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-[5vh]">
      <Image
        src={src}
        alt="backArrow"
        width={300}
        height={300}
        priority={true}
        quality={100}
        className="rounded-full border-2 border-black"
        style={{ width: "30vh", height: "30vh" }}
      />
    </div>
  );
};


const BackButton = () => {
  return (
    <div className="pt-[5vh] px-[5vw] hover:opacity-70">
      <Link href="http://localhost:3000" className="">
        <Image
          src={backArrow}
          alt="home page"
          width={30}
          priority={true}
          quality={75}
          className=""
          style={{ width: "2.5vh", height: "4vh" }}
        />
      </Link>
    </div>
  );
};


export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        var data: User = await response.json();

        setUserData(data);
        setLoading(false);


        console.log("data : ", data);
      } catch (error) {
        console.error("Error during login:", error);
        setLoading(false);
      }
    };
    checkJwtCookie();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const Login = userData?.login || "Login";

  const FullName = userData?.fullname || "Full Name";

  const Title = userData?.intraId || "Title";
  const Content = userData?.email || "Email";

  // const IntraPic = userData?.Avatar || "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";
  const IntraPic = "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";


  return (
    <div className="bg-[#DDE6ED] h-screen w-screen">
      <BackButton />
      <UserProfileImage src={IntraPic} />

      <UserDetailsCard value={Login} />
      <UserDetailsCard value={FullName} />

      <div className="flex justify-center h-[25vh] w-screen">
        <div className="flex justify-around w-[90vw] h-[100%]">
          <UserDescriptionCard title={Title} content={Content} />
          <UserDescriptionCard title={Title} content={Content} />
          <UserDescriptionCard title={Title} content={Content} />
        </div>
      </div>
    </div>
  );
}

