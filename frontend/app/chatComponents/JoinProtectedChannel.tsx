import { useState } from "react";
import { User, useAppContext } from "../AppContext";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { Button, Popover } from "@mantine/core";
import Link from "next/link";

const JoinProtectedChannel = ({ selectedChannel }: any) => {
    const context = useAppContext();
    const [password, setPassword] = useState('');
    const [loading, seLoading] = useState(false);
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        handleSubmit(password);
        setPassword('');
      }
    }

async function joinChannel(channelId: string, type: string, password: string, user: User) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/joinChannel/${user.intraId}/${channelId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          channelId:`${channelId}`,
          type: `${type}`,
          password: `${password}`,
        }),
      }
    );
    if (response.ok) {
      const res = await response.json();
      toast.success('Joined channel');
    } else {
      const errorData = await response.json();
      throw new Error(`Failed to join channel: ${errorData.message}`);
    }
  } catch (error:any) {
    const msg = `Error: ${error.message}`;
    toast.error(msg);
  }
}
    const handleSubmit = (pass: string) => {
      if (context.userData && ((selectedChannel.type === "PROTECTED" && pass) || (selectedChannel.type !== "PROTECTED" && pass === "default"))) {
        joinChannel(selectedChannel.name, selectedChannel.type,password, context.userData)
      }
      else {
        toast.error('enter a password first');
      }
      setPassword('');
    }
    return (
      <>
        {
          selectedChannel.type === "PROTECTED" &&
          <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
            <Popover.Target>
              <button className="p-2 text-blue-700 font-bold" >JOIN</button>
            </Popover.Target>
            <Popover.Dropdown>
              <div className="flex ">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  type="password"
                  placeholder="password"
                />
                <Button onClick={() => handleSubmit(password)}>submit</Button>
              </div>
            </Popover.Dropdown>
          </Popover>
        }
        {
          selectedChannel.type !== "PROTECTED" &&
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels/${selectedChannel.id}`}><button className="p-2 text-blue-700 font-bold" onClick={() => handleSubmit("default")}>JOIN</button></Link>
        }
      </>
    );
  }

  export default JoinProtectedChannel;