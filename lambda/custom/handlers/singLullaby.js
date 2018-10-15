const LULLABY = "lullaby"

const MSG = require('../messages/singLullabyMessages.json')

module.exports = {
  canHandle: (handlerInput) => {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest"
    );
  },
  handle: (handlerInput) => {
    return handlerInput.responseBuilder
      .speak("Test berceuse")
      .reprompt("Test berceuse")
      .getResponse();
  }
}