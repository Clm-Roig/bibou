const Alexa = require("alexa-sdk");
const config = require("../config");
const msgH = require("../messages/msgHelper");

const GENERAL_MSG = require("../messages/generalMessages.json");
const MSG = require("../messages/guessMyNumberMessages.json");
const MAX_NUMBER_TO_GUESS = 100;
const ITS_LESS_MSG = MSG.itsLess;
const ITS_MORE_MSG = MSG.itsMore;

const defaultState = {
    numberToGuess: null,
    turn: null,
    isItMore: null,
    currentNumber: null

}

// ==========================================

const guessMyNumberHandler = Alexa.CreateStateHandler(config.STATES.GUESS_MY_NUMBER_STATE, {
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
    this.attributes.currentNumber = number
    if (number < this.attributes.numberToGuess) {
      speechOutput = msgH.pickOne(ITS_MORE_MSG);
      this.attributes.turn += 1;
      this.attributes.isItMore = true
    } else if (number > this.attributes.numberToGuess) {
      speechOutput = msgH.pickOne(ITS_LESS_MSG);
      this.attributes.turn += 1;
      this.attributes.isItMore = false
    } else if (number == this.attributes.numberToGuess) {
      this.attributes.speechOutput = `Bingo ! Tu as gagné en ${this.attributes.turn} tours !`;
      Object.keys(defaultState).forEach((prop) => delete this.attributes[prop]);
      this.handler.state = config.STATES.WELCOME_STATE;
      this.emitWithState("SomethingElse");
    } else {
      speechOutput = msgH.pickOne(GENERAL_MSG.errors);
    }

    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },

  "AMAZON.HelpIntent"(){
    const speechOutput = `Tu joues à devine mon nombre, tu es au tour ${this.attributes.turn}, 
    ${this.attributes.currentNumber ? `ton dernier coup était ${this.attributes.currentNumber}, et le nombre à trouver est ${this.attributes.isItMore ? "plus grand": "plus petit"}.` :
                                      `et tu n'as pas encore joué.`} 
                          Donne moi un nombre entre 1 et 100 ou dis moi stop si tu veux quitter la partie.`
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },

  "AMAZON.StopIntent"(){
    this.handler.state = config.STATES.WELCOME_STATE;
    Object.keys(defaultState).forEach((prop) => delete this.attributes[prop]);
    const speechOutput = `Vous avez bien quitté le jeu` 
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },

  DidNotUnderstand() {
    let speechOutput = msgH.pickOne(GENERAL_MSG.errors);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  
  Unhandled() {
    let speechOutput = msgH.pickOne(GENERAL_MSG.errors);
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = guessMyNumberHandler;
