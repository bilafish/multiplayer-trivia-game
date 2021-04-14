const fetch = require("node-fetch");

const getTriviaQuestions = (numberOfQns) => {
  return fetch(`https://opentdb.com/api.php?amount=${numberOfQns}`)
    .then((res) => res.json())
    .then((json) => {
      if (json.response_code !== 0) {
        throw new Error(`Error Code ${json.response_code}`);
      } else {
        return json.results;
      }
    })
    .catch((err) => {
      throw new Error(err.message || "Get trivia questions failed");
    });
};

module.exports = {
  getTriviaQuestions,
};
