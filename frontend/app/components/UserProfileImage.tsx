"use client";

import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { use, useEffect, useState } from "react";
import { useAppContext, AppProvider, User } from "../AppContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiSaveUp2 } from "react-icons/ci";
import { FaCircle } from "react-icons/fa";
import { PiGameControllerLight } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";

export const UserProfileImage = ({
  status,
  isProfileOwner,
  src,
  intraId,
}: {
  status: string | undefined;
  isProfileOwner: boolean;
  src: string;
  intraId: string | undefined;
}) => {
  const {
    user,
    setUser,
    isDivVisible,
    toggleDivVisibility,
    setDivVisible,
    isSidebarVisible,
    setisSidebarVisible,
    toggleSidebarVisibleVisibility,
  } = useAppContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    setImagePreview(src);
  }, []);

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const previewURL = URL.createObjectURL(file);

      setImagePreview(previewURL);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/avatar`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success === false) {
          toast.error("Failed to update login avatar");
          console.log("Failed to update login avatar");
        } else {
          toast.success("avatar updated successfully");
          console.log("avatar updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update avatar");
        console.error("Error during POST request:", error);
      }
      setSelectedFile(null);
    } else {
      toast.error("Please select a file");
      console.log("Please select a file");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${
            isSidebarVisible ? "backgroundDiv" : "backgroundDivNotVisible"
          } backgroundDiv  md:h-80 h-48 flex justify-center relative`}
        >
          {/* <div
            className={`absolute md:h-80 h-48 w-full flex justify-center items-center`}
          >
            <div className="flex flex-row justify-between gap-5 bg-blue-950 bg-opacity-50 w-5/6 h-5/6">
              <div className="w-1/3 bg-red-950 bg-opacity-30">hello</div>
              <div className="w-1/3 h-1/2 bg-red-950 bg-opacity-30 ">number of online friends</div>
              <div className="w-1/3 bg-red-950 bg-opacity-30">win percentage
               + number of games played</div>
            </div>
          </div> */}

          <div
            className="w-48 h-48 md:w-72 md:h-72 md:mt-36 mt-16"
            style={{ position: "relative", display: "inline-block" }}
          >
            {imagePreview && (
              <Image
                unoptimized={true}
                src={imagePreview}
                alt="image Preview"
                width={300}
                height={300}
                priority={true}
                quality={100}
                className="rounded-full border-2 border-black w-48 h-48 md:w-72 md:h-72"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src =
                    "http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg";
                }}
              />
            )}

            {!isProfileOwner && (
              <div className="absolute right-[20px] bottom-[20px]  md:right-[37px] md:bottom-[37px] opacity-90">
                <div className="">
                  <FaCircle
                    className={`${
                      status === "ONLINE"
                        ? "text-green-600 border-slate-950 border rounded-full"
                        : ""
                    } ${
                      status === "OFFLINE"
                        ? "text-red-600 border-slate-950 border rounded-full"
                        : ""
                    } ${
                      status != "ONLINE" && status != "OFFLINE" ? "hidden" : ""
                    }`}
                    size="20"
                  />
                  <div
                    className={`${status != "INGAME" ? "hidden" : ""} ${
                      status === "INGAME"
                        ? "text-white bg-black opacity-80 rounded-full p-2"
                        : ""
                    }`}
                  >
                    <PiGameControllerLight size="25" />
                  </div>
                </div>
              </div>
            )}
            {selectedFile && isDivVisible && (
              <div
                style={{
                  position: "absolute",
                  display: "inline-block",
                }}
                className="w-48 h-48 md:w-72 md:h-72 top-0 left-0 flex flex-col items-center justify-center rounded-full
                  animate-moveLeftAndRight"
              >
                <button
                  onClick={() => {
                    handleUpload();
                    toggleDivVisibility();
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      display: "inline-block",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    className="bg-black w-48 h-48 md:w-72 md:h-72 rounded-full opacity-50 font-sans text-white text-lg font-medium"
                  >
                    <div
                      style={{
                        position: "absolute",
                        display: "inline-block",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      save &nbsp;
                      <CiSaveUp2
                        className="text-white inline-block"
                        size="22"
                      />
                    </div>
                  </div>
                </button>
              </div>
            )}
            <div
              className="mb-10 mr-10 md:mb-[58px] md:mr-[58px] opacity-90"
              style={{ position: "absolute", bottom: 0, right: 0 }}
            >
              {isDivVisible && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: -100, x: -100 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <div className="absolute">
                    <label htmlFor="avatar" className="cursor-pointer">
                      <div className="bg-slate-300 mb-10 mr-10  md:mb-10 md:mr-10 rounded-full">
                        <CiCirclePlus
                          className="text-black "
                          size="25"
                          onChange={handleFileChange}
                        />
                      </div>

                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="inset-0 cursor-pointer bg-black hidden"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
