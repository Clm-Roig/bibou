/* eslint-disable  func-names */
/* eslint-disable  no-console */

// ===== Strings messages
const general_msg = require('./messages/generalMessages.json')
const BYES_msg = general_msg.byes
const ERRORS_msg = general_msg.errors
const GREETINGS_msg = general_msg.greetings
const WHAT_TO_DO_msg = general_msg.whatToDo

const Alexa = require("ask-sdk-core");


// ===== Handlers
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = GREETINGS_msg[Math.floor(Math.random()*GREETINGS_msg.length)] + " " + WHAT_TO_DO_msg[Math.floor(Math.random()*WHAT_TO_DO_msg.length)];  

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "You can say hello to me!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = BYES_msg[Math.floor(Math.random()*BYES_msg.length)];  

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const speechText = ERRORS_msg[Math.floor(Math.random()*ERRORS_msg.length)];  

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const GuessMyNumberIntentHandler = require("./handlers/guessMyNumber")


// ====== Build skill
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GuessMyNumberIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
