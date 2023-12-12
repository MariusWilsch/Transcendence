"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppContext, AppProvider } from "../AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Loading() {
  return (
    <div className="bg-[#DDE6ED] h-screen w-screen flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

export function Navbar() {
  const { isDivVisible, toggleDivVisibility } = useAppContext();

  return (
    <div className="">
      <div className="navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
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
                <a>Leaderboard</a>
              </li>
              <li>
                <a>Achievements</a>
              </li>
              <li>
                <a>Friends</a>
              </li>
              <li>
                <a>Channels</a>
              </li>
              <li>
                <a>Play</a>
              </li>
              <li>
                <a>Log out</a>
              </li>
            </ul>
          </div>
          <a className="md:hidden btn btn-ghost text-xl text-slate-700  days left font-sans">
            Profile
          </a>
        </div>
        {/* <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Profile</a>
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
              <a>Leaderboard</a>
            </li>
            <li>
              <a>Achievements</a>
            </li>
            <li>
              <a>Friends</a>
            </li>
            <li>
              <a>Channels</a>
            </li>
            <li>
              <a>Play</a>
            </li>
            <li>
              <a>Log out</a>
            </li>
          </ul>
        </div> */}
        <div className="flex justify-end w-[100vw] px-4">
          {!isDivVisible && (
            <button onClick={toggleDivVisibility}>
              <CiEdit className="text-black" size="25" />
            </button>
          )}
          {isDivVisible && (
            <button onClick={toggleDivVisibility}>
              <IoIosCloseCircleOutline className="text-black" size="25" />
            </button>
          )}
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

const UserDescriptionCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className=" flex-1 flex flex-col ">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-[#9DB2BF] rounded-xl h-[15vw] w-[15vw] md:w-[10vw] md:h-[10vw] pt-3">
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
    <div className="flex items-center justify-center h-[7vh] text-gray-900">
      <div
        className="flex items-center justify-center p-4
        rounded-md"
      >
        <div className="text-base-100  days left"> {value} </div>
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
  const { isDivVisible, toggleDivVisibility } = useAppContext();
  const [newLoginInput, setNewLoginInput] = useState("");

  const updateLogin = async () => {
    if (newLoginInput.trim() !== "" && intraId !== undefined) {
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
        let updatedUser = { ...user, login: newLoginInput };
        setUser(updatedUser as User);
      } catch (error: any) {
        console.error("Error updating login:", error.message);
      }
      setNewLoginInput("");
    } else {
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
    <div className="flex items-center justify-center h-[7vh] ">
      <div
        className="flex items-center justify-center p-4
        rounded-md"
      >
        <div className="text-2xl font-medium font-sans days left text-gray-900">
          {value}&nbsp;
        </div>
        {isDivVisible && (
          <div className="">
            &nbsp;
            <input
              type="text"
              placeholder=" the new username "
              value={newLoginInput}
              onChange={(e) => setNewLoginInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`rounded-lg border-opacity-50 border-2 ${
                newLoginInput !== "" ? "border-green-500" : "border-slate-300"
              } bg-slate-50 text-sm outline-none text-black`}
            />
            &nbsp;
            <button
              onClick={() => {
                updateLogin();
                toggleDivVisibility();
              }}
              className=""
            >
              <CiSaveUp2 className="text-black inline-block" size="24" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const UserProfileImage = ({
  src,
  intraId,
}: {
  src: string;
  intraId: string | undefined;
}) => {
  const { isDivVisible, toggleDivVisibility } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    setImagePreview(src);
  }, [src]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      console.log("formData", formData);
      try {
        const response = await fetch(
          `http://localhost:3001/users/${intraId}/avatar`,
          {
            method: "POST",
            body: formData,
            credentials: "include", // Include cookies in the request
          }
        );
        if (response.ok) {
          console.log("Avatar uploaded successfully");
        } else {
          console.error("Failed to update avatar");
        }
      } catch (error) {
        console.error("Error during POST request:", error);
      }

      setSelectedFile(null);
    } else {
      console.log("Please select a file");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-[25vh] h-[25vh]"
          style={{ position: "relative", display: "inline-block" }}
        >
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="image Preview"
              width={300}
              height={300}
              priority={true}
              quality={100}
              className="rounded-full border-2 border-black"
              style={{ width: "25vh", height: "25vh" }}
            />
          )}

          <div>
            {isDivVisible && (
              <div
                className=""
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                <label htmlFor="avatar" className="">
                  <div className="bg-white mb-[5vw] mr-[5vw] md:mb-[2.4vh] md:mr-[2.4vh] rounded-full">
                    <CiCirclePlus
                      className="text-black "
                      size="25"
                      onChange={handleFileChange}
                    />
                  </div>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="inset-0 cursor-pointer bg-black hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        {selectedFile && isDivVisible && (
          <div
            className="flex flex-col items-center justify-center m-5
          animate-moveLeftAndRight"
          >
            <button
              onClick={() => {
                handleUpload();
                toggleDivVisibility();
              }}
            >
              <div className="inline-block font-sans text-black text-lg font-medium">
                save &nbsp;
              </div>
              <CiSaveUp2 className="text-black inline-block" size="22" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Achievements = ({ Achievements }: { Achievements: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw] m-[10vw]">
      <div className="text-base-100 text-lg  days left">
        {" "}
        Your achievements :{" "}
      </div>
      <div className="flex items-center justify-center p-4 rounded-md font-sans text-gray-500" >
        <div className=" days left font-sans"> {Achievements} </div>
      </div>
    </div>
  );
};

const GameHistory = ({ games }: { games: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw]">
      <div className="text-base-100 text-lg  days lef font-sanst">
        {" "}
        Your games history :{" "}
      </div>
      <div className="flex items-center justify-center p-4 rounded-md font-sans text-gray-500">
        <div className=" days left"> {games} </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div>
      <div className="text-2xl font-bold flex flex-row text-center m-2">
        Profile
      </div>
      <div className="fixed h-screen text-white flex flex-col justify-center">
        <ul className="list-none text-center">
          <li>
            <a href="#">Leaderboard</a>
          </li>
          <li>
            <a href="#">Achievements</a>
          </li>
          <li>
            <a href="#">Friends</a>
          </li>
          <li>
            <a href="#">Channels</a>
          </li>
          <li>
            <a href="#">Play</a>
          </li>
          <li>
            <a href="#">Log out</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TwoFactorAuth = () => {
  const { isDivVisible, toggleDivVisibility } = useAppContext();

  return (
    <div>
      {isDivVisible && (
        <div>
        <div className="flex flex-col items-center justify-center">
        <div >

          <span className="label-text font-sans text-gray-800 text-base inline-block">
            Enable 2FA &nbsp;
          </span>
          <div className="inline-block">
            <input
              type="checkbox"
              className="toggle [--tglbg:white] bg-slate-700 
            hover:bg-slate-600 border-bg-slate-800 "
              style={{ transform: "scale(0.9)", verticalAlign: "middle" }}
            />
          </div>
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const { user, setUser } = useAppContext();

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

        setUser(data);
        // console.log("user data : ", data);
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
    <div className="h-screen w-screen">
      <div className="flex h-screen">
        <div className="w-1/5 bg-gray-800 p-4 hidden md:inline-block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Navbar />
          <UserProfileImage src={IntraPic} intraId={intraId} />

          <UserDetailsCard value={Login} intraId={intraId} />
          <TwoFactorAuth />

          <UserLevelCard value={level} intraId={intraId} />

          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row justify-items-center w-4/5 h-[100%]">
              <UserDescriptionCard title={"42"} content={"Friends"} />
              <UserDescriptionCard title={"42"} content={"Wins"} />
              <UserDescriptionCard title={"42"} content={"Loses"} />
            </div>
          </div>

          <Achievements Achievements={"random achievement"} />
          <GameHistory games={"random game"} />
        </div>
      </div>
    </div>
  );
}
