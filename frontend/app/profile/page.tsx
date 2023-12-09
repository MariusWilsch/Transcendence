"use client";

import Image from "next/image";
import edit from "../../public/edit.svg";
import save from "../../public/save.svg";
import backArrow from "../../public/backArrow.svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext, AppProvider } from "../AppContext";

export function Loading() {
  return (
    <div className="bg-[#DDE6ED] h-screen w-screen flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

export function Navbar() {
  const { toggleDivVisibility } = useAppContext();

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
          <a className="btn btn-ghost text-xl text-slate-700 font-serif">
            Profile
          </a>
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
        <div className="flex justify-end w-[100vw] px-4">
          <button onClick={toggleDivVisibility}>
            <Image
              src={edit}
              alt="edit profile"
              width={40}
              priority={true}
              quality={100}
              className=""
              style={{ width: "3vh", height: "3vh" }}
            />
          </button>
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

const UserLevelCard = ({
  value,
  intraId,
}: {
  value: string;
  intraId: string | undefined;
}) => {
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

const UserDetailsCard = ({
  value,
  intraId,
}: {
  value: string;
  intraId: string | undefined;
}) => {
  const { user, setUser } = useAppContext();
  const { isDivVisible } = useAppContext();
  const [newLoginInput, setNewLoginInput] = useState("");

  // console.log("user : ", user);
  const updateLogin = async () => {
    if (newLoginInput.trim() !== "" && intraId !== undefined) {
      let updatedUser = { ...user, login: newLoginInput };
      setUser(updatedUser as User);

      try {
        const response = await fetch(
          `http://localhost:3001/users/${intraId}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newLogin: newLoginInput }),
          }
        );
      } catch (error: any) {
        console.error("Error updating login:", error.message);
      }
      setNewLoginInput("");
    } else {
      console.log("Please enter a valid login");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-[7vh] ">
      <div
        className="flex items-center justify-center p-4
        rounded-md "
      >
        <div className="text-base-100 text-lg font-serif"> {value} </div>
        {isDivVisible && (
          <div>
            &nbsp;
            <input
              type="text"
              placeholder=" the new username "
              value={newLoginInput}
              onChange={(e) => setNewLoginInput(e.target.value)}
              className="rounded-lg border-opacity-50 border-2 border-slate-400 bg-[#e8eef3] text-sm"
            />
            &nbsp;
            <button onClick={updateLogin} className="">
              <Image
                src={save}
                alt="save"
                width={30}
                priority={true}
                quality={100}
                className="inline-block"
                style={{ width: "2vh", height: "2vh" }}
              ></Image>
            </button>
          </div>
        )}
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
        style={{ width: "20vh", height: "20vh" }}
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
      <div className="text-base-100 text-lg font-serif">
        {" "}
        Your achievements :{" "}
      </div>
      <div className="flex items-center justify-center p-4 rounded-md">
        <div className="text-base-100 font-serif"> {Achievements} </div>
      </div>
    </div>
  );
};

const GameHistory = ({ games }: { games: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw]">
      <div className="text-base-100 text-lg font-serif">
        {" "}
        Your games history :{" "}
      </div>
      <div className="flex items-center justify-center p-4 rounded-md">
        <div className="text-base-100 font-serif"> {games} </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      try {
        const response = await fetch("http://localhost:3001/users/imimouni", {
          method: "POST",
          body: imagePreview,
        });

        if (response.ok) {
          console.log("Avatar updated successfully");
        } else {
          console.error("Failed to update avatar:", response.statusText);
        }
      } catch (error) {
        console.error("Error during POST request:", error);
      }
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
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected Avatar"
          style={{ maxWidth: "100%" }}
        />
      )}
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
  const { user, setUser } = useAppContext();
  // const [userData, setUserData] = useState<User | null>(null);

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

        // setUserData(data);
        setUser(data);

        console.log("data : ", data);
      } catch (error) {
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();
  }, []);

  if (!user) {
    return <Loading />;
  }

  const Login = user?.login || "Login";
  const intraId = user?.intraId;
  const FullName = user?.fullname || "Full Name";
  const level = "Level 6.31";
  const Title = user?.intraId || "Title";
  const Content = user?.email || "Email";
  const IntraPic =
    user?.Avatar ||
    "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";

  return (
    <div className="bg-[#DDE6ED] h-screen w-screen">
      <Navbar />
      <UserProfileImage src={IntraPic} />

      <UserDetailsCard value={Login} intraId={intraId} />
      <UserLevelCard value={level} intraId={intraId} />

      <div className="flex flex-col items-center justify-center w-screen">
        <div className="flex flex-row justify-items-center w-[90vw] h-[100%]">
          <UserDescriptionCard title={"42"} content={"Friends"} />
          <UserDescriptionCard title={"42"} content={"Wins"} />
          <UserDescriptionCard title={"42"} content={"Loses"} />
        </div>
      </div>

      <Achievements Achievements={"randomAchievement"} />
      <GameHistory games={"randomAgame"} />

      <UserProfile />
    </div>
  );
}
