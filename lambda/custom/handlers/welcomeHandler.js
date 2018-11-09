const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/generalMessages");
const msgH = require("../messages/msgHelper");

// ==============================

const startStateHandlers = Alexa.CreateStateHandler(config.STATES.WELCOME_STATE, {
    Welcome() {
        let speechOutput = `${msgH.pickOne(MSG.greetings)} ${msgH.pickOne(MSG.helpStart)} ${MSG.listActions.join(', ')}. ${msgH.pickOne(MSG.whatToDo)}`;
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
    TaleIntroIntent() {
        this.handler.state = config.STATES.TALE_STATE;
        this.emitWithState("StartTale");
    },
    SomethingElse() {
        this.attributes.speechOutput += " " + msgH.pickOne(MSG.somethingElse);
        this.response.speak(this.attributes.speechOutput).listen(this.attributes.speechOutput);
        this.emit(":responseReady");
    },

    // ==== Lullabies
    ListLullabiesIntent() {
        this.handler.state = config.STATES.SING_LULLABY_STATE;
        this.emitWithState("ListLullabies");
    },
    SingLullabyIntent() {
        this.handler.state = config.STATES.SING_LULLABY_STATE;
        this.emitWithState("StartSinging");
    },
    SingRandomLullabyIntent() {
        this.handler.state = config.STATES.SING_LULLABY_STATE;
        this.emitWithState("StartRandomSinging");
    },

    "AMAZON.HelpIntent"() {
      let speechOutput = `${msgH.pickOne(MSG.helpStart)} ${MSG.listActions.join(', ')}. ${msgH.pickOne(MSG.whatToDo)}`
      this.response.speak(speechOutput).listen(msgH.pickOne(MSG.whatToDo))
      this.emit(":responseReady")
    },

    "AMAZON.StopIntent"(){
        const speechOutput = `Au revoir` 
        this.response.speak(speechOutput);
        this.emit(":responseReady");
    },

    "AMAZON.CancelIntent"(){
        const speechOutput = `A bientôt` 
        this.response.speak(speechOutput);
        this.emit(":responseReady");
    },
    
    // ==== Unhandled
    Unhandled() {
        let speechOutput = msgH.pickOne(MSG.errors);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = startStateHandlers;
