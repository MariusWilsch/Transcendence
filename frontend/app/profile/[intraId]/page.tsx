"use client";

import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { use, useEffect, useState, useRef } from "react";
import { useAppContext, AppProvider, User } from "../../AppContext";
import { io, Socket } from "socket.io-client";
import Cookies from "universal-cookie";
import { Loading } from "../../components/Loading";
import { Navbar } from "../../components/Navbar";
import { UserDetailsCard } from "../../components/UserDetailsCard";
import { UserProfileImage } from "../../components/UserProfileImage";
import { Sidebar } from "../../components/Sidebar";
import { TwoFactorAuth } from "../../components/TwoFactorAuth";
import { Friend } from "../../components/Friend";
import { useParams, redirect, useRouter } from "next/navigation";
import loading from "../../../public/loading.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { AchievementCard } from "@/app/components/AchievementCard";

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
  } = useAppContext();
  const router = useRouter();

  const [socket, setsocket] = useState<Socket | null>(null);

  const [userFromRoutId, setuserFromRoutId] = useState<User | undefined>(
    undefined
  );
  const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

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
    // let timeoutId: any;
    // if (!user) {
    //   timeoutId = setTimeout(() => {
    //     toast.error("Please login first");
    //   }, 5000);
    // }
    // return () => {
    //   clearTimeout(timeoutId);
    // };
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
    <div className=" min-h-screen w-screen bg-[#12141A] relative">
      <div className="z-0 absolute w-auto h-auto overflow-hidden inset-0 mt-80">
        <Lottie
          animationData={loading}
          className="w-auto h-auto"
          onDOMLoaded={(e) => {
            lottieRef.current?.setSpeed(0.05);
          }}
          lottieRef={lottieRef as any}
        />
      </div>

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

        <div className="z-10 relative flex-1 overflow-y-auto">
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
            {user !== null ? (
              <Friend
                isProfileOwner={isProfileOwner}
                userId={user?.intraId}
                friendId={params.params.intraId}
              />
            ) : (
              <div className="skeleton flex items-center justify-center text-gray-400">
                Loading...
              </div>
            )}
            <TwoFactorAuth intraId={intraId} isTfa={isTfaEnabled} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
