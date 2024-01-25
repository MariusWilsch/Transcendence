import { useState } from "react";
import { useAppContext } from "../AppContext";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { Button, Popover } from "@mantine/core";
import { channel } from "diagnostics_channel";

const JoinProtectedChannel = ({ selectedChannel }: any) => {
    const context = useAppContext();
    const [password, setPassword] = useState('');
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        handleSubmit(password);
        setPassword('');
      }
    }
    const handleSubmit = (pass: string) => {
      if (context.socket && ((selectedChannel.type === "PROTECTED" && pass) || (selectedChannel.type !== "PROTECTED" && pass === "default"))) {
        const cookie = new Cookies();
        const jwt = cookie.get('jwt');
        context.socket.emit('JoinAChannel', { channelId: selectedChannel.name, type: selectedChannel.type, password: pass, jwt})
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
              <Button>JOIN</Button>
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
          <Button onClick={() => handleSubmit("default")}>JOIN</Button>
        }
      </>
    );
  }

  export default JoinProtectedChannel;