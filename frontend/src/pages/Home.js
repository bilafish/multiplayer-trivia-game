import {
  Heading,
  Center,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName } from "../store/user";
const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const createGameHandler = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    dispatch(setName(name));
    console.log(name);
    const randomRoomID = "random123";
    history.push(`/room/${randomRoomID}`);
  };
  return (
    <Center bg="#151515" minH="100vh">
      <VStack spacing="1rem">
        <Heading color="#5582ac">Multiplayer Trivia</Heading>
        <form onSubmit={createGameHandler}>
          <FormControl id="name" isRequired name="name">
            <FormLabel color="#5582ac">Your name</FormLabel>
            <Input color="#5582ac" />
          </FormControl>
          <Button mt="1rem" colorScheme="yellow" variant="solid" type="submit">
            Create Game
          </Button>
        </form>
      </VStack>
    </Center>
  );
};

export default Home;
