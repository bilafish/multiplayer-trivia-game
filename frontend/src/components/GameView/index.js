import { Heading, HStack } from "@chakra-ui/react";
import Option from "../Question/Option";
import QuestionTransition from "../Question/QuestionTransition";
import { parseEntities } from "../Question/Option";
import Timer from "../Question/Timer";
import LeaderboardTable from "./LeaderboardTable";
import { useSelector } from "react-redux";

const getCurrentUserAnswer = (
  currentUserSocketID,
  playersList,
  currentQnID,
  currentQnNo,
  questionsList
) => {
  const currentPlayer = playersList.find(
    (player) => player.id === currentUserSocketID
  );
  if (currentPlayer === undefined) {
    return "";
  } else {
    const playerAnswer = currentPlayer.answers[currentQnID];
    if (playerAnswer === undefined) {
      return "No answer submitted";
    } else {
      const playerAnsweredOption = questionsList[currentQnNo - 1].options.find(
        (option) => option.id === playerAnswer.answerID
      );
      if (playerAnsweredOption === undefined) {
        return "";
      } else {
        return playerAnsweredOption.payload;
      }
    }
  }
};

const GameView = ({ selectedAnswer, selectOption, gameState, leaderboard }) => {
  const { socketID } = useSelector((state) => state.user);

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
      {questionRoundStatus === "ended" && (
        <div>
          <Heading size="md">
            Your Answer:{" "}
            {gameState.currentQuestionNo <= gameState.questions.length &&
              parseEntities(
                getCurrentUserAnswer(
                  socketID,
                  gameState.players,
                  gameState.questions[gameState.currentQuestionNo - 1].id,
                  gameState.currentQuestionNo,
                  gameState.questions
                )
              )}
          </Heading>
          <Heading size="md" mb="1rem">
            Correct Answer:{" "}
            {gameState.currentQuestionNo <= gameState.questions.length &&
              parseEntities(
                gameState.questions[
                  gameState.currentQuestionNo - 1
                ].options.find(
                  (option) =>
                    option.id ===
                    gameState.questions[gameState.currentQuestionNo - 1]
                      .answerID
                ).payload
              )}
          </Heading>
          <Heading size="sm" textAlign="center">
            Leaderboard
          </Heading>
          <LeaderboardTable data={leaderboard} />
        </div>
      )}
    </>
  );
};

export default GameView;
