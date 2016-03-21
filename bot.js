#!/usr/bin/env node

'use strict';

/**
 * KramerBot launcher script.
 *
 * @author Andy Brudtkuhl <abrudtkuhl@gmail.com>
 */

var KramerBot = require('./kramerbot');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 *  BOT_API: the api endpoint for the WP Rest API
 */
var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME || 'heykramer';
var api = process.env.BOT_API || 'https://heykramer.com/wp-json/';

var kramerbot = new KramerBot({
    token: token,
    api: api,
    name: name
});

kramerbot.run();
