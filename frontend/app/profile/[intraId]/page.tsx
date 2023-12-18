"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../../AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TbFriends } from "react-icons/tb";
import { MdOutlineBlock } from "react-icons/md";
import { BiMessageRounded } from "react-icons/bi";
import { IoGameControllerOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

export function Loading() {
  return (
    <div className="bg-[#DDE6ED] h-screen w-screen flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

export function Navbar({ isProfileOwner }: { isProfileOwner: boolean }) {
  const { isDivVisible, toggleDivVisibility } = useAppContext();

  // console.log("isProfileOwner: ", isProfileOwner);
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
              <br></br>
              <li>
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}
                >
                  Log out
                </Link>
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
          {!isDivVisible && isProfileOwner && (
            <button onClick={toggleDivVisibility}>
              <CiEdit className="text-black" size="25" />
            </button>
          )}
          {isDivVisible && isProfileOwner && (
            <button onClick={toggleDivVisibility}>
              <IoIosCloseCircleOutline className="text-black" size="25" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/avatar`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success === false) {
          toast.error("Failed to update login avatar");
          console.log("Failed to update login avatar");
        } else {
          toast.success("avatar updated successfully");
          console.log("avatar updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update avatar");
        console.error("Error during POST request:", error);
      }
      setSelectedFile(null);
    } else {
      toast.error("Please select a file");
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
              onError={(e: any) => {
                e.target.onerror = null; // Prevent infinite loop if the fallback also fails
                e.target.src =
                  "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg"; // Provide a fallback avatar
              }}
            />
          )}

          <div>
            {isDivVisible && (
              <div
                className=""
                style={{ position: "absolute", bottom: 0, right: 0 }}
              >
                <label htmlFor="avatar" className="cursor-pointer">
                  <div className="bg-white mb-[2.4vh] mr-[2.4vh] md:mb-[2.7vh] md:mr-[2.7vh] rounded-full">
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
      <div className="text-gray-900 text-lg  days left">
        Your achievements :&nbsp;
      </div>
      <div className="flex items-center justify-center p-4 rounded-md font-sans text-gray-500">
        <div className=" days left font-sans"> {Achievements} </div>
      </div>
    </div>
  );
};

const GameHistory = ({ games }: { games: string }) => {
  return (
    <div className="h-[10vh] mx-[10vw]">
      <div className="text-lg  days lef font-sanst  text-gray-900">
        Your games history :&nbsp;
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
      <div className="text-2xl font-semibold flex flex-row text-center m-2 text-gray-200">
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
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}>
              Log out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TwoFactorAuth = ({
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
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await response.json();

      if (res.sucess) {
        toast.success("2FA is enabled");
        console.log("2FA is enabled");
      } else {
        toast.error("Error in enabling 2FA");
        console.log("Error in enabling 2FA");
      }
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/disableOtp`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await response.json();

      if (res.sucess) {
        toast.success("2FA is disabled");
        console.log("2FA is disabled");
      } else {
        toast.error("Error in disabling 2FA");
        console.log("Error in disabling 2FA");
      }
    }
  };

  return (
    <div>
      {isDivVisible && (
        <div>
          <div className="flex flex-col items-center justify-center">
            <div>
              <span className="label-text font-sans text-gray-800 text-base inline-block">
                Enable 2FA &nbsp;
              </span>
              <div className="inline-block">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="toggle [--tglbg:white] bg-slate-700 
                 hover:bg-slate-600 border-bg-slate-800 "
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

const Friend = ({
  isProfileOwner,
  userId,
  friendId,
}: {
  isProfileOwner: boolean;
  userId: string | undefined;
  friendId: string;
}) => {
  return (
    <div>
      {!isProfileOwner && (
        <div className="flex items-center justify-center text-black">
          <button className="mx-2">
            <TbFriends size="25" />
          </button>
          <button className="mx-2">
            <MdOutlineBlock size="25" />
          </button>
          <button className="mx-2">
            <BiMessageRounded size="25" />
          </button>
          <button className="mx-2">
            <IoGameControllerOutline size="25" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function Profile(params: any) {
  const { user, setUser, isDivVisible, toggleDivVisibility } = useAppContext();

  const [isloaded, setIsloaded] = useState<number>(0);
  const [userFromRoutId, setuserFromRoutId] = useState<User | undefined>(
    undefined
  );
  const [userProfil, setuserProfil] = useState<User | null>(null);
  const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);

  // console.log("Rout ID: ", params.params.intraId);
  // console.log("user.intraId: ", user.intraId);

  const addLogin = () => {
    if (user?.isRegistred === false) {
      toggleDivVisibility();
      toast("🌟 Please update your nickname and avatar.", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      console.log("🌟 Please update your nickname and avatar.");
    }
  };

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

        setUser(data);
        setIsloaded((x) => x + 1);
        if (isloaded == 1) {
          addLogin();
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };
    checkJwtCookie();

    const getUserFromRoutId = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${params.params.intraId}`,
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
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          var data: User = await response.json();
          setuserFromRoutId(data);
        } else {
          toast.error("User not found");
          console.log("User not found");
        }
      } catch (error: any) {
        const msg = "Error during login" + error.message;
        toast.error(msg);
        console.error("Error during login:", error);
      }
    };

    getUserFromRoutId();
  }, [userFromRoutId?.login]);

  useEffect(() => {
    if (params.params.intraId === user?.intraId) {
      setIsProfileOwner(true);
    }
    let timeoutId: any;
    if (!user) {
      timeoutId = setTimeout(() => {
        toast.error("Please login first");
      }, 5000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user]);

  if (!userFromRoutId) {
    return (
      <>
        <Loading />
        <Toaster />
      </>
    );
  }

  let Login = "Login";
  let intraId = "";
  let FullName = "Full Name";
  let isTfaEnabled = false;
  let level = "Level 6.31";
  let email = "Email";
  let IntraPic =
    "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";

  if (isProfileOwner) {
    Login = user?.login || "Login";
    intraId = user?.intraId || "";
    FullName = user?.fullname || "Full Name";
    isTfaEnabled = user?.isTfaEnabled || false;
    level = "Level 6.31";
    email = user?.email || "Email";
    IntraPic = user?.Avatar || IntraPic;
  } else {
    Login = userFromRoutId?.login || "Login";
    intraId = userFromRoutId?.intraId || "";
    FullName = userFromRoutId?.fullname || "Full Name";
    isTfaEnabled = userFromRoutId?.isTfaEnabled || false;
    level = "Level 6.31";
    email = userFromRoutId?.email || "Email";
    IntraPic = userFromRoutId?.Avatar || IntraPic;
  }

  return (
    <div className="h-screen w-screen ">
      <div className="flex h-screen">
        <div className="w-1/5 bg-gray-800 p-4 hidden md:inline-block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Navbar isProfileOwner={isProfileOwner} />
          <UserProfileImage src={IntraPic} intraId={intraId} />

          <UserDetailsCard value={Login} intraId={intraId} />
          <Friend
            isProfileOwner={isProfileOwner}
            userId={user?.intraId}
            friendId={params.params.intraId}
          />
          <TwoFactorAuth intraId={intraId} isTfa={isTfaEnabled} />

          {/* <UserLevelCard value={level} intraId={intraId} />
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row justify-items-center w-4/5 h-[100%]">
              <UserDescriptionCard title={"42"} content={"Friends"} />
              <UserDescriptionCard title={"42"} content={"Wins"} />
              <UserDescriptionCard title={"42"} content={"Loses"} />
            </div>
          </div>
          <Achievements Achievements={"random achievement"} />
          <GameHistory games={"random game"} /> */}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
