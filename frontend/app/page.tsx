"use client";

import Image from "next/image";
import logo from "../public/42_Logo.svg";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  return (
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
          <h1 className="mb-5 text-5xl font-bold">ft_transcendence</h1>
          <p className="mb-5">
            You can play Pong and chat with others.
          </p>
          <Link
          href="http://localhost:3001/auth/42"
          className="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
        Log in with{" "}
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
  );
}
