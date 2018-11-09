const Alexa = require("alexa-sdk");
const config = require("../config");
const msgH = require("../messages/msgHelper");
const GENERAL_MSG = require("../messages/generalMessages.json");
const MSG = require('../messages/singLullabyMessages.json');

const LULLABIES = Array(
    {
        "names": ["petit ange"],
        "url": "https://s3.amazonaws.com/bibou/little_angel.mp3"
    },
    {
        "names": ["petit chat"],
        "url": "https://s3.amazonaws.com/bibou/little_cat.mp3"
    },
    {
        "names": ["dodo"],
        "url": "https://s3.amazonaws.com/bibou/sleep_music.mp3"
    },
    {
        "names": ["doux rêve", "doux rêves"],
        "url": "https://s3.amazonaws.com/bibou/sweet_dreams.mp3"
    },
    {
        "names": ["étoile du matin", "l'étoile du matin", "l 'étoile du matin"],
        "url": "https://s3.amazonaws.com/bibou/morning_star.mp3"
    }
)

// ================================

const singLullabyHandler = Alexa.CreateStateHandler(config.STATES.SING_LULLABY_STATE, {

    ListLullabies() {
        let beginningMsg = msgH.pickOne(MSG.listLullabies) + " "
        var lullabiesNames = Array()
        LULLABIES.forEach(x => lullabiesNames.push(x.names[0]))
        let speechOutput = beginningMsg.concat(lullabiesNames.slice(0, -1).join(', ') + ' et ' + lullabiesNames.slice(-1)) + "."
        this.handler.state = config.STATES.SING_LULLABY_STATE
        this.response.speak(speechOutput).listen(speechOutput)
        this.emit(":responseReady")
    },

    StartSinging() {
        let lullabyNameAsked = this.event.request.intent.slots.lullaby.value
        let lullaby = LULLABIES.filter(l => l.names.includes(lullabyNameAsked))
        let speechOutput = ""
        if (lullaby.length > 0) {
            let url = lullaby[0].url
            speechOutput = "<audio src='" + url + "'/>"
        } else {
            speechOutput = "Désolé, je ne connais pas cette berceuse."
        }
        this.handler.state = config.STATES.SING_LULLABY_STATE
        this.response.speak(speechOutput).listen(speechOutput)
        this.emit(":responseReady")
    },

    StartRandomSinging() {
        let lullaby_url = LULLABIES[Math.floor(Math.random() * LULLABIES.length)].url
        this.attributes.speechOutput = "<audio src='" + lullaby_url + "'/>"
        this.handler.state = config.STATES.SING_LULLABY_STATE
        this.emit(":responseReady")
    },
    
    "AMAZON.StopIntent"(){
        this.attributes.speechOutput = msgH.pickOne(MSG.leaveLullaby);
        this.handler.state = config.STATES.WELCOME_STATE;
        this.emitWithState("SomethingElse");
    },
    
    "AMAZON.CancelIntent"(){
        this.attributes.speechOutput = msgH.pickOne(MSG.leaveLullaby);
        this.handler.state = config.STATES.WELCOME_STATE;
        this.emitWithState("SomethingElse");
    },

    Unhandled() {
        this.handler.state = config.STATES.WELCOME_STATE
        let speechOutput = msgH.pickOne(GENERAL_MSG.errors)
        this.response.speak(speechOutput).listen(speechOutput)
        this.emit(":responseReady")
    }

});

module.exports = singLullabyHandler;
