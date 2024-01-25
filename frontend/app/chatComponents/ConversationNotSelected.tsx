import { BiConversation } from "react-icons/bi";


const ConversationNotSelected = () => {
    return (
      <div className="flex  flex-1 flex-col items-center justify-center p-3 my-1  w-screen text-white">
        <BiConversation className="text-slate-400  h-40 w-40  " />
        <h1 className="text-slate-400"> no Conversation has been selected</h1>
      </div>
    );
  }

  export default ConversationNotSelected;
