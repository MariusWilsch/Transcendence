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

export function Navbar() {
  return (
    <div className="">
      <div className="navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl text-slate-700 font-serif">Profile</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
      </div>
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
    <div className=" flex-1 flex flex-col ">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-[#9DB2BF] rounded-xl h-[15vw] w-[15vw] pt-3">
        <div className="text-white text-lg text-centerfont-mono rounded-md text-center">
          {title}
        </div>
        <div className="text-[#27374D] text-center text-xs rounded-lg break-words overflow-hidden">
          {content}
        </div>
        </div>
      </div>
    </div>
  );
};

const UserDetailsCard = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center justify-center w-screen h-[7vh]">
      <div
        className="flex items-center justify-center p-4
        rounded-md"
      >
        <div className="text-base-100 font-serif"> {value} </div>
      </div>
    </div>
  );
};

type UserProfileImageProps = {
  src: string;
};

const UserProfileImage = ({ src }: UserProfileImageProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center 
    m-4"
    >
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
    <div className="hidden sm:block pt-[5vh] px-[5vw] hover:opacity-70">
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

const Achievements = ({ Achievements }: { Achievements: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw] m-[10vw]">
      <div className="text-base-100 text-lg font-serif"> Your achievements : </div>
      <div
        className="flex items-center justify-center p-4 rounded-md"
      >
        <div className="text-base-100 font-serif"> {Achievements} </div>
      </div>
    </div>
  );
};

const GameHistory = ({ games }: { games: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw]">
      <div className="text-base-100 text-lg font-serif"> Your games history : </div>
      <div
        className="flex items-center justify-center p-4 rounded-md"
      >
        <div className="text-base-100 font-serif"> {games} </div>
      </div>
    </div>
  );
};


const UserProfile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    // Implement the logic to upload the selectedFile to your server
    // For example, you can use FormData and send it as a part of a POST request
    if (selectedFile) {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      // Make a POST request to your server with the formData
      // Example using fetch:
      // fetch('/upload-avatar', {
      //   method: 'POST',
      //   body: formData,
      // });
    }
  };

  return (
    <div>
      <h2>User Profile</h2>

      <div>
        <label htmlFor="avatar">Select Avatar:</label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <button onClick={handleUpload}>Upload Avatar</button>
        </div>
      )}
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

  const level = "Level 6.31";

  const Title = userData?.intraId || "Title";
  const Content = userData?.email || "Email";

  // const IntraPic = userData?.Avatar || "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";
  const IntraPic =
    "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";

  return (
    <div className="bg-[#DDE6ED] h-screen w-screen">
      {/* <BackButton /> */}
      <Navbar />
      <UserProfileImage src={IntraPic} />

      <UserDetailsCard value={Login} />
      <UserDetailsCard value={level} />

      <div className="flex flex-col items-center justify-center w-screen">
        <div className="flex flex-row justify-items-center w-[90vw] h-[100%]">
          <UserDescriptionCard title={"42"} content={"Friends"} />
          <UserDescriptionCard title={"42"} content={"Wins"} />
          <UserDescriptionCard title={"42"} content={"Loses"} />
        </div>
      </div>
      
      <Achievements Achievements={"randomAchievement"}/>
      <GameHistory games={"randomAgame"}/>

      <UserProfile/>
    </div>
  );
}
