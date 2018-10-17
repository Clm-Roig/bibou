const Alexa = require("alexa-sdk");
const config = require("../config");
const msgH = require("../messages/msgHelper");

const GENERAL_MSG = require("../messages/generalMessages.json");
const MSG = require('../messages/singLullabyMessages.json');
const MsgH = require('../messages/msgHelper')

const LULLABIES = {
  "url" : [
    "https://s3.amazonaws.com/bibou/little_angel.mp3",
    "https://s3.amazonaws.com/bibou/little_cat.mp3",
    "https://s3.amazonaws.com/bibou/sleep_music.mp3",
    "https://s3.amazonaws.com/bibou/sweet_dreams.mp3",
  ],
  "names": [
    "petit ange",
    "petit chat",
    "dodo",
    "doux rêves"
  ]
}

// ================================

const singLullabyHandler = Alexa.CreateStateHandler(config.STATES.SING_LULLABY_STATE, {
  ListLullabies() {
    let beginningMsg = msgH.pickOne(MSG.listLullabies)
    let lullabiesNames = LULLABIES.names.join(", ")
    let speechOutput = beginningMsg.concat(lullabiesNames)
    this.handler.state = config.STATES.WELCOME_STATE
    this.response.speak(speechOutput).listen(speechOutput)
    this.emitWithState(":responseReady")
  },
  StartRandomSinging() {
    let lullaby_url = MsgH.pickOne(LULLABIES.url)
    this.attributes.speechOutput = "<audio src='" + lullaby_url + "'/>"
    this.handler.state = config.STATES.WELCOME_STATE
    this.emitWithState("SomethingElse")
  },
  Unhandled() {
    let speechOutput = msgH.pickOne(GENERAL_MSG.errors)
    this.response.speak(speechOutput).listen(speechOutput)
    this.emit(":responseReady")
  }
});

module.exports = singLullabyHandler;
