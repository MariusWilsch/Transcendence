"use client";

import Image from "next/image";
import logo from "../public/42_Logo.svg";
import Link from "next/link";
import { AppProvider } from './AppContext'


export default function Home() {

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
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl text-zinc-200 font-sans">Transcendence</h1>
          <p className="mb-5 text-zinc-300 font-sans">
            You can play Pong and chat with others.
          </p>
          <Link
          href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
          className="bg-zinc-200 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
        Log in with &nbsp;
        <Image
          src={logo}
          alt="42 logo"
          width={25}
          className="inline-block mr-2"
        />
        </Link>
        </div>
      </div>
    </div>
    </AppProvider>

  );
}
