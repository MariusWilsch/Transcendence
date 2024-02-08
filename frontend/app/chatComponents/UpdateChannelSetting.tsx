import { Button, Modal, ModalBody } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { User, useAppContext } from "../AppContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { CiSettings } from "react-icons/ci";
import ChannelAvatar from "./ChannelAvatar";
import { FaRegEdit } from "react-icons/fa";


async function updateChannel(channelId:string,Channelname: string,newName:string, type: string, password: string, owner: User) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/updateChannel/${owner.intraId}/${channelId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newName:`${newName}`,
          type: `${type}`,
          password: `${password}`,
        }),
      }
    );
    if (response.ok) {
      toast.success('channel updated successfuly')
    }
    else {
      const res = response.json();

    }
  }
  catch (e) {
    const msg = 'Error' + e;
    toast.error(msg);
  }
}
const UpdateChannelSetting = (props:any) => {

  const {member, firstMembers} = props; 
  const [opened, { open, close }] = useDisclosure(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [password, setPassword] = useState('');
  const context = useAppContext();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setChannelName('');
    setPassword('');
    close();
  };
  const handleSelectChange = (e: any) => {
    setChannelType(e.target.value);
  }
  const updateAChannel = (e: any) => {
    e.preventDefault();
    if (context.userData && context.channel) {
      if (channelType === "PROTECTED" && password.length < 3)
      {
        toast.error("error : password require more than 3 characters ");
        return;
      }
      if (context.channel)
      updateChannel(context.channel.id, context.channel.name,channelName===context.channel.name? '':channelName
                , !channelType ? context.channel.type:channelType, password
                , context.userData);
      handleSubmit(e);
    }
    else {
      toast.error('you should enter atleast the name of your channel');
    }
  }
  useEffect(() => {
    if (context.channel){
        setChannelName(context.channel.name);
    }

  }, [context.userData]);
  return (
    <>
      <Modal
      opened={opened}
      withCloseButton={false}
      onClose={close}  centered>
      <div className="pt-2" >
        <div className="flex flex-col justify-center items-center font-bold">
        <ChannelAvatar firstMembers={firstMembers}/>
        <h1 className="p-2">{!!context.channel ? context.channel.name.replace(context.channel.ownerId, ''):'placeHolder'} </h1>
        </div>
        <div className="mb-4">
          <label className="block text-white  mb-2">
            Update channel name
          </label>
          <input
            type="text"
            id="newChannelName"
            name="newChannelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="bg-[#66757F] text-white  rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-white  font-bold mb-2" >
            Type
          </label>
          <select
            id="SelectChoseBox"
            value={channelType}
            onChange={handleSelectChange}
            className="bg-[#66757F] text-white rounded w-full py-2 px-3 text-whiteleading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              update channel type
            </option>
            <option value="PUBLIC">Public</option>
            <option value="PROTECTED">Protected</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        {
          channelType === "PROTECTED" &&
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#66757F] text-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        }
        <div className="flex items-center justify-center p-3">
          <button
            onClick={(e) => {

              updateAChannel(e);
            }}
            className="bg-slate-700 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
        </div>
      </Modal>
      <div className="flex flex-row   justify-center space-x-3 text-white">
      <CiSettings className="text-white hover:scale-125" 
                     onClick={open}
        />
      </div>
    </>
  );
}

export default UpdateChannelSetting;