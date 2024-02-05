import { IoMdArrowBack } from "react-icons/io";
import { useAppContext } from "../AppContext";
import { Friend } from "../components/Friend";
import UserProfileImage from "./UderProfileImage";


function extractDate(isoDateString: string): string | null {
    if (!isoDateString)
    {
      return null;
    }
    const date = new Date(isoDateString);
  
    if (isNaN(date.getTime())) {
      console.error("Invalid date format");
      return null;
    }
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

const ProfileInfo = ({ recipient }: any) => {
    const context = useAppContext();
    return (
      <div className="flex flex-col border border-[#292D39]  w-full h-full  lg:w-2/5 overflow-hidden  items-center p-4">
        <div className='w-full '>
        <IoMdArrowBack style={{'display':!context.responsive ? "":"none"}} className=" text-white w-8 h-8 hover:cursor-pointer hover:scale-110 " onClick={() => context.setComponent("conversation")} />
        </div>
        <div className=''>
        {
          recipient?.Avatar &&
          <UserProfileImage
          status={"ONLINE"}
          isProfileOwner={false}
          src={recipient?.Avatar}
          intraId={recipient?.intraId}
          />}
        <Friend
          isProfileOwner={false}
          friendId={recipient?.intraId}
          userId={context.userData?.intraId}
          inChat={true}
          />
          </div>
        <div className='flex flex-col  justify-center mt-4 items-center  px-1 w-3/4 h-fit bg-[#1a1d24] rounded border border-[#292D39] p-2'>
          <div  className='flex flex-col   w-11/12 '>
            <h1 className='text-white p-2 text-base'>Login </h1>
            <p className=' text-white px-2 pb-1'>{recipient?.login}</p>
          </div>
          <div className='flex flex-col border-t border-[#292D39] w-11/12'>
            <h1 className=' text-white p-2 text-base '>Full name </h1>
            <p className='text-white px-2 pb-1'>{recipient?.fullname}</p>
          </div>
          <div className='flex flex-col border-t border-[#292D39]   w-11/12'>
            <h1 className='text-white p-2 text-base '>Member since </h1>
            <p className='text-white px-2 pb-2'>{extractDate(recipient?.created_at)}</p>
          </div>
        </div>
  
      </div>
    );
  }

  export default ProfileInfo;