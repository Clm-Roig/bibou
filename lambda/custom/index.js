const Alexa = require("alexa-sdk");
const config = require("./config");

/**
 * We import handlers as they are separated in different files
 */
const didNotUnderstandHandler = require("./handlers/didNotUnderstandHandler");
const guessMyNumberStateHandler = require("./handlers/guessMyNumberHandler");
const sendMessageHandler = require("./handlers/sendMessageHandler");
const singLullabyStateHandler = require("./handlers/singLullabyHandler");
const welcomeStateHandler = require("./handlers/welcomeHandler");

const newSessionHandlers = {
  LaunchRequest: function() {
    this.handler.state = config.STATES.WELCOME_STATE;
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
      sendMessageHandler,
      singLullabyStateHandler,
      welcomeStateHandler,
      didNotUnderstandHandler
  );
  alexa.execute();
};
