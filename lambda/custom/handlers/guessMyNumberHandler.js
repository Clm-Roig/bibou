const Alexa = require("alexa-sdk");
const config = require("../config");

const MAX_NUMBER_TO_GUESS = 100;

const MSG = require("../messages/guessMyNumberMessages.json");
const ITS_LESS_MSG = MSG.itsLess;
const ITS_MORE_MSG = MSG.itsMore;

const guessMyNumberHandler = Alexa.CreateStateHandler(config.GAME_STATES.GUESS_MY_NUMBER_STATE, {
  Start() {
    const speechOutput = "Devine mon nombre entre 1 et " + MAX_NUMBER_TO_GUESS + "!";
    let numberToGuess = Math.floor(Math.random() * MAX_NUMBER_TO_GUESS) + 1;
    Object.assign(this.attributes, {
      numberToGuess,
      turn: 1
    });
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  GuessMyNumberIntent() {
    let speechOutput = "";
    let number = this.event.request.intent.slots.number.value;
    if (number < this.attributes.numberToGuess) {
      speechOutput = ITS_MORE_MSG[Math.floor(Math.random() * ITS_MORE_MSG.length)];
      this.attributes.turn += 1;
    } else if (number > this.attributes.numberToGuess) {
      speechOutput = ITS_LESS_MSG[Math.floor(Math.random() * ITS_LESS_MSG.length)];
      this.attributes.turn += 1;
    } else {
      speechOutput = `Bingo ! Tu as gagné en ${this.attributes.turn} tours !`;
      Object.assign(this.attributes, {
        numberToGuess: null,
        turn: null
      });
    }
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  Unhandled() {
    let speechOutput = "g pa kompri";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = guessMyNumberHandler;
