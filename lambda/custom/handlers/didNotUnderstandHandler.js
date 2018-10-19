const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/generalMessages");
const msgH = require("../messages/msgHelper");

const didNotUnderstandHandler = Alexa.CreateStateHandler(config.STATES.DID_NOT_UNDERSTAND_STATE, {
    DidNotUnderstand() {
        this.handler.state = config.STATES.WELCOME_STATE
        let speechOutput = msgH.pickOne(MSG.errors);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    Unhandled() {
        let speechOutput = msgH.pickOne(MSG.errors);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = didNotUnderstandHandler;

