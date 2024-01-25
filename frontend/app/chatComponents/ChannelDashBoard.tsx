import { useEffect, useState } from "react";
import { MemberShip, useAppContext } from "../AppContext";
import { IoMdArrowBack } from "react-icons/io";
import { CiLogout, CiSettings } from "react-icons/ci";
import { FcInvite } from "react-icons/fc";
import MemberCards from "./MemberCards";
import ChannelAvatar from "./ChannelAvatar";
import { getChannelFirstMembers, searchMember } from "../utiles/utiles";
import Cookies from "universal-cookie";


const ChannelDashBoard = (props: any) => {
    const [query, setQuery] = useState('');
    const [members, setmembers] = useState<MemberShip[] | []>();
    const {firstMembers , channelId, currentMember} = props;
    const context = useAppContext();
    useEffect(() => {
      const fetchAvatar = async () => {
        const members = await getChannelFirstMembers(channelId);
      }
      fetchAvatar();
    }, [channelId])
    useEffect(() => {
      const search = async () => {
          const members = await searchMember(query, channelId); 
          setmembers(members);
      }
        query && search();
    }, [query])
    const handleQuery = (event: any) => {
      event.preventDefault(); // Fix the typo here
      setQuery(event.target.value);
    };
    const handleLeavingChannel=()=>{
        if (context.socket){
            const cookie = new Cookies();
            const jwt = cookie.get('jwt')
            context.socket.emit('LeaveTheChannel',{jwt});
          }
    }
    return (
      <div className="flex flex-col w-full  lg:w-1/5 overflow-hidden border border-[#292D39]">
  <div className='w-full '>
        <IoMdArrowBack className=" text-white w-8 h-8 hover:cursor-pointer hover:scale-110  xl:hidden" onClick={() => context.setComponent("conversation")} />
        </div>      <div className="p-4 mt-20 flex flex-col justify-center items-center ">
          {firstMembers && <ChannelAvatar firstMembers={firstMembers} />}
          <div className="flex flex-row p-3 space-x-3">
        <CiLogout onClick={handleLeavingChannel}  className="text-red-900   hover:scale-125" />
        <CiSettings className="text-white hover:scale-125" 
                    onClick={()=>{
                      console.log('change the channel Settings');
                    }}
        />
        <FcInvite 
          className="text-white hover:scale-125" 
          onClick={()=>{
            console.log('Invite pep');
          }}
        />
        </div>
        </div>
        <div className='justify-center items-center text-white  border border-[#292D39] p-4'>
          <h1 className="text-center">{channelId}</h1>
        </div>
        <div className="info-card text-white p-4 m-5border border-[#292D39] ">
          <h1 className="text-start"> Members :</h1>
        </div>
        <div className=" text-white p-4 w-full">
          <label className="">
            <input
              id="searchField"
              name={`inputValue${Math.random()}`}
              type="text"
              value={query}
              placeholder="Search for a member ..."
              onChange={handleQuery}
              className="  bg-[#1E2028] w-full items-center justify-center p-2 rounded-lg border border-[#292D39]   text-sm outline-none text-white"
            />
          </label>
        </div>
        <div className="p-3 h-2/5 overflow-hidden scroll-m-0">
          {members && <MemberCards members={members} currentMember={currentMember} />}
        </div>
      </div>
    );
  }

  export default ChannelDashBoard;