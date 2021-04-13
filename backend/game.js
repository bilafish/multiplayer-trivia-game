const games = {};
const moment = require("moment");

const createGame = (id) => {
  games[id] = {
    status: "pending",
    players: [],
    questionRoundStatus: "not-started",
    currentQuestionNo: 1,
    questions: [
      {
        id: "af9514e6-d9a4-4854-b287-11fdfcd83a72",
        payload: "Who directed the 2015 movie &quot;The Revenant&quot;?",
        answerID: 1,
        options: [
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
        ],
      },
      {
        id: "d1cc29ef-0513-4a18-9292-4d7f352e82bd",
        payload:
          "In the TV series Red Dwarf, Kryten&#039;s full name is Kryten 2X4B-523P.",
        answerID: 1,
        options: [
          {
            id: 1,
            payload: "True",
          },
          {
            id: 2,
            payload: "False",
          },
        ],
      },
    ],
  };
};

const addPlayer = ({ id, name, room }) => {
  if (games[room] !== undefined) {
    games[room].players.push({
      id,
      name,
      isReady: false,
      answers: {},
      score: 0,
    });
  }
  return { error: "Game not found" };
};

const disconnectPlayer = ({ id, room }) => {
  if (games[room] !== undefined) {
    const newPlayerList = [...games[room].players];
    const existingPlayer = games[room].players.findIndex(
      (player) => player.id === id
    );
    if (existingPlayer !== -1) {
      newPlayerList.splice(existingPlayer, 1);
      games[room].players = newPlayerList;
    }
    return { error: "Player not found" };
  }
  return { error: "Game not found" };
};

// Game loop that controls the flow & updating of game state
const gameLoop = async (
  { room },
  updateLeaderboardEmitter,
  updateGameStateEmitter
) => {
  const roundStartTransitionDuration = 5000; // in milliseconds
  const roundEndTransitionDuration = 8000; // in milliseconds
  const roundDuration = 10000; // in milliseconds
  let currentQuestion = games[room].currentQuestionNo;
  const questions = games[room].questions;
  updateGameStatus(room, "started");

  while (currentQuestion <= games[room].questions.length) {
    updateQuestionRoundStatus(room, "pending");
    games[room].duration = roundStartTransitionDuration;
    updateGameStateEmitter(games[room], room);
    await new Promise((resolve) =>
      setTimeout(resolve, roundStartTransitionDuration)
    );
    updateQuestionRoundStatus(room, "started");
    // TODO: Socket Emit event to update game state, sending game status & question and options
    games[room].duration = roundDuration;
    const momentRoundStarted = moment().format();
    updateGameStateEmitter(games[room], room);

    await new Promise((resolve) => setTimeout(resolve, roundDuration));
    updateQuestionRoundStatus(room, "ended");
    // Update player scores
    const newPlayersList = [...games[room].players];
    games[room].players = newPlayersList.map((player) => {
      const currentQuestionID = questions[currentQuestion - 1].id;
      const playerAnswer = player.answers[currentQuestionID];
      if (playerAnswer !== undefined) {
        if (playerAnswer.answerID === questions[currentQuestion - 1].answerID) {
          // Score Calculation
          const maxPoints = 1000;
          const responseTime = moment(playerAnswer.answeredAt).diff(
            moment(momentRoundStarted),
            "seconds"
          );
          const responseRatio = responseTime / (roundDuration / 1000);
          const score = (1 - responseRatio / 2) * maxPoints;
          return {
            ...player,
            score: player.score + Math.round(score),
          };
        }
      }
      return player;
    });
    updateLeaderboardEmitter(games[room].players, room);
    // TODO: Socket Emit event to update game state, sending game status, correct answer & updated leaderboard
    games[room].duration = roundEndTransitionDuration;
    updateGameStateEmitter(games[room], room);
    await new Promise((resolve) =>
      setTimeout(resolve, roundEndTransitionDuration)
    );

    // if (currentQuestion < games[room].questions.length) {
    //   updateQuestionRoundStatus(room, "pending");
    //   // TODO: Socket Emit event to update game state
    //   updateGameStateEmitter(games[room], room);
    // }
    currentQuestion += 1;
    games[room].currentQuestionNo = currentQuestion;
  }

  updateGameStatus(room, "ended");
  // TODO: Socket Emit event to update game state
  updateGameStateEmitter(games[room], room);
  // TODO: Remove game room since game has ended
  delete games[room];
};

const updateGameStatus = (room, newStatus) => {
  if (games[room] !== undefined) {
    games[room].status = newStatus;
  }
};

const updateQuestionRoundStatus = (room, newQuestionRoundStatus) => {
  if (games[room] !== undefined) {
    games[room].questionRoundStatus = newQuestionRoundStatus;
  }
};

const updatePlayerReadyStatus = ({ id, name, room }) => {
  if (games[room] !== undefined) {
    const newPlayersList = [...games[room].players];
    const existingUser = newPlayersList.findIndex((user) => user.id === id);
    if (existingUser !== -1) {
      newPlayersList[existingUser] = {
        ...newPlayersList[existingUser],
        isReady: true,
      };
      games[room].players = newPlayersList;
      // Check if all players in game room are ready
      const notReadyUser = games[room].players.find(
        (user) => user.isReady === false
      );
      if (notReadyUser === undefined) {
        // Set game status to started
        updateGameStatus(room, "started");
        updateQuestionRoundStatus(room, "pending");
      }
      return { game: games[room] };
    }
    return { error: "Player id not found" };
  }
  return { error: "Game not found" };
};

const updatePlayerAnswer = ({
  id,
  name,
  room,
  questionID,
  answerID,
  momentAnswered,
}) => {
  // TODO: Add validation for questionID to check if answer submitted is for current question
  if (games[room] !== undefined) {
    const newPlayersList = [...games[room].players];
    const existingUser = newPlayersList.findIndex((user) => user.id === id);
    if (existingUser !== -1) {
      newPlayersList[existingUser].answers[questionID] = {
        answerID,
        answeredAt: momentAnswered,
      };
      games[room].players = newPlayersList;
      return { game: games[room] };
    }
    return { error: "Player id not found" };
  }
  return { error: "Game not found" };
};

const getGameByID = (id) => {
  if (games[id] !== undefined) {
    return { game: games[id] };
  }
  return { error: "Game not found" };
};

const removeEndedGame = () => {};

module.exports = {
  createGame,
  addPlayer,
  disconnectPlayer,
  updatePlayerReadyStatus,
  updatePlayerAnswer,
  getGameByID,
  gameLoop,
};
