"use client";

import Image from "next/image";
import logo from "../public/42_Logo.svg";
import Link from "next/link";
import { AppProvider } from "./AppContext";
import { CiLogin } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Home() {
  const [selectedId, setSelectedId] = useState<"LOGIN" | "SIGNEIN" | null>(
    null
  );

  return (
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
              <div className="w-52 flex flex-row justify-center items-center bg-red-500">
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
              <div className=" relative md:w-1/2  w-4/5 md:h-1/2 h-4/5 z-10 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl">
                <button
                  onClick={() => setSelectedId(null)}
                  className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
                >
                  <IoClose size="30" className="text-gray-800 " />
                </button>
                <motion.div
                  layoutId={selectedId}
                  key="modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-red-600 flex justify-center items-center ">
                    <div className="bg-red-950 z-20">
                      <div className="bg-black">SIGNEIN contente</div>

                      <Link
                        href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
                        className="bg-red-700  w-52  flex justify-center items-center"
                      >
                        <div className=" w-52 bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                          Log in with &nbsp;
                          <Image
                            src={logo}
                            alt="42 logo"
                            width={25}
                            className="inline-block mr-2"
                          />
                        </div>
                      </Link>
                      <div className="m-2  w-52  justify-center items-center">
                        <div className="w-52 flex flex-row justify-between items-center">
                          &nbsp;&nbsp;
                          <motion.div
                            layoutId={"SIGNEIN"}
                            onClick={() => {
                              setSelectedId(null);
                              setTimeout(() => {
                                setSelectedId("SIGNEIN");
                              }, 500);
                              // setSelectedId("SIGNEIN");
                            }}
                          >
                            <div className="w-52 bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                              SIGNEIN in
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button onClick={() => setSelectedId(null)} />
                </motion.div>
              </div>
            </div>
          )}
          {selectedId === "SIGNEIN" && (
            <div className="w-screen h-screen flex justify-center items-center backdrop-blur-md">
              <div className=" relative md:w-1/2  w-4/5 md:h-1/2 h-4/5 z-10 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl">
                <button
                  onClick={() => setSelectedId(null)}
                  className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
                >
                  <IoClose size="30" className="text-gray-800 " />
                </button>
                <motion.div
                  layoutId={selectedId}
                  key="modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-red-600 flex justify-center items-center ">
                    <div className="bg-red-950 z-20">
                      <div className="bg-black">LOGIN contente</div>
                    </div>
                  </div>

                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
                    className="bg-red-700  w-52  flex justify-center items-center"
                  >
                    <div className=" w-52 bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                      Log in with &nbsp;
                      <Image
                        src={logo}
                        alt="42 logo"
                        width={25}
                        className="inline-block mr-2"
                      />
                    </div>
                  </Link>
                  <div className="m-2  w-52  justify-center items-center">
                    <div className="w-52 flex flex-row justify-between items-center">
                      <motion.div
                        layoutId={"LOGIN"}
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
                        <div className="w-52 bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
                          Login
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.button onClick={() => setSelectedId(null)} />
                </motion.div>
              </div>
            </div>
          )}
          {selectedId === null && <div></div>}
        </AnimatePresence>
      </div>
    </AppProvider>
  );
}
