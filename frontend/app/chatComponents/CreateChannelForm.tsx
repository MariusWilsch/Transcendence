import { useState } from "react";
import { useAppContext } from "../AppContext";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";

const CreateChannelForm = () => {
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState('PUBLIC');
    const [password, setPassword] = useState('');
    const context = useAppContext();
  
    const handleSubmit = (event: any) => {
      event.preventDefault();
      setChannelName('');
      setPassword('');
    };
    const handleSelectChange = (e: any) => {
      setChannelType(e.target.value);
    }
    const createAChannel = (e: any) => {
      e.preventDefault();
      if (context.socket && channelName) {
        const cookie = new Cookies();
        const jwt = cookie.get('jwt')
        context.socket.emit("createChannel", { jwt, name: channelName, typePass: { type: channelType, password: password } }, () => {
          console.log({ owner: context.userData.intraId, name: channelName, typePass: { type: channelType, password: password } })
        });
        handleSubmit(e);
      }
      else {
        toast.error('you should enter atleast the name of your channel');
      }
    }
    // useEffect(()=>{
    //   console.log('i did mount');
    // }, [channelType]);
    return (
      // <form onSubmit={createAChannel} className="max-w-md mx-auto mt-8">
      <>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            name="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2" >
            Type
          </label>
          <select
            id="choseBox"
            value={channelType}
            onChange={handleSelectChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        }
        <div className="flex items-center justify-between">
          <button
            onClick={createAChannel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Channel
          </button>
        </div>
        {/* </form> */}
      </>
    );
  };

  export default CreateChannelForm;