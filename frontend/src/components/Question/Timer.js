import { Heading, HStack, Progress } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Timer = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    setInterval(() => {
      setTimeLeft((prev) => {
        return prev - 1;
      });
    }, 1000);
  }, []);

  return (
    <HStack spacing="1rem">
      <Progress
        colorScheme="yellow"
        size="md"
        value={timeLeft}
        min={0}
        max={duration / 1000}
        width="20rem"
      />
      <Heading w="5rem">{`${timeLeft} s`}</Heading>
    </HStack>
  );
};

export default Timer;
