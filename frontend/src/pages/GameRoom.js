import {
  Heading,
  Center,
  VStack,
  Button,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import GameView from "../components/GameView/index";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ENDPOINT = "https://multiplayer-trivia-game.herokuapp.com/";

let socket;

const GameRoom = () => {
  const { id } = useParams();
  const history = useHistory();
  const { name } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [gameStatus, setGameStatus] = useState("pending");
  const [gameState, setGameState] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join", { name: name, room: id }, (error) => {
      if (error) {
        alert(error);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [id, name]);

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("updateGameState", ({ gameState }) => {
      setGameState(gameState);
      setGameStatus(gameState.status);
      setSelectedAnswer(null);
    });
    socket.on("updateLeaderboard", ({ leaderboard }) => {
      setLeaderboard(leaderboard);
    });
  }, []);

  // Event Handlers
  const sendReadyStatus = () => {
    socket.emit(
      "player-ready",
      { name: name, room: id },
      ({ games, error }) => {
        if (error === undefined) {
          setIsReady(true);
        }
      }
    );
  };
  const selectOption = ({ answerID }) => {
    setSelectedAnswer(answerID);
    socket.emit(
      "player-answer",
      {
        name: name,
        room: id,
        questionID: gameState.questions[gameState.currentQuestionNo - 1].id,
        answerID,
      },
      ({ error }) => {
        if (error !== undefined) {
          alert(error);
        }
      }
    );
  };

  return (
    <Center bg="#151515" minH="100vh">
      <VStack spacing="1rem" color="white">
        <Heading color="#5582ac">Game Room</Heading>
        <p>
          Game ID:{" "}
          <CopyToClipboard
            text={id}
            onCopy={() => {
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 1000);
            }}
          >
            <Button colorScheme="teal" variant="outline">
              {id}
            </Button>
          </CopyToClipboard>
          <Tooltip label="Copied!" placement="right-end" isOpen={isCopied}>
            <span />
          </Tooltip>
        </p>
        <p>Users in room:</p>
        {users.length > 0 &&
          users.map((user) => (
            <p key={user.id}>
              {user.name}{" "}
              <Badge ml="1" colorScheme={user.isReady ? "green" : "orange"}>
                {user.isReady ? "Ready" : "Pending"}
              </Badge>
            </p>
          ))}
        {gameStatus === "pending" && (
          <Button
            colorScheme="yellow"
            variant="solid"
            disabled={isReady}
            onClick={sendReadyStatus}
          >
            {isReady ? "Waiting for players" : "Ready"}
          </Button>
        )}
        {gameStatus === "started" && (
          <GameView
            selectedAnswer={selectedAnswer}
            selectOption={selectOption}
            gameState={gameState}
            leaderboard={leaderboard}
          />
        )}
        {gameStatus === "ended" && (
          <>
            <Heading size="md">Game Ended</Heading>
            <Button
              colorScheme="yellow"
              variant="solid"
              onClick={() => {
                history.replace("/");
              }}
            >
              Play Again
            </Button>
          </>
        )}
      </VStack>
    </Center>
  );
};
export default GameRoom;
