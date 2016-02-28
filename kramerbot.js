'use strict';

var messages = [
    'GIDDYUP'
];

var Bot = require('slackbots');
var token = process.env.BOT_API_KEY;
var settings = {
    token: token,
    name: 'heykramer'
};
var bot = new Bot(settings);

bot.on( 'message', function(message) {
    var me = this.users.filter(function (user) {
        return user.name === 'heykramer';
    })[0];

    if( message.type === 'message' && Boolean(message.text) ) {

        if( message.text.toLowerCase().indexOf('seinfeld') > -1
              || message.text.toLowerCase().indexOf(this.name) > -1
              || message.text.indexOf(me.id) > -1) {

          if( message.user !== me.id ) {
              var params = {
                  link_names: 1,
                  as_user: true
              };

              var fromUser = this.users.filter(function(user) {
                  return user.id === message.user;
              })[0]['name'];

              var channel = this.channels.filter(function (item) {
                  return item.id === message.channel;
              })[0];

              var randMessage = messages[Math.floor(Math.random() * messages.length)];

              bot.postMessageToChannel(channel.name, '@' + fromUser + ' ' + randMessage, params);
          }

        }
    }
});
