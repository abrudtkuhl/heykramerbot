'use strict';

var util = require('util');
var path = require('path');
var Bot = require('slackbots');
var WP = require( 'wordpress-rest-api' );

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token : the API token of the bot (mandatory)
 *      name : the name of the bot (will default to "heykramer")
 *      api : the api endpoint
 *
 * @param {object} settings
 * @constructor
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */
var KramerBot = function Constructor(settings) {
    this.settings = settings;
    this.user = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(KramerBot, Bot);

/**
 * Run the bot
 * @public
 */
KramerBot.prototype.run = function () {
    KramerBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
KramerBot.prototype._onStart = function () {
    this._loadBotUser();
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
KramerBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromKramerBot(message) &&
        this._isMentioningMe(message)
    ) {
        this._replyWithRandom(message);
    }
};

/**
 * Replyes to a message with a random Joke
 * @param {object} originalMessage
 * @private
 */
KramerBot.prototype._replyWithRandom = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    var wp = new WP({ endpoint: self.settings.api });
    wp.root('api/any').get(function( err, data ) {
        if (err) {
            console.log('error connectiong to api');
        }
        self.postMessageToChannel(channel.name, '@' + self._getMessageUserName(originalMessage) + ' ' + data[0]['post_content'], {as_user: true, link_names: 1});
    });
};

/**
 * Loads the user object representing the bot
 * @private
 */
KramerBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
KramerBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
KramerBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

/**
 * Util function to check if a given real time message is mentioning the KramerBot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
KramerBot.prototype._isMentioningMe = function (message) {
    return message.text.indexOf(this.user.id) > -1;
};

/**
 * Util function to check if a given real time message has ben sent by the KramerBot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
KramerBot.prototype._isFromKramerBot = function (message) {
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
KramerBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

/**
 * Util function to get the username of the person that posted the slack message we are responding to
 * @param {object} message
 * @returns {string}
 * @private
 */
KramerBot.prototype._getMessageUserName = function (message) {
    return this.users.filter(function(user) {
        return user.id === message.user;
    })[0]['name'];
}

module.exports = KramerBot;
