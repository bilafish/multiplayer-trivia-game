const games = {};

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
  updateQuestionRoundStatus(room, "pending");
  games[room].duration = roundStartTransitionDuration;
  updateGameStateEmitter(games[room], room);

  while (currentQuestion <= games[room].questions.length) {
    await new Promise((resolve) =>
      setTimeout(resolve, roundStartTransitionDuration)
    );
    updateQuestionRoundStatus(room, "started");
    // TODO: Socket Emit event to update game state, sending game status & question and options
    games[room].duration = roundDuration;
    updateGameStateEmitter(games[room], room);

    await new Promise((resolve) => setTimeout(resolve, roundDuration));
    updateQuestionRoundStatus(room, "ended");
    // Update player scores
    const newPlayersList = [...games[room].players];
    games[room].players = newPlayersList.map((player) => {
      const currentQuestionID = questions[currentQuestion - 1].id;
      const playerAnswer = player.answers[currentQuestionID];
      if (playerAnswer !== undefined) {
        if (playerAnswer === questions[currentQuestion - 1].answerID) {
          return {
            ...player,
            score: player.score + 1,
          };
        }
      }
      return player;
    });
    console.log(games[room].players);
    updateLeaderboardEmitter(games[room].players, room);
    // TODO: Socket Emit event to update game state, sending game status, correct answer & updated leaderboard
    games[room].duration = roundEndTransitionDuration;
    updateGameStateEmitter(games[room], room);

    await new Promise((resolve) =>
      setTimeout(resolve, roundEndTransitionDuration)
    );
    if (currentQuestion < games[room].questions.length) {
      updateQuestionRoundStatus(room, "pending");
      // TODO: Socket Emit event to update game state
      updateGameStateEmitter(games[room], room);
    }
    currentQuestion += 1;
  }
  updateGameStatus(room, "ended");
  // TODO: Socket Emit event to update game state
  updateGameStateEmitter(games[room], room);
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

const updatePlayerAnswer = ({ id, name, room, questionID, answerID }) => {
  // TODO: Add validation for questionID to check if answer submitted is for current question
  if (games[room] !== undefined) {
    const newPlayersList = [...games[room].players];
    const existingUser = newPlayersList.findIndex((user) => user.id === id);
    if (existingUser !== -1) {
      newPlayersList[existingUser].answers[questionID] = answerID;
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
