const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/sendMessageMessages");
const msgH = require("../messages/msgHelper");

const sendMessageHandler = Alexa.CreateStateHandler(config.STATES.MESSAGE_STATE, {
  MessageIntent() {
    let speechOutput = "";
    if ((value = this.event.request.intent.slots.message.value)) {
      speechOutput = msgH.pickOne(MSG.VALIDATION_MESSAGE, value);
      this.attributes.toSend = value;
    } else {
      speechOutput = msgH.pickOne(MSG.NO_MESSAGE_SPECIFIED);
    }
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  },
  "AMAZON.YesIntent": function confirm() {
    if (this.attributes.toSend) {
      //Send email
      this.attributes.speechOutput = msgH.pickOne(MSG.JUST_SENT_MESSAGE, this.attributes.toSend);
      this.attributes.toSend = undefined;
      this.handler.state = config.STATES.WELCOME_STATE;
      this.emitWithState("SomethingElse");
    } else {
      const speech = msgH.pickOne(MSG.DIDNT_SPECIFIED_MESSAGE);
      this.response.speak(speech).listen(speech);
      this.emit(":responseReady");
    }
  },
  "AMAZON.NoIntent": function denie() {
    this.attributes.speechOutput = msgH.pickOne(MSG.DIDNT_SEND_MESSAGE);
    this.handler.state = config.STATES.WELCOME_STATE;
    this.emitWithState("SomethingElse");
  },
  Unhandled() {
    let speechOutput = "g pa kompris";
    this.response.speak(speechOutput).listen(speechOutput);
    this.emit(":responseReady");
  }
});

module.exports = sendMessageHandler;
