import { useEffect, useState } from "react";
import { User, useAppContext } from "../AppContext";
import toast from "react-hot-toast";
import Link from "next/link";


const CreateChannelForm = () => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      if (channelName && context.userData) {
        creatChannel(channelName, channelType, password, context.userData);
        handleSubmit(e);
      }
      else {
        toast.error('you should enter atleast the name of your channel');
      }
    }
    async function creatChannel(Channelname:string,type:string, password:string, owner:User){
      try{
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:3001/chat/createChannel/${owner.intraId}/${Channelname}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              type: `${type}`,
              password: `${password}`,
            }),
          }
        );
        if (response.ok)
        {
          toast.success('channel created successfuly')
        }
        else{
          const msg = 'Error: ' + response; 
          toast.error(msg);
        }
      }
      catch(e){
        const msg = 'Error' + e;
        toast.error(msg);
      }
      finally{
        setLoading(false);
      }
    }
    useEffect(()=>{

    }, [context.userData, loading]);
    if (loading){
      return (<div>Loading.....</div>)
    }
    return (
      // <form onSubmit={createAChannel} className="max-w-md mx-auto mt-8">
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" flex flex-col justify-center items-center border w-80 h-80 p-4">
        <h1 className="p-4">Create channel</h1>
        <div className="mb-4 w-fit h-fit border">
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
        <div className="w-fit h-fit border">
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
          <div className="mb-4 w-fit h-fit border">
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
        <div className="flex items-center justify-between border">
          <Link
          href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels/`}
          >
          <button
            onClick={createAChannel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 p-2 rounded focus:outline-none focus:shadow-outline"
            >
            Create Channel
          </button>
          </Link>
        </div>
        {/* </form> */}
    </div>
      </div>
    );
  };

  export default CreateChannelForm;