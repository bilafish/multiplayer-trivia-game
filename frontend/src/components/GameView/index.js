import { Heading, HStack } from "@chakra-ui/react";
import Option from "../Question/Option";
import QuestionTransition from "../Question/QuestionTransition";
import { parseEntities } from "../Question/Option";

const mockOptions = [
  {
    id: 1,
    payload: "Alejandro G. I&ntilde;&aacute;rritu",
  },
  {
    id: 2,
    payload: "Christopher Nolan",
  },
  {
    id: 3,
    payload: "David Fincher",
  },
  {
    id: 4,
    payload: "Wes Anderson",
  },
];
const GameView = ({ selectedAnswer, selectOption, gameState }) => {
  const questionRoundStatus = gameState.questionRoundStatus;
  return (
    <div>
      {questionRoundStatus === "pending" && (
        <QuestionTransition
          questionNo={gameState.currentQuestionNo}
          duration={gameState.duration}
        />
      )}
      {questionRoundStatus === "started" && (
        <>
          <Heading>Qn {gameState.currentQuestionNo}</Heading>
          <Heading>
            {parseEntities(
              gameState.questions[gameState.currentQuestionNo - 1].payload
            )}
          </Heading>
          <HStack spacing="1rem">
            {mockOptions.map((option, index) => (
              <Option
                key={option.id}
                index={index}
                content={option.payload}
                onClickHandler={() => {
                  if (selectedAnswer !== null) return;
                  selectOption({ answerID: option.id });
                }}
                isSelected={option.id === selectedAnswer}
              />
            ))}
          </HStack>
        </>
      )}
      {questionRoundStatus === "ended" && <div>Results</div>}
    </div>
  );
};

export default GameView;
