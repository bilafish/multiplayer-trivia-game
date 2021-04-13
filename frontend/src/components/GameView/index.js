import { Heading, HStack } from "@chakra-ui/react";
import Option from "../Question/Option";
import QuestionTransition from "../Question/QuestionTransition";
import { parseEntities } from "../Question/Option";
import Timer from "../Question/Timer";

const GameView = ({ selectedAnswer, selectOption, gameState }) => {
  const questionRoundStatus = gameState.questionRoundStatus;
  return (
    <>
      {questionRoundStatus === "pending" && (
        <QuestionTransition
          questionNo={gameState.currentQuestionNo}
          duration={gameState.duration}
        />
      )}
      {questionRoundStatus === "started" && (
        <>
          <Timer duration={gameState.duration} />
          <Heading>Qn {gameState.currentQuestionNo}</Heading>
          <Heading>
            {parseEntities(
              gameState.questions[gameState.currentQuestionNo - 1].payload
            )}
          </Heading>
          <HStack spacing="1rem">
            {gameState.questions[gameState.currentQuestionNo - 1].options.map(
              (option, index) => (
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
              )
            )}
          </HStack>
        </>
      )}
      {questionRoundStatus === "ended" && <div>Results</div>}
    </>
  );
};

export default GameView;
