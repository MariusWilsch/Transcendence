"use client";

import Image from "next/image";
import logo from "../../public/42_Logo.svg";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useParams, redirect, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext, AppProvider, User } from "../AppContext";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    resize();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);


  const router = useRouter();
  const contex = useAppContext();
  const gallery = useRef(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });
  const { height } = dimension;
  const y1 = useTransform(scrollYProgress, [0, 1], [-height * 0.9, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -height * 0.9]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-height * 0.9, 0]);

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

      if (data !== null && data !== undefined) {
        contex.setUser(data);
        if (data.intraId) {
          toast("Welcome back " + data.login + " !", {
            style: {
              border: "1px solid",
              padding: "16px",
            },
            icon: "👋",
          });
          // return router.push(
          //   `${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${data.intraId}`
          // );
        }
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    checkJwtCookie();
  }, []);

  const [selectedId, setSelectedId] = useState<"LOGIN" | "SIGNEIN" | null>(
    null
  );

  const [login, setlogin] = useState("");
  const [password, setPassword] = useState("");

  const [usual_full_name, setusual_full_name] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [passwordsigne, setpasswordsigne] = useState("");

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

  // bg-[#12141A]

  return (
    <div className="h-[200vh] bg-[#12141A]">
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
                Explore the ultimate Pong gaming hub on our website! Enjoy
                classic gameplay with modern features, including one-on-one
                matches and multiplayer modes with integrated chat. All skill
                levels are welcome in our vibrant community for exciting matches
                and social connections!
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
                    <div className=" w-52 text-center flex justify-center flex-row bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-3xl">
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
        <div
          ref={gallery}
          className="flex flex-col h-1/2 overflow-hidden relative "
        >
          <div className="flex flex-row h-1/2 overflow-hidden pb-40 translate-y-32 mr-10 ml-10">
            <Column y1={y1} />
            <Column y1={y2} />
            <Column y1={y3} />
          </div>
          <footer className="footer footer-center p-10 text-primary-content">
            <aside className="text-white">
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="inline-block fill-current"
              >
                <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
              </svg>
              <p className="font-bold text-white">
                ACME Industries Ltd. <br />
                Providing reliable tech since 1992
              </p>
              <p className="text-white">
                Copyright © 2024 - All right reserved
              </p>
            </aside>
            <nav>
              <div className="grid grid-flow-col gap-4 text-white">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </nav>
          </footer>
        </div>
        <Toaster />
      </AppProvider>
    </div>
  );
}

import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Column = ({ y1 }: { y1: any }) => {
  return (
    <div className="w-1/3 overflow-hidden">
      <motion.div
        className="relative mt-32 flex flex-col items-center  w-full "
        style={{ y: y1 }}
      >
        <div className="absolute z-0 top-10 w-5/6 h-[92%] bg-slate-50 border border-zinc-400 shadow-md rounded-2xl"></div>
        <Image
          src={
            "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg"
          }
          alt="42 logo"
          width={100}
          height={100}
          className="z-10 w-3/6 rounded-2xl border border-gray-800"
        />
        <div className="z-10 m-4 text-gray-800 ">Imad Mimouni</div>
        <div className="z-10 m-4 flex flex-row justify-center items-center">
          <FaGithub size="25" className=" text-gray-800 m-2" />
          <FaLinkedin size="25" className=" text-gray-800 m-2" />
        </div>
      </motion.div>
      <motion.div
        style={{ y: y1 }}
        className=" relative mt-32 flex flex-col items-center  w-full"
      >
        <div className="absolute z-0 top-10 w-5/6 h-[92%] bg-slate-50 border border-zinc-400 shadow-md rounded-2xl"></div>
        <Image
          src={
            "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg"
          }
          alt="42 logo"
          width={100}
          height={100}
          className="z-10 w-3/6 rounded-2xl border border-gray-800"
        />
        <div className="z-10 m-4 text-gray-800 ">Imad Mimouni</div>
        <div className="z-10 m-4 flex flex-row justify-center items-center">
          <FaGithub size="25" className=" text-gray-800 m-2" />
          <FaLinkedin size="25" className=" text-gray-800 m-2" />
        </div>
      </motion.div>
      <motion.div
        style={{ y: y1 }}
        className=" relative mt-40 flex flex-col items-center  w-full"
      >
        <div className="absolute z-0 top-10 w-5/6 h-[92%] bg-slate-50 border border-zinc-400 shadow-md rounded-2xl"></div>
        <Image
          src={
            "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg"
          }
          alt="42 logo"
          width={100}
          height={100}
          className="z-10 w-3/6 rounded-2xl border border-gray-800"
        />
        <div className="z-10 m-4 text-gray-800 ">Imad Mimouni</div>
        <div className="z-10 m-4 flex flex-row justify-center items-center">
          <FaGithub size="25" className=" text-gray-800 m-2" />
          <FaLinkedin size="25" className=" text-gray-800 m-2" />
        </div>
      </motion.div>
    </div>
  );
};
