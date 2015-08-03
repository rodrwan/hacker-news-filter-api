'use strict';

var BASE_URL, Hapi, server, database, dotenv, fs, crawler, searcher, pages, _;

dotenv = require('dotenv');
fs = require('fs');
Hapi = require('hapi');
_ = require('lodash');

database = require('./database');
crawler = require('./crawler');
searcher = require('./searcher');

BASE_URL = 'https://news.ycombinator.com/';
if (fs.existsSync('.env')) {
  dotenv.load();
}
// pages = [];
// pages = crawler.getTopics(BASE_URL, pages);
// _.each(pages, function (topics) {
//   _.each(topics, function (topic) {
//     database.addToIndex(topic.href, topic.text, topic.score);
//   });
// });
// console.log('done');
function callEachHour () {
  var topics = crawler.firstPage(BASE_URL);

  console.log('UPDATING DATA !!!');
  _.each(topics, function (topic) {
    database.addToIndex(topic.href, topic.text, topic.score);
  });
}

setInterval(callEachHour, 1000 * 60 * 60);
// Create a server with a host and port
server = new Hapi.Server();
server.connection({
    'host': 'localhost',
    'port': process.env.PORT,
    'routes': {
      'cors': true
    }
});

server.route({
  'method': 'GET',
  'path': '/api/query/{query?}',
  'handler': function (request, reply) {
    var topics;

    if (request.params.query) {
      console.log('Looking post related to: ' + request.params.query);
      searcher.query(request.params.query).then(function (results) {
        if (results.length === 0) {
          reply({
            'message': 'No matches was found.'
          }).header('Content-Type', 'application/json');
        }

        reply(results).header('Content-Type', 'application/json');
      });
    } else {
      console.log('loading first page');
      topics = crawler.firstPage(BASE_URL);
      reply(topics).header('Content-Type', 'application/json');
    }
  }
});

console.log('Listening on port: ' + process.env.PORT);
// Start the server
server.start();
