import { Button } from "@mantine/core";
import { useToggle } from "@mantine/hooks";


function Toggle({ val }: any) {
    const [value, toggle] = useToggle(['channels', 'Direct messages']);
    return (
      <Button color={'salt'} onClick={() => toggle()}>
        {val}
      </Button>
    );
  }
  export default Toggle;