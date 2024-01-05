import { channel } from "diagnostics_channel"
import { FC } from "react"




interface PageProps {
    params: {
      channelId: string
    }
  }

  const Channel: FC<PageProps> = ({ params }: PageProps) =>{
    return (
        <>
        <h1>this is channels</h1>
        </>
    )
  }

  export default Channel;