import { Button, Modal, ModalBody } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import { User, useAppContext } from "../AppContext";
import toast from "react-hot-toast";
import Link from "next/link";


const CreateChannelModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [password, setPassword] = useState('');
  const context = useAppContext();
  
  async function creatChannel(Channelname: string, type: string, password: string, owner: User) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/createChannel/${owner.intraId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            channelName:`${Channelname}`,
            type: `${type}`,
            password: `${password}`,
          }),
        }
      );
      const res = await response.json();
      if (response.ok) {
        res.sucess ? toast.success('channel created successfuly') : toast.error(res.error);
        context.setTrigger(!context.trigger);
      }
      else {
        const msg = 'Error: ' + res.error;
        toast.error(msg);
      }
    }
    catch (e) {
      const msg = 'Error' + e;
      toast.error(msg);
    }
  }
  const handleSubmit = () => {
    setChannelName('');
    setPassword('');
    close();
  };
  const handleSelectChange = (e: any) => {
    setChannelType(e.target.value);
  }
  const createAChannel = (e: any) => {
    e.preventDefault();
    if (channelName && context.user) {
      if (channelType === "PROTECTED" && password.length < 3)
      {
        toast.error("error : password require more than 3 characters ");
        return;
      }
      creatChannel(channelName, channelType, password, context.user);
      handleSubmit();
    }
    else {
      toast.error('you should enter atleast the name of your channel');
    }
  }
  useEffect(() => {

  }, [context.user]);
  return (
    <>
      <Modal
      opened={opened}
      withCloseButton={false}
      onClose={close}  centered>
      <div className="pt-2" >
        <div className="mb-4">
          <label className="block text-white  mb-2">
            Channel name
          </label>
          <input
            type="text"
            id="channelNameField"
            name="channelName"
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
            id="choseBox"
            value={channelType}
            onChange={handleSelectChange}
            className="bg-[#66757F] text-white rounded w-full py-2 px-3 text-whiteleading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Select the channel type
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
              id="passwordForm"
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

              createAChannel(e);
            }}
            className="bg-slate-700 mt-2 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Channel
          </button>
        </div>
        </div>
      </Modal>
      <div className="flex flex-row   justify-center space-x-3 text-white">
        <Button color={'violet'} className="rounded"
          onClick={open}
        >
          + Add a channel
        </Button>
      </div>
    </>
  );
}

export default CreateChannelModal;