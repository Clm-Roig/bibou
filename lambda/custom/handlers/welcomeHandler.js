const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/generalMessages");
const msgH = require("../messages/msgHelper");

// ==============================

const startStateHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
  Welcome() {
    let speechOutput = msgH.pickOne(MSG.greetings);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  GuessMyNumberIntroIntent() {
    this.handler.state = config.GAME_STATES.GUESS_MY_NUMBER_STATE;
    this.emitWithState("Start");
  },
  SingLullabyIntroIntent() {
    this.handler.state = config.SING_LULLABY_STATE
    this.emitWithState("StartSinging")
  },
  Unhandled() {
    let speechOutput = msgH.pickOne(MSG.errors);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = startStateHandlers;
