import {
  Heading,
  Center,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName } from "../store/user";
import randomWords from "random-words";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  // Event Handlers
  const createGameHandler = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    dispatch(setName(name));
    const randomRoomID = randomWords(3).join("-");
    history.push(`/room/${randomRoomID}`);
  };

  const joinGameHandler = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const gameID = event.target.gameID.value;
    dispatch(setName(name));
    history.push(`/room/${gameID}`);
  };
  return (
    <Center bg="#151515" minH="100vh">
      <VStack spacing="1rem">
        <Heading color="#5582ac">Multiplayer Trivia</Heading>
        <Tabs variant="soft-rounded" colorScheme="yellow">
          <TabList>
            <Tab>New Game</Tab>
            <Tab>Join Game</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={createGameHandler}>
                <FormControl id="name" isRequired name="name">
                  <FormLabel color="#5582ac">Your name</FormLabel>
                  <Input color="#5582ac" />
                </FormControl>
                <Button
                  mt="1rem"
                  colorScheme="yellow"
                  variant="solid"
                  type="submit"
                >
                  Create
                </Button>
              </form>
            </TabPanel>
            <TabPanel>
              <form onSubmit={joinGameHandler}>
                <FormControl id="gameID" isRequired name="gameID">
                  <FormLabel color="#5582ac">Game ID</FormLabel>
                  <Input color="#5582ac" />
                </FormControl>
                <FormControl id="name" isRequired name="name">
                  <FormLabel color="#5582ac">Your name</FormLabel>
                  <Input color="#5582ac" />
                </FormControl>
                <Button
                  mt="1rem"
                  colorScheme="yellow"
                  variant="solid"
                  type="submit"
                >
                  Join
                </Button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Center>
  );
};

export default Home;
