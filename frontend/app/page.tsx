"use client";

import Image from "next/image";
import logo from "../public/42_Logo.svg";
import Link from "next/link";
import { AppProvider } from "./AppContext";
import { CiLogin } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useParams, redirect, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [selectedId, setSelectedId] = useState<"LOGIN" | "SIGNEIN" | null>(
    null
  );

  const [login, setlogin] = useState("");
  const [password, setPassword] = useState("");

  const [usual_full_name, setusual_full_name] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [passwordsigne, setpasswordsigne] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      usual_full_name.trim().length === 0 ||
      passwordsigne.trim().length === 0 ||
      username.trim().length === 0 ||
      email.trim().length === 0
    ) {
      return toast.error("Please fill all the fields");
    }
    if (
      usual_full_name.trim().length > 100 ||
      passwordsigne.trim().length > 100 ||
      username.trim().length > 100 ||
      email.trim().length > 100
    ) {
      return toast.error("TOO LONG");
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            usual_full_name: usual_full_name,
            username: username,
            email: email,
            password: passwordsigne,
          }),
        }
      );

      const data = await res.json();
      if (data.succes === true) {
        toast.success("succesfully signed up");
        setTimeout(() => {
          toast.success("Loading ...");
        }, 400);
        return router.push(
          `${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${data.Id}`
        );
      } else if (data.succes === false) {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Error while signing up");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (login.trim().length === 0 || password.trim().length === 0) {
      return toast.error("Please fill all the fields");
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: login,
            password: password,
          }),
        }
      );

      const data = await res.json();

      if (data.succes === true) {
        toast.success("succesfully logged in");
        setTimeout(() => {
          toast.success("Loading ...");
        }, 400);
        if (data.Id) {
          return router.push(
            `${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${data.Id}`
          );
        } else {
          return router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/2FA`);
        }
      } else if (data.succes === false) {
        toast.error(data.message);
        console.log("Error : ", data);
      }
    } catch (e) {
      toast.error("Error while logging in");
    }
  };

  return (
    <>
      <AppProvider>
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/976873/pexels-photo-976873.jpeg)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content ">
            <div className="max-w-md  flex justify-center items-center flex-col">
              <h1 className="mb-5 text-5xl text-zinc-200 font-sans">
                Transcendence
              </h1>
              <p className="mb-5 text-zinc-300 font-sans">
                You can play Pong and chat with others.
              </p>
              <div className="m-2  w-52  justify-center items-center">
                <div className="w-52 flex flex-row justify-center items-cente">
                  <motion.div
                    layoutId={"LOGIN"}
                    onClick={() => setSelectedId("LOGIN")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className=" w-52 text-center flex justify-center flex-row bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                      <div className="flex justify-between items-center ">
                        Login &nbsp;
                        <CiLogin size="25" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedId === "LOGIN" && (
              <div className="w-screen h-screen flex justify-center items-center backdrop-blur-md">
                <div className="shadow-lg relative md:w-1/2  w-4/5  z-10 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
                  >
                    <IoClose size="30" className="text-gray-800 " />
                  </button>
                  <motion.div
                    layoutId={selectedId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-center items-center ">
                      <div className="z-20">
                        <div className="mt-14">
                          <div className="flex justify-center items-center">
                            <form
                              onSubmit={handleLogin}
                              className="rounded px-8 pt-6 pb-8 mb-4"
                            >
                              <div className="mb-4">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="login"
                                >
                                  User name
                                </label>
                                <input
                                  className=" border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800 appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                  id="login"
                                  type="text"
                                  placeholder="Login"
                                  name="login"
                                  value={login}
                                  onChange={(e) => setlogin(e.target.value)}
                                />
                              </div>

                              <div className="mb-6">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="password"
                                >
                                  Password
                                </label>
                                <input
                                  className="border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                  id="password"
                                  type="password"
                                  placeholder="Password"
                                  name="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                              <div className="flex items-center justify-center  ">
                                <button
                                  className="bg-blue-500 rounded-3xl w-full hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                                  type="submit"
                                >
                                  Log in
                                </button>
                              </div>
                              <div className="mt-10 flex items-center justify-center  ">
                                <Link
                                  href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
                                  className="  w-52  flex justify-center items-center"
                                >
                                  <div className="rounded-3xl w-52 flex justify-center items-center bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
                                    Log in with &nbsp;
                                    <Image
                                      src={logo}
                                      alt="42 logo"
                                      width={25}
                                      className="inline-block mr-2"
                                    />
                                  </div>
                                </Link>
                              </div>
                              <div className="m-2  w-52 flex  justify-center items-center">
                                <div className="cursor-pointer w-52 flex flex-row justify-between items-center">
                                  <motion.div
                                    layoutId={"SIGNEIN"}
                                    onClick={() => {
                                      setSelectedId(null);
                                      setTimeout(() => {
                                        setSelectedId("SIGNEIN");
                                      }, 500);
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    <div className="w-52 flex items-center justify-center rounded-3xl bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
                                      Sign in
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
            {selectedId === "SIGNEIN" && (
              <div className="w-screen h-screen flex justify-center items-center backdrop-blur-md">
                <div className="shadow-lg relative md:w-1/2  w-4/5  z-10 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
                  >
                    <IoClose size="30" className="text-gray-800 " />
                  </button>
                  <motion.div
                    layoutId={selectedId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-center items-center ">
                      <div className="z-20">
                        <div className="mt-14">
                          <div className="flex justify-center items-center">
                            <form
                              onSubmit={handleSubmit}
                              className="rounded px-8 pt-6 pb-8 mb-4"
                            >
                              <div className="mb-4">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="username"
                                >
                                  Full Name
                                </label>
                                <input
                                  className="border-gray-900 shadow bg-slate-100  appearance-none border  placeholder-gray-800  rounded w-full py-2 px-3 bg-opacity-10  text-black leading-tight focus:outline-none focus:shadow-outline"
                                  id="username"
                                  type="text"
                                  placeholder="Full name"
                                  name="username"
                                  value={usual_full_name}
                                  onChange={(e) =>
                                    setusual_full_name(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mb-4">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="login"
                                >
                                  User name
                                </label>
                                <input
                                  className=" border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800 appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                  id="login"
                                  type="text"
                                  placeholder="User name"
                                  name="login"
                                  value={username}
                                  onChange={(e) => setusername(e.target.value)}
                                />
                              </div>
                              <div className="mb-4">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="email"
                                >
                                  Email
                                </label>
                                <input
                                  className="border-gray-900 shadow bg-slate-100  bg-opacity-10  placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                                  id="email"
                                  type="email"
                                  placeholder="Email"
                                  name="email"
                                  value={email}
                                  onChange={(e) => setemail(e.target.value)}
                                />
                              </div>
                              <div className="mb-6">
                                <label
                                  className="block text-black text-sm font-bold mb-2"
                                  htmlFor="password"
                                >
                                  Password
                                </label>
                                <input
                                  className="border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                  id="password"
                                  type="password"
                                  placeholder="Password"
                                  name="password"
                                  value={passwordsigne}
                                  onChange={(e) =>
                                    setpasswordsigne(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-center  ">
                                <button
                                  className="bg-blue-500 rounded-3xl w-full hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                                  type="submit"
                                >
                                  Sign Up
                                </button>
                              </div>
                              <div className="mt-10 flex items-center justify-center  ">
                                <Link
                                  href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
                                  className="  w-52  flex justify-center items-center"
                                >
                                  <div className="rounded-3xl w-52 flex justify-center items-center bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
                                    Log in with &nbsp;
                                    <Image
                                      src={logo}
                                      alt="42 logo"
                                      width={25}
                                      className="inline-block mr-2"
                                    />
                                  </div>
                                </Link>
                              </div>
                              <div className="m-2  w-52 flex  justify-center items-center">
                                <div className="cursor-pointer w-52 flex flex-row justify-between items-center">
                                  <motion.div
                                    layoutId={selectedId}
                                    onClick={() => {
                                      setSelectedId(null);
                                      setTimeout(() => {
                                        setSelectedId("LOGIN");
                                      }, 500);
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    <div className="w-52 flex items-center justify-center rounded-3xl bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
                                      Login
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
            {selectedId === null && <div></div>}
          </AnimatePresence>
        </div>
        <Toaster />
      </AppProvider>
    </>
  );
}
