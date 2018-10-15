const GAME = "game"
const NONE = "none"

const MAX_NUMBER_TO_GUESS = 100

const MSG = require('../messages/guessMyNumberMessages.json')
const ITS_LESS_MSG = MSG.itsLess
const ITS_MORE_MSG = MSG.itsMore

module.exports = {
  canHandle: (handlerInput) => {
    console.log("Result: " + handlerInput.requestEnvelope.request.intent.name === "GuessMyNumberIntroIntent")
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "GuessMyNumberIntroIntent" ||
      handlerInput.requestEnvelope.request.intent.name === "GuessMyNumberIntent"
    );
  },
  handle: (handlerInput) => {
    let speechText = null
    if(handlerInput.requestEnvelope.request.intent.name === "GuessMyNumberIntroIntent"){
        speechText = "Devine mon nombre entre 1 et " + MAX_NUMBER_TO_GUESS + "!";
        let numberToGuess = Math.floor(Math.random() * MAX_NUMBER_TO_GUESS) + 1
        const sessionAttributes = {}
        Object.assign(sessionAttributes, { 
          state: GAME,
          numberToGuess,   
          turn: 1 
        })
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
    } else {
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
      let number = handlerInput.requestEnvelope.request.intent.slots.number.value
      if(sessionAttributes.state == GAME){
        if(number < sessionAttributes.numberToGuess){
          speechText = ITS_MORE_MSG[Math.floor(Math.random()*ITS_MORE_MSG.length)]
          sessionAttributes.turn += 1
        } else if(number > sessionAttributes.numberToGuess) {
          speechText = ITS_LESS_MSG[Math.floor(Math.random()*ITS_LESS_MSG.length)]
          sessionAttributes.turn += 1
        } else {
          speechText = `Bingo ! Tu as gagné en ${sessionAttributes.turn} tours !`
          Object.assign(sessionAttributes, {
            state: NONE,
            numberToGuess: null,
            turn: null
          })
        }
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
      } else {
        handlerInput.emit("GuessMyNumber")
        return;
      }
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}