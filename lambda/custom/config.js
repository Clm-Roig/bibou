module.exports = {
  GAME_STATES: {
    WELCOME_STATE: "_WELCOME",
    GUESS_MY_NUMBER_STATE: "_GUESS_MY_NUMBER"
  },
  pickOne: array => array[Math.floor(Math.random() * array.length)]
};
