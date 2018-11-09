const tales = require('../messages/taleMessages')
const msgH = require("../messages/msgHelper");
const GENERAL_MSG = require("../messages/generalMessages.json");
const config = require("../config");
const Alexa = require("alexa-sdk");


const taleHandler = Alexa.CreateStateHandler(config.STATES.TALE_STATE,{
    StartTale() {
        let speechText = msgH.pickOne(tales.intro) + " ";
        let i = 1;
        while("tale_" + i in tales) {
            let key = "tale_" + i;
            speechText =  `${speechText} <say-as interpret-as=\"cardinal\"> ${i} <break time="0.05s"/> </say-as> ${tales[key]["intro"]} <break time="0.1s"/>`;
            i = i+1
        }
        Object.assign(this.attributes, {
            state: config.STATES.TALE_CHOICE_STATE,
            nb_tales: i-1,
            nb_tale_chosen: null,
            nb_step_tale: null
        });
        this.response.speak(speechText).listen(speechText);
        this.emit(":responseReady");
    },
    TaleChoiceIntent() {
        if (this.attributes.state === config.STATES.TALE_CHOICE_STATE) {
            let number = this.event.request.intent.slots.number.value;
            if (number > 0 && number <= this.attributes.nb_tales) {
                Object.assign(this.attributes, {
                    state: config.STATES.TALE_PLAY_STATE,
                    nb_tale_chosen: number,
                    nb_step_tale: 1
                });
                if (tales["tale_" + this.attributes.nb_tale_chosen].hasOwnProperty("contenu")) {
                    this.emitWithState("TalePlayIntent")
                }
                else {
                    let speechOutput = "Pardon, mais je n'ai pas le contenu du conte que tu m'as demandé";
                    this.response.speak(speechOutput).listen(speechOutput);
                    this.emitWithState("ChooseTaleIntent");
                }
            } else {
                let speechOutput = "Pardon, mais je n'ai pas le numéro de conte que tu m'as demandé";
                this.response.speak(speechOutput).listen(speechOutput);
                this.emit(":responseReady");
            }
        }
    },
    TalePlayIntent() {
        if(this.attributes.state === config.STATES.TALE_PLAY_STATE) {
            let speechOutput = `${tales["tale_" + this.attributes.nb_tale_chosen]["contenu"]} <break time="0.05s"/> Fin de l'histoire.` ;
            this.handler.state = config.STATES.WELCOME_STATE;
            this.attributes.speechOutput = speechOutput;
            this.emitWithState("SomethingElse")
        }
    },


    "AMAZON.StopIntent"(){
        this.attributes.speechOutput = msgH.pickOne(tales.leaveTale);
        delete this.attributes.toSend;
        this.handler.state = config.STATES.WELCOME_STATE;
        this.emitWithState("SomethingElse");
    },
    
    "AMAZON.CancelIntent"(){
        this.attributes.speechOutput = msgH.pickOne(tales.leaveTale);
        delete this.attributes.toSend;
        this.handler.state = config.STATES.WELCOME_STATE;
        this.emitWithState("SomethingElse");
    },

    Unhandled(){
        let speechOutput = msgH.pickOne(GENERAL_MSG.errors);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});


module.exports = taleHandler;

