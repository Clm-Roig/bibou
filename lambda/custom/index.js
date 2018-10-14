/* eslint-disable  func-names */
/* eslint-disable  no-console */

// ===== Strings messages
const general_s = require('./generalStrings.json')
const byes_s = general_s.byes
const errors_s = general_s.errors
const greetings_s = general_s.greetings

const Alexa = require("ask-sdk-core");


// ===== Handlers
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = greetings_s[Math.floor(Math.random()*greetings_s.length)];  

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  }
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "HelloWorldIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "Hello World!";
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
    const speechText = byes_s[Math.floor(Math.random()*byes_s.length)];  

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
    const speechText = errors_s[Math.floor(Math.random()*errors_s.length)];  

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
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
