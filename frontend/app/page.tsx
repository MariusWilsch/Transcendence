"use client";

import Image from "next/image";
import logo from "../public/42_Logo.svg";
import Link from "next/link";
import { useEffect } from "react";


export default function Home() {

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
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
  );
}
