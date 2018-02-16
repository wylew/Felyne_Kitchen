/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports one language en-US.
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto

TODO 06162017
-create custom error messages for each of the other intent types
-explore name change now that I have added other features
-can I do multiple slots in a single intent to support two fuctions
    "Alexa, ask Felyne Kitchen where I can find {material} in {map}"
    "Alexa, ask Felyne Kitchen the travel path of {monster} in {map}"
Help in forum here: https://forums.developer.amazon.com/questions/67232/how-do-you-specify-multiple-slot-types-in-intent-s.html

 **/

'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');
const pitfalltraps = require('./pitfalltraps');
const shocktraps = require('./shocktraps');
const sonicbombs = require('./sonicbombs');
const flashbombs = require('./flashbombs');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            PITFALLTRAPS: pitfalltraps.PITFALLTRAPS_EN_US,
            SHOCKTRAPS: shocktraps.SHOCKTRAPS_EN_US,
            SONICBOMBS: sonicbombs.SONICBOMBS_EN_US,
            FLASHBOMBS: flashbombs.FLASHBOMBS_EN_US,
            SKILL_NAME: 'Village Chief',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a Max Potion? Or, is the Rathian vulnerable to Shock Traps? ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            RECIPE_DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, is a monster vulnerable to you a certain trap or bomb, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or, is a monster vulnerable to you a certain trap or bomb, or, you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Happy Hunting!',

            //recipe messages
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',

            //pitfalltraps messages
            PITFALLTRAPS_REPEAT_MESSAGE: 'Try saying repeat.',
            PITFALLTRAPS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            PITFALLTRAPS_NOT_FOUND_WITH_ITEM_NAME: 'anything about the %s. ',
            PITFALLTRAPS_NOT_FOUND_WITHOUT_ITEM_NAME: 'anything about that monster. ',
            PITFALLTRAPS_NOT_FOUND_REPROMPT: 'What else can I help with?',
            PITFALLTRAPS_DISPLAY_CARD_TITLE: '%s - About the %s.',

            //shocktraps messages
            SHOCKTRAPS_REPEAT_MESSAGE: 'Try saying repeat.',
            SHOCKTRAPS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            SHOCKTRAPS_NOT_FOUND_WITH_ITEM_NAME: 'anything about the %s. ',
            SHOCKTRAPS_NOT_FOUND_WITHOUT_ITEM_NAME: 'anything about that monster. ',
            SHOCKTRAPS_NOT_FOUND_REPROMPT: 'What else can I help with?',
            SHOCKTRAPS_DISPLAY_CARD_TITLE: '%s - About the %s.',

            //sonicbombs messages
            SONICBOMBS_REPEAT_MESSAGE: 'Try saying repeat.',
            SONICBOMBS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            SONICBOMBS_NOT_FOUND_WITH_ITEM_NAME: 'anything about the %s. ',
            SONICBOMBS_NOT_FOUND_WITHOUT_ITEM_NAME: 'anything about that monster. ',
            SONICBOMBS_NOT_FOUND_REPROMPT: 'What else can I help with?',
            SONICBOMBS_DISPLAY_CARD_TITLE: '%s - About the %s.',

            //flashbombs messages
            FLASHBOMBS_REPEAT_MESSAGE: 'Try saying repeat.',
            FLASHBOMBS_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            FLASHBOMBS_NOT_FOUND_WITH_ITEM_NAME: 'anything about the %s. ',
            FLASHBOMBS_NOT_FOUND_WITHOUT_ITEM_NAME: 'anything about that monster. ',
            FLASHBOMBS_NOT_FOUND_REPROMPT: 'What else can I help with?',
            FLASHBOMBS_DISPLAY_CARD_TITLE: '%%s - About the %s.',
        },
    },
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            PITFALLTRAPS: pitfalltraps.PITFALLTRAPS_EN_US,
            SHOCKTRAPS: shocktraps.SHOCKTRAPS_EN_US,
            SONICBOMBS: sonicbombs.SONICBOMBS_EN_US,
            FLASHBOMBS: flashbombs.FLASHBOMBS_EN_US,
            SKILL_NAME: 'Village Chief',
        },
    },
    };

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'RecipeIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('RECIPE_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':tellWithCard', recipe, this.attributes.repromptSpeech, cardTitle, recipe);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },




//START OF PITFALL TRAPS INTENT//
    'pitfalltraps': function () {
        const monsterSlot = this.event.request.intent.slots.monster;
        let monsterName;
        if (monsterSlot && monsterSlot.value) {
            monsterName = monsterSlot.value.toLowerCase();
        }

        const cardTitle = this.t('PITFALLTRAPS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), monsterName);
        const myPitfalltraps = this.t('PITFALLTRAPS');
        const pitfalltraps = myPitfalltraps[monsterName];

        if (pitfalltraps) {
            this.attributes.speechOutput = pitfalltraps;
            this.attributes.repromptSpeech = this.t('PITFALLTRAPS_REPEAT_MESSAGE');
            this.emit(':tellWithCard', pitfalltraps, this.attributes.repromptSpeech, cardTitle, pitfalltraps);
        } else {
            let speechOutput = this.t('PITFALLTRAPS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('PITFALLTRAPS_NOT_FOUND_REPROMPT');
            if (monsterName) {
                speechOutput += this.t('PITFALLTRAPS_NOT_FOUND_WITH_ITEM_NAME', monsterName);
            } else {
                speechOutput += this.t('PITFALLTRAPS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech); 

        }
    },
//END OF PITFALL TRAPS INTENT//

/*
//START OF PITFALL TRAPS INTENT//
    'pitfalltraps': function () {
        const monsterSlot = this.event.request.intent.slots.monster;
        let monsterName;
        if (monsterSlot && monsterSlot.value) {
            monsterName = monsterSlot.value.toLowerCase();
        }

        const cardTitle = this.t('PITFALLTRAPS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), monsterName);
        const myPitfalltraps = this.t('PITFALLTRAPS');
        const pitfalltraps = myPitfalltraps[monsterName];

        if (pitfalltraps) {
            this.attributes.speechOutput = pitfalltraps;
            this.attributes.repromptSpeech = this.t('PITFALLTRAPS_REPEAT_MESSAGE');
            this.emit(':askWithCard', pitfalltraps, this.attributes.repromptSpeech, cardTitle, pitfalltraps);
        } else {
            let speechOutput = this.t('PITFALLTRAPS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('PITFALLTRAPS_NOT_FOUND_REPROMPT');
            if (monsterName) {
                speechOutput += this.t('PITFALLTRAPS_NOT_FOUND_WITH_ITEM_NAME', monsterName);
            } else {
                speechOutput += this.t('PITFALLTRAPS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech); 

        }
    },
//END OF PITFALL TRAPS INTENT//
*/


//START OF SHOCK TRAPS INTENT//
    'shocktraps': function () {
        const monsterSlot = this.event.request.intent.slots.monster;
        let monsterName;
        if (monsterSlot && monsterSlot.value) {
            monsterName = monsterSlot.value.toLowerCase();
        }

        const cardTitle = this.t('SHOCKTRAPS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), monsterName);
        const myShocktraps = this.t('SHOCKTRAPS');
        const shocktraps = myShocktraps[monsterName];

        if (shocktraps) {
            this.attributes.speechOutput = shocktraps;
            this.attributes.repromptSpeech = this.t('SHOCKTRAPS_REPEAT_MESSAGE');
            this.emit(':tellWithCard', shocktraps, this.attributes.repromptSpeech, cardTitle, shocktraps);
        } else {
            let speechOutput = this.t('SHOCKTRAPS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('SHOCKTRAPS_NOT_FOUND_REPROMPT');
            if (monsterName) {
                speechOutput += this.t('SHOCKTRAPS_NOT_FOUND_WITH_ITEM_NAME', monsterName);
            } else {
                speechOutput += this.t('SHOCKTRAPS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
//END OF SHOCK TRAPS INTENT//

//START OF SONIC BOMBS INTENT//
    'sonicbombs': function () {
        const monsterSlot = this.event.request.intent.slots.monster;
        let monsterName;
        if (monsterSlot && monsterSlot.value) {
            monsterName = monsterSlot.value.toLowerCase();
        }

        const cardTitle = this.t('SONICBOMBS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), monsterName);
        const mySonicbombs = this.t('SONICBOMBS');
        const sonicbombs = mySonicbombs[monsterName];

        if (sonicbombs) {
            this.attributes.speechOutput = sonicbombs;
            this.attributes.repromptSpeech = this.t('SONICBOMBS_REPEAT_MESSAGE');
            this.emit(':tellWithCard', sonicbombs, this.attributes.repromptSpeech, cardTitle, sonicbombs);
        } else {
            let speechOutput = this.t('SONICBOMBS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('SONICBOMBS_NOT_FOUND_REPROMPT');
            if (monsterName) {
                speechOutput += this.t('SONICBOMBS_NOT_FOUND_WITH_ITEM_NAME', monsterName);
            } else {
                speechOutput += this.t('SONICBOMBS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
//END OF SONIC BOMBS INTENT//

//START OF FLASH BOMBS INTENT//
    'flashbombs': function () {
        const monsterSlot = this.event.request.intent.slots.monster;
        let monsterName;
        if (monsterSlot && monsterSlot.value) {
            monsterName = monsterSlot.value.toLowerCase();
        }

        const cardTitle = this.t('FLASHBOMBS_DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), monsterName);
        const myFlashbombs = this.t('FLASHBOMBS');
        const flashbombs = myFlashbombs[monsterName];

        if (flashbombs) {
            this.attributes.speechOutput = flashbombs;
            this.attributes.repromptSpeech = this.t('FLASHBOMBS_REPEAT_MESSAGE');
            this.emit(':tellWithCard', flashbombs, this.attributes.repromptSpeech, cardTitle, flashbombs);
        } else {
            let speechOutput = this.t('FLASHBOMBS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('FLASHBOMBS_NOT_FOUND_REPROMPT');
            if (monsterName) {
                speechOutput += this.t('FLASHBOMBS_NOT_FOUND_WITH_ITEM_NAME', monsterName);
            } else {
                speechOutput += this.t('FLASHBOMBS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
//END OF FLASH BOMBS INTENT//

    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
