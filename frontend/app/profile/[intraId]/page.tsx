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
import { CgUnblock } from "react-icons/cg";
import { BiMessageRounded } from "react-icons/bi";
import { IoGameControllerOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { useParams, redirect, useRouter } from "next/navigation";
import pong from "../../../public/pong.svg";
import { IoMenuOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { RiPingPongLine } from "react-icons/ri";
import { IoChatbubblesOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { FaUserFriends } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { MdLeaderboard } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Cookies from "universal-cookie";
import { FaCircle } from "react-icons/fa";
import { PiGameControllerLight } from "react-icons/pi";
import { TbUserOff } from "react-icons/tb";
import { FaUserTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleDot } from "react-icons/fa6";

export function Loading() {
  return (
    <div className="bg-[#12141A] custom-height flex items-center justify-center">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
}

export function Navbar({ isProfileOwner }: { isProfileOwner: boolean }) {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (
      inputValue === "" ||
      inputValue === undefined ||
      inputValue === null ||
      inputValue.trim().length === 0
    ) {
      return;
    }
    return router.push(
      `${process.env.NEXT_PUBLIC_API_URL}:3001/users/search?searchTerm=${inputValue}`
    );
  };

  return (
    <div className="bg-[#1F212A] flex flex-row  w-[100vw]">
      <div className="w-16 h-16 bg-[#292D39]">
        <Image
          src={pong}
          alt="Description of the image"
          priority={true}
          width={100}
          height={100}
          sizes=""
          style={{ filter: "invert(100%)" }}
        />
      </div>

      <div className="flex-grow">
        <div className="">
          <div className="flex-row flex">
            <div className="flex-row flex justify-between">
              <div className="flex items-center p-3 md:hidden">
                <button onClick={toggleSidebarVisibleVisibility}>
                  <IoMenuOutline size="30" className="text-white" />
                </button>
              </div>
              <div className="flex items-center md:p-3">
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/search`}>
                  <CiSearch size="30" className="text-slate-400 " />
                </Link>
                <div className="md:inline-block hidden">
                  <form className="" onSubmit={handleSubmit}>
                    <label className="">
                      <input
                        id="handleSubmit"
                        type="text"
                        value={inputValue}
                        placeholder="Search ..."
                        onChange={(e) => {
                          setInputValue(e.target.value);
                        }}
                        className=" bg-[#1E2028] items-center justify-center p-2 rounded-lg text-sm outline-none text-white"
                      />
                    </label>
                  </form>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 flex-grow">
              {!isDivVisible && isProfileOwner && (
                <button onClick={toggleDivVisibility}>
                  <CiEdit className="text-white" size="25" />
                </button>
              )}
              {isDivVisible && isProfileOwner && (
                <button onClick={toggleDivVisibility}>
                  <IoIosCloseCircleOutline className="text-white" size="25" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const UserProfileImage = ({
  status,
  isProfileOwner,
  src,
  intraId,
}: {
  status: string | undefined;
  isProfileOwner: boolean;
  src: string;
  intraId: string | undefined;
}) => {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

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
          className={`${
            isSidebarVisible ? "backgroundDiv" : "backgroundDivNotVisible"
          } backgroundDiv  md:h-80 h-48 flex justify-center`}
        >
          <div
            className="w-48 h-48 md:w-72 md:h-72 md:mt-36 mt-16"
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
                className="rounded-full border-2 border-black w-48 h-48 md:w-72 md:h-72"
                onError={(e: any) => {
                  e.target.onerror = null;
                  // setImagePreview(
                  //   "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg"
                  // );
                }}
              />
            )}

            {!isProfileOwner && (
              <div className="absolute right-[20px] bottom-[20px]  md:right-[37px] md:bottom-[37px] opacity-90">
                <div className="">
                  <FaCircle
                    className={`${
                      status === "ONLINE"
                        ? "text-green-600 border-slate-950 border rounded-full"
                        : ""
                    } ${
                      status === "OFFLINE"
                        ? "text-red-600 border-slate-950 border rounded-full"
                        : ""
                    } ${
                      status != "ONLINE" && status != "OFFLINE" ? "hidden" : ""
                    }`}
                    size="20"
                  />
                  <div
                    className={`${status != "INGAME" ? "hidden" : ""} ${
                      status === "INGAME"
                        ? "text-white bg-black opacity-80 rounded-full p-2"
                        : ""
                    }`}
                  >
                    <PiGameControllerLight size="25" />
                  </div>
                </div>
              </div>
            )}
            {selectedFile && isDivVisible && (
              <div
                style={{
                  position: "absolute",
                  display: "inline-block",
                }}
                className="w-48 h-48 md:w-72 md:h-72 top-0 left-0 flex flex-col items-center justify-center rounded-full
                animate-moveLeftAndRight"
              >
                <button
                  onClick={() => {
                    handleUpload();
                    toggleDivVisibility();
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      display: "inline-block",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    className="bg-black w-48 h-48 md:w-72 md:h-72 rounded-full opacity-50 font-sans text-white text-lg font-medium"
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "inline-block",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      save &nbsp;
                      <CiSaveUp2
                        className="text-white inline-block"
                        size="22"
                      />
                    </div>
                  </div>
                </button>
              </div>
            )}
            <div
              className="mb-10 mr-10 md:mb-[58px] md:mr-[58px] opacity-90"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            >
              {isDivVisible && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute">
                    <label htmlFor="avatar" className="cursor-pointer">
                      <div className="bg-slate-300 mb-10 mr-10  md:mb-10 md:mr-10 rounded-full">
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
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [RouterName, setRouterName] = useState("profile");
  const pathname = usePathname();

  const context = useAppContext();

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
        if (data.success === true && data.empty == false) {
          context.setnotif(true);
        }
        if (data.success === true && data.empty == true) {
          context.setnotif(false);
        }
      }
    } catch (error: any) {
      const msg = "Error getting friends: " + error.message;
      toast.error(msg);
      console.error("Error getting friends:", error.message);
    }
  };

  const handleFriendshipRequest = () => {
    getFriends();
  };

  const listenForFriendships = () => {
    if (context.notifSocket !== null) {
      context.notifSocket.on("FriendShipRequest", handleFriendshipRequest);
    }
  };

  useEffect(() => {
    if (context.notifSocket) {
      listenForFriendships();
    }
  }, [user, context.notifSocket]);

  useEffect(() => {
    const segments = pathname.split("/");
    setRouterName(segments[1]);
  }, [pathname]);

  useEffect(() => {
    const checkJwtCookie = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
          {
            method: "GET",
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

  return (
    <div className="relative custom-height bg-[#292D39] ">
      <div className="absolute buttom-0 left-0 bg-[#292D39]">
        <div className=" custom-height fixed text-black bg-[#292D39]">
          <ul className="list-none text-center justify-center items-center w-[64px] bg-[#292D39]">
            <div className="flex flex-col justify-between custom-height bg-[#292D39]">
              <div className="">
                <li>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.01 }}
                  >
                    <IoHome
                      size="30"
                      className={`${
                        RouterName === "home"
                          ? "text-slate-50"
                          : "text-slate-500"
                      } hover:text-slate-50 mx-auto m-8`}
                    />
                  </motion.div>
                </li>
                <li>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${user?.intraId}`}
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.01 }}
                    >
                      <CgProfile
                        size="30"
                        className={`${
                          RouterName === "profile"
                            ? "text-slate-50"
                            : "text-slate-500"
                        } hover:text-slate-50 mx-auto m-8`}
                      />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/notif`}
                    className="relative"
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.01 }}
                    >
                      <IoMdNotificationsOutline
                        size="30"
                        className={`${
                          RouterName === "notif"
                            ? "text-slate-50"
                            : "text-slate-500"
                        } hover:text-slate-50 mx-auto m-8 `}
                      />
                      {context.notif && (
                        <div className="absolute top-0 right-4">
                          <FaCircleDot
                            size="16"
                            className="text-red-500 opacity-40"
                          />
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.01 }}
                  >
                    <MdLeaderboard
                      size="30"
                      className={`${
                        RouterName === "leaderboard"
                          ? "text-slate-50"
                          : "text-slate-500"
                      } hover:text-slate-50 mx-auto m-8`}
                    />
                  </motion.div>
                </li>
                <li>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.01 }}
                  >
                    <GrAchievement
                      size="30"
                      className={`${
                        RouterName === "acheivements"
                          ? "text-slate-50"
                          : "text-slate-500"
                      } hover:text-slate-50 mx-auto m-8`}
                    />
                  </motion.div>
                </li>
                <li>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3000/friends`}
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.01 }}
                    >
                      <FaUserFriends
                        size="30"
                        className={`${
                          RouterName === "friends"
                            ? "text-slate-50"
                            : "text-slate-500"
                        } hover:text-slate-50 mx-auto m-8`}
                      />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.01 }}
                  >
                    <GrGroup
                      size="30"
                      className={`${
                        RouterName === "groups"
                          ? "text-slate-50"
                          : "text-slate-500"
                      } hover:text-slate-50 mx-auto m-8`}
                    />
                  </motion.div>
                </li>
                <li>
                  <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat`}>
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.01 }}
                    >
                      <IoChatbubblesOutline
                        size="30"
                        className={`${
                          RouterName === "chat"
                            ? "text-slate-50"
                            : "text-slate-500"
                        } hover:text-slate-50 mx-auto m-8`}
                      />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.01 }}
                  >
                    <RiPingPongLine
                      size="30"
                      className={`${
                        RouterName === "play"
                          ? "text-slate-50"
                          : "text-slate-500"
                      } hover:text-slate-50 mx-auto m-8`}
                    />
                  </motion.div>
                </li>
              </div>
              <div>
                <li className="">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.01 }}
                    >
                      <CiLogout
                        size="30"
                        className={`text-slate-400 mx-auto m-8 hover:text-red-400`}
                      />
                    </motion.div>
                  </Link>
                </li>
              </div>
            </div>
          </ul>
        </div>
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

const Friend = ({
  isProfileOwner,
  userId,
  friendId,
}: {
  isProfileOwner: boolean;
  userId: string | undefined;
  friendId: string;
}) => {
  const context = useAppContext();

  const [friendshipStatus, setStatus] = useState<
    "NOTFRIENDS" | "PENDING" | "ACCEPTED" | "BLOCKED"
  >("NOTFRIENDS");

  const addfriend = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/addfriend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: `${userId}`,
            friendId: `${friendId}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        setStatus("NOTFRIENDS");
        toast.error("Error adding friend");
      } else {
        toast.success("Friend request sent");
      }
    } catch (error: any) {
      const msg = "Error adding friend: " + friendId;
      toast.error(msg);
      console.error("Error adding friend:", error.message);
    }
  };

  const blockFriend = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/blockfriend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: `${userId}`,
            friendId: `${friendId}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        toast.error("Error blocking friend");
      } else {
        toast.success("Friend blocked successfully");
      }
    } catch (error: any) {
      const msg = "Error adding friend: " + friendId;
      toast.error(msg);
      console.error("Error adding friend:", error.message);
    }
  };

  const removefrinship = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/removefrinship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: `${userId}`,
            friendId: `${friendId}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        toast.error("Error removing the friend");
      } else if (data.success === true) {
        toast.success("Friendship removed");
      }
    } catch (error: any) {
      toast.error("Error adding friend ");
      console.error("Error adding friend:", error.message);
    }
  };

  const [blocked, setblocked] = useState<boolean>(false);

  const FriendshipStatus = async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userId}/FriendshipStatus/${friendId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: any = await response.json();
      if (!data.success) {
        toast.error("Error during FriendshipStatus");
        return;
      }
      if (!data.friend) {
        setStatus("NOTFRIENDS");
      } else {
        setStatus(data.friend.friendshipStatus);
      }
      if (data.friend && data.friend.friendshipStatus) {
        if (
          data.friend &&
          data.friend.friendshipStatus === "BLOCKED" &&
          data.friend.friendId === userId
        ) {
          setblocked(true);
        }
      }
    } catch (error: any) {
      toast.error("Error during FriendshipStatus");
    }
  };

  useEffect(() => {
    FriendshipStatus();
  }, [userId]);

  return (
    <div>
      {!isProfileOwner && (
        <div
          className={`flex items-center justify-center text-white ${
            blocked ? " pointer-events-none" : ""
          }`}
        >
          <div className="mx-2">
            {friendshipStatus !== "ACCEPTED" &&
              friendshipStatus !== "PENDING" && (
                <button
                  className=""
                  onClick={() => {
                    addfriend();
                    if (context.notifSocket) {
                      context.notifSocket.emit("FriendShipRequest", {
                        userId: `${userId}`,
                        friendId: `${friendId}`,
                      });
                    }
                    setStatus("PENDING");
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.02 }}
                  >
                    <FiUserPlus size="25" />
                  </motion.div>
                </button>
              )}
            {friendshipStatus === "PENDING" && (
              <button
                className=""
                onClick={() => {
                  removefrinship();
                  if (context.notifSocket) {
                    context.notifSocket.emit("FriendShipRequest", {
                      userId: `${userId}`,
                      friendId: `${friendId}`,
                    });
                  }
                  setStatus("NOTFRIENDS");
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <FaUserTimes size="25" className="text-red-200" />
                </motion.div>
              </button>
            )}
            {friendshipStatus === "ACCEPTED" && (
              <button
                className=""
                onClick={() => {
                  removefrinship();
                  setStatus("NOTFRIENDS");
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <TbUserOff size="25" className="text-red-200" />
                </motion.div>
              </button>
            )}
          </div>
          <div className="mx-2">
            {friendshipStatus === "BLOCKED" && (
              <button
                className=""
                onClick={() => {
                  removefrinship();
                  setStatus("NOTFRIENDS");
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <CgUnblock size="27" className="text-white rotate-90" />
                </motion.div>
              </button>
            )}
            {friendshipStatus !== "BLOCKED" && (
              <button
                className=""
                onClick={() => {
                  blockFriend();
                  setStatus("BLOCKED");
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <MdOutlineBlock size="25" className="text-red-200" />
                </motion.div>
              </button>
            )}
          </div>
          <div>
            <button className="mx-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 }}
              >
                <BiMessageRounded size="25" />
              </motion.div>
            </button>
          </div>
          <div>
            <button className="mx-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 }}
              >
                <IoGameControllerOutline size="25" />
              </motion.div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Profile(params: any) {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
    // friendshipStatus,
    // setStatus,
  } = useAppContext();

  const [socket, setsocket] = useState<Socket | null>(null);

  const [userFromRoutId, setuserFromRoutId] = useState<User | undefined>(
    undefined
  );
  const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);

  useEffect(() => {
    setisSidebarVisible(window.innerWidth > 768);
  }, []);

  const addLogin = (isRegistred: any) => {
    if (isRegistred === false && isProfileOwner === true) {
      toggleDivVisibility();
      toast.success("🌟 Please update your nickname and avatar.", {
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
  }, [user?.login, isProfileOwner]);

  const getUserFromRoutId = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${params.params.intraId}`,
        {
          method: "GET",
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

  useEffect(() => {
    getUserFromRoutId();
  }, []);

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

  useEffect(() => {
    addLogin(user?.isRegistred);
  }, [user?.isRegistred, isProfileOwner]);

  const context = useAppContext();

  const createsocket = () => {
    const handleClientsConnection = `${process.env.NEXT_PUBLIC_API_URL}:3002/handleClientsConnection`;

    const cookies = new Cookies();
    const newSocket = io(handleClientsConnection, {
      auth: { jwt: cookies.get("jwt") },
    });

    setsocket(newSocket);
    context.setNotifSocket(newSocket);
  };

  useEffect(() => {
    if (!socket) {
      createsocket();
    }
  }, []);

  // const listenForFriendships = () => {
  //   if (socket !== null) {
  //     socket.on("FriendShipRequest", () => {
  //       console.log("FriendShipRequest");
  //       toast.success("New friend request");
  //       // getUserFromRoutId();
  //     });
  //   }
  // };

  useEffect(() => {
    const listenForEvents = () => {
      if (socket !== null) {
        socket.on("update", () => {
          getUserFromRoutId();
        });
      }
    };

    if (socket) {
      listenForEvents();

      // listenForFriendships();
      return () => {
        socket.off("update");
        // socket.off("FriendShipRequest");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (isProfileOwner === false) {
      setDivVisible(false);
    }
  }, [user]);

  if (!userFromRoutId) {
    return (
      <>
        <div className=" h-screen w-screen ">
          <Navbar isProfileOwner={isProfileOwner} />

          <div className="flex ">
            {isSidebarVisible && (
              <div className="w-16 custom-height ">
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <Sidebar />
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <Loading />
            </div>
          </div>
          <Toaster />
        </div>
      </>
    );
  }

  let Login = "Login";
  let intraId = "";
  let FullName = "Full Name";
  let isTfaEnabled = false;
  let level = "Level 6.31";
  let email = "Email";
  let IntraPic = "/gon.jpg";

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
    <div className=" min-h-screen w-screen bg-[#12141A]">
      <Navbar isProfileOwner={isProfileOwner} />

      <div className="flex ">
        {isSidebarVisible && (
          <div className="w-16 custom-height ">
            <div
              className={`transition-all duration-500 ease-in-out ${
                isSidebarVisible ? "w-16 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <UserProfileImage
            status={userFromRoutId?.status}
            isProfileOwner={isProfileOwner}
            src={IntraPic}
            intraId={intraId}
          />
          <div
            className={`${
              isDivVisible ? "md:mt-28 mt-10" : "md:mt-24 mt-12"
            } p-10`}
          >
            <UserDetailsCard value={Login} intraId={intraId} />
            <Friend
              isProfileOwner={isProfileOwner}
              userId={user?.intraId}
              friendId={params.params.intraId}
            />
            <TwoFactorAuth intraId={intraId} isTfa={isTfaEnabled} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
