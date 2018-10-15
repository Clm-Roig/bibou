const Alexa = require("alexa-sdk");
const config = require("../config");
const msgH = require("../messages/msgHelper");

const GENERAL_MSG = require("../messages/generalMessages.json");
const MSG = require('../messages/singLullabyMessages.json')

// ================================

const singLullabyHandler = Alexa.CreateStateHandler(config.SING_LULLABY_STATE, {
  StartSinging() {
    const speechOutput = "La lala lal je chante";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  Unhandled() {
    let speechOutput = msgH.pickOne(GENERAL_MSG.errors);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = singLullabyHandler;
