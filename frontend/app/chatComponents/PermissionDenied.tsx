import { CgDanger } from "react-icons/cg";

const PermissionDenied = () => {
    return (
      <div className="flex  flex-1 flex-col items-center justify-center p-2 my-1  w-screen text-slate-500">
        <CgDanger className="h-40 w-40  " />
        <h1> Permission Denied</h1>
      </div>
    );
  }
  export default PermissionDenied;