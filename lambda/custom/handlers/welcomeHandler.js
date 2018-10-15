const Alexa = require("alexa-sdk");
const config = require("../config");
const msg = require("../messages/generalMessages");

const startStateHandlers = Alexa.CreateStateHandler(config.GAME_STATES.WELCOME_STATE, {
  Welcome() {
    let speechOutput = config.pickOne(msg.greetings);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  GuessMyNumberIntroIntent() {
    this.handler.state = config.GAME_STATES.GUESS_MY_NUMBER_STATE;
    this.emitWithState("Start");
  },
  Unhandled() {
    let speechOutput = "g pa kompri";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = startStateHandlers;
