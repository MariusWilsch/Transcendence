"use client";

import Image from "next/image";
import logo from "./42_Logo.svg";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button className="bg-white hover:bg-gray-500 text-black font-bold py-2 px-4 rounded">
        Log in with {' '}
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
