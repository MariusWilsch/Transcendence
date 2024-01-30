"use client";
import morti from "../../public/morti.json";
import Lottie from "lottie-react";

export const Loading = () => {
  return (
    <div className="bg-[#12141A] custom-height w-full flex items-center justify-center">
      <Lottie
        animationData={morti}
        className="w-40"
      />{" "}
    </div>
  );
};
