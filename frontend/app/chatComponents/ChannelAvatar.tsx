import { Avatar, AvatarGroup } from "@mantine/core"
import { MemberShip } from "../AppContext"


const ChannelAvatar = ({ firstMembers }: any) => {
    return (
      <AvatarGroup className="justify-center items-center ">
        {firstMembers &&
          firstMembers.map((member: MemberShip, index: number) => (
            <Avatar key={index} src={member.Avatar} ></Avatar>
          ))
        }
        <Avatar>💬</Avatar>
      </AvatarGroup>
    )
  }

  export default ChannelAvatar;