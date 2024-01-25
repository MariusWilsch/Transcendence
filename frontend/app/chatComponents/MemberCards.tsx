import { MemberShip } from "../AppContext";
import MemberCard from "./MemberCard";


const MemberCards = (props: any) => {
    const {members, currentMember} = props;
    return (
      <div className="space-y-2">
        {
          members?.filter((member:MemberShip)=>member.memberId !== currentMember?.memberId).map((member: any, index: number) => (
            <MemberCard key={index} member={member} currentMember={currentMember} />
          )
          )
        }
      </div>
    )
  }

  export default MemberCards;