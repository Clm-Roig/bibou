const Alexa = require("alexa-sdk");
const config = require("../config");
const MSG = require("../messages/sendMessageMessages");
const msgH = require("../messages/msgHelper");
const Axios = require("axios");
const sendMail = require("../MailSender");
const GENERAL_MSG = require("../messages/generalMessages.json");

getEmail = (token, apiEndpoint) => {
    return new Promise((resolve, reject) => {
        var config = {
            headers: {Authorization: "bearer " + token}
        };

        Axios.get(`${apiEndpoint}/v2/accounts/~current/settings/Profile.email`, config)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const sendMessageHandler = Alexa.CreateStateHandler(config.STATES.MESSAGE_STATE, {
    MessageIntent() {
        if (!this.attributes.email) {
            const alexa = this;
            getEmail(this.event.context.System.apiAccessToken, this.event.context.System.apiEndpoint)
                .then(email => {
                    alexa.attributes.email = email;
                    let speechOutput = "";
                    if ((value = this.event.request.intent.slots.message.value)) {
                        speechOutput = msgH.pickOne(MSG.VALIDATION_MESSAGE, value);
                        this.attributes.toSend = value;
                    } else {
                        speechOutput = msgH.pickOne(MSG.NO_MESSAGE_SPECIFIED);
                    }
                    this.response.speak(speechOutput).listen(speechOutput);
                    this.emit(":responseReady");
                })
                .catch(err => {
                    speechOutput = msgH.pickOne(MSG.EMAIL_NOT_GIVEN);
                    alexa.response.speak(speechOutput).listen(speechOutput);
                    const permissions = ["alexa::profile:email:read"];
                    alexa.response.askForPermissionsConsentCard(permissions);
                    alexa.emit(":responseReady");
                });
        } else {
            let speechOutput = "";
            if ((value = this.event.request.intent.slots.message.value)) {
                speechOutput = msgH.pickOne(MSG.VALIDATION_MESSAGE, value);
                this.attributes.toSend = value;
            } else {
                speechOutput = msgH.pickOne(MSG.NO_MESSAGE_SPECIFIED);
            }
            this.response.speak(speechOutput).listen(speechOutput);
            this.emit(":responseReady");
        }
    },
    "AMAZON.YesIntent": function confirm() {
        if (this.attributes.toSend) {
            sendMail("Alexa", "Message from bibou", this.attributes.toSend, [this.attributes.email])
                .then(res => {
                    this.attributes.speechOutput = msgH.pickOne(MSG.JUST_SENT_MESSAGE, this.attributes.toSend);
                    delete this.attributes.toSend;
                    this.handler.state = config.STATES.WELCOME_STATE;
                    this.emitWithState("SomethingElse");
                })
                .catch(err => {
                    this.attributes.speechOutput = msgH.pickOne(MSG.COULDNT_SEND_MESSAGE);
                    delete this.attributes.toSend;
                    this.handler.state = config.STATES.WELCOME_STATE;
                    this.emitWithState("SomethingElse");
                });
        } else {
            const speech = msgH.pickOne(MSG.DIDNT_SPECIFIED_MESSAGE);
            this.response.speak(speech).listen(speech);
            this.emit(":responseReady");
        }
    },
    "AMAZON.NoIntent": function denie() {
        this.attributes.speechOutput = msgH.pickOne(MSG.DIDNT_SEND_MESSAGE);
        delete this.attributes.toSend;
        this.handler.state = config.STATES.WELCOME_STATE;
        this.emitWithState("SomethingElse");
    },
    DidNotUnderstand() {
        let speechOutput = msgH.pickOne(GENERAL_MSG.errors);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },
    Unhandled() {
        let speechOutput = "Je n'ai pas compris.";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = sendMessageHandler;
