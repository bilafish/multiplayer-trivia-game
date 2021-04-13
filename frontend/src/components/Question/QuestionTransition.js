import { Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
const QuestionTransition = ({ questionNo, duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    setInterval(() => {
      setTimeLeft((prev) => {
        return prev - 1;
      });
    }, 1000);
  }, []);
  return (
    <Heading size="lg">{`Qn ${questionNo} starting in ${timeLeft} seconds`}</Heading>
  );
};

export default QuestionTransition;
