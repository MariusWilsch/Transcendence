import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CreateChannelForm from "./CreateChannelForm";
import { IoMdAdd } from "react-icons/io";


const Demo = () => {
    const [opened, { open, close }] = useDisclosure(false);
  
    return (
      <>
        <Modal  opened={opened} onClose={close} title="Create A Channel" centered>
          <CreateChannelForm />
        </Modal>
        <div className="flex flex-row justify-center space-x-3 text-white">
          <h2>channels</h2>
          <IoMdAdd className='hover:cursor-pointer' onClick={open} />
        </div>
      </>
    );
  }

  export default Demo;