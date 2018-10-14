const GAME = "game"
const NONE = "none"

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
        speechText = "Devine mon nombre entre 1 et 1000!";
        let numberToGuess = Math.floor(Math.random() * 1000) + 1
        const sessionAttributes = {}
        Object.assign(sessionAttributes, { 
          state: GAME,
          numberToGuess,   
          turn: 0 
        })
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
    } else {
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
      let number = handlerInput.requestEnvelope.request.intent.slots.number.value
      if(sessionAttributes.state == GAME){
        if(number < sessionAttributes.numberToGuess){
          speechText = "C'est plus !"
          sessionAttributes.turn += 1
        } else if(number > sessionAttributes.numberToGuess) {
          speechText = "C'est moins !"
          sessionAttributes.turn += 1
        } else {
          speechText = `Bingo ! Tu as gagné en ${sessionAttributes.turn} tours!`
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