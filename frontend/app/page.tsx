"use client";

import Image from "next/image";
import logo from "./42_Logo.svg";
// import { useRouter } from 'next/router';


export default function Home() {
  const handleLoginClick = async () => {
    try {
      window.location.href = 'http://localhost:3001/auth/42';
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        className="bg-white hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        onClick={handleLoginClick}
      >
        Log in with{" "}
        <Image
          src={logo}
          alt="42 logo"
          height={25}
          width={25}
          className="inline-block mr-2"
        />
      </button>
    </div>
  );
}
