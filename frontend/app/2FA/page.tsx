"use client";
import React, { use, useEffect, useState } from "react";
import { useAppContext, AppProvider } from "../AppContext";
import { Loading, User } from "../profile/page";
import { useRouter } from 'next/navigation'
import Cookies from "universal-cookie";

const cookies = new Cookies();

const TwoFactorVerification = () => {

  const [ id , setId ] = useState("");

  useEffect(() => {
    const id = cookies.get('id');
    console.log("id: ", id);
    setId(id);
  } ,[]);

  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const [yourCookieValue, setYourCookieValue] = useState('');

  if (!id) {
    return <Loading />;
  }

  const handleResend = async () => {
    // Make an API call to verify the OTP on the server
    // ...

    // Update the state based on the API response
    setIsVerified(true); // Set to true if OTP is verified
  };

  const handleVerify = async () => {

    if (otp.length != 6) {
      console.log("Invalid OTP");
      return;
    }
    try {
      console.log("valid OTP");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/verifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ otp: otp }),
        }
      )
      const responseData = await response.json();
      console.log("responseData: ", responseData.sucess);

      if (responseData.sucess) {
        router.push('/profile')
      } else {
        console.log("OTP not verified");
      }
    } catch (error: any) {
      console.error("Error uploading otp: ", error.message);
    }
  };

  return (
    <div className="h-screen bg-slate-400 flex flex-row">
      <div className="flex flex-col justify-center items-center w-1/2">
        <h1 className="text-4xl font-bold text-white mb-4">2FA Verification</h1>
        <p className="text-white text-center">
          Enter the OTP sent to your registered email address to verify your
          account.
        </p>
      </div>
      <div className="w-1/2 bg-slate-300 flex items-center">
        <div className="max-w-md mx-auto p-4 bg-slate-300 rounded-md shadow-md">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black font-sans">
              Two-Factor Authentication Verification
            </h2>
            <label className="block mb-4 text-black font-sans">
              Enter OTP:
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full border p-2 mt-1 rounded-md bg-slate-100 focus:outline-none focus:border-stone-400"
              />
            </label>
            <button
              onClick={handleVerify}
              className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Verify
            </button>
            &nbsp;
            <button
              onClick={handleResend}
              className="bg-slate-400 text-white px-4 py-2 rounded-md mt-4 hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-300"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
