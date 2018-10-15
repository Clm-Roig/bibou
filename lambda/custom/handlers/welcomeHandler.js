const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/generalMessages");
const msgH = require("../messages/msgHelper");

// ==============================

const startStateHandlers = Alexa.CreateStateHandler(config.STATES.WELCOME_STATE, {
  Welcome() {
    let speechOutput = msgH.pickOne(MSG.greetings);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  GuessMyNumberIntroIntent() {
    this.handler.state = config.STATES.GUESS_MY_NUMBER_STATE;
    this.emitWithState("Start");
  },
  MessageIntent() {
    this.handler.state = config.STATES.MESSAGE_STATE;
    this.emitWithState("MessageIntent");
  },
  SomethingElse() {
    this.attributes.speechOutput += "Puis-je faire autre chose ?";
    this.response.speak(this.attributes.speechOutput).listen(this.attributes.speechOutput);
    this.emit(":responseReady");
  },
  SingLullabyIntroIntent() {
    this.handler.state = config.SING_LULLABY_STATE;
    this.emitWithState("StartSinging");
  },
  Unhandled() {
    let speechOutput = msgH.pickOne(MSG.errors);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = startStateHandlers;
