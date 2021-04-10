import { Heading, Center, Button, VStack } from "@chakra-ui/react";

const Home = () => {
  return (
    <Center bg="#151515" minH="100vh">
      <VStack spacing="1rem">
        <Heading color="#5582ac">Multiplayer Trivia</Heading>
        <Button colorScheme="yellow" variant="solid">
          Create Game
        </Button>
      </VStack>
    </Center>
  );
};

export default Home;
