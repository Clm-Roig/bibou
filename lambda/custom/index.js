const Alexa = require("alexa-sdk");
const config = require("./config"); // Config

/**
 * We import handlers as they are separated in different files
 */
const welcomeStateHandler = require("./handlers/welcomeHandler");
const guessMyNumberStateHandler = require("./handlers/guessMyNumberHandler");
const singLullabyStateHandler = require("./handlers/singLullabyHandler");

const newSessionHandlers = {
  LaunchRequest: function() {
    this.handler.state = config.WELCOME_STATE;
    this.emitWithState("Welcome");
  },
  Unhandled: function() {
    this.response.speak("Pas compris").listen("Pas compris");
    this.emit(":responseReady");
  }
};

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  //alexa.appId = config.APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  //alexa.resources = config.languageString;
  alexa.registerHandlers(
    guessMyNumberStateHandler,
    newSessionHandlers, 
    singLullabyStateHandler,
    welcomeStateHandler
  );
  alexa.execute();
};