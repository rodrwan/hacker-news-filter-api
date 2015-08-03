'use strict';

var request, cheerio, baseUrl, _, totalTopics;

request = require('sync-request');
cheerio = require('cheerio');
_ = require('lodash');

baseUrl = 'https://news.ycombinator.com/';

function getTopics (requestUrl, topics, currentPages) {
  var $, $trs, $table, scores, topic, nextPage, html, res, tmpTopics;

  topics = (typeof topics === 'undefined' ? [] : topics);
  if (typeof requestUrl === 'undefined' || currentPages === 20) {
    // console.log('done');
    return topics;
  }
  res = request('GET', requestUrl);
  html = res.getBody();
  tmpTopics = [];
  scores = [];
  $ = cheerio.load(html);

  $table = $('table#hnmain');
  $table = $($table).find('tr:nth-child(3) > td');
  $ = cheerio.load($($table).html());
  $trs = $('tr');

  _.each($trs, function (tr) {
    var lenTd, score, text, href;

    lenTd = $(tr).find('td').length;
    if (lenTd === 3) {
      text = $(tr).find('td:nth-child(3) a').text();
      href = $(tr).find('td:nth-child(3) a').attr('href');
      if (_.contains(href, 'item?id')) {
        href = baseUrl + href;
      }

      topic = {
        'text': text,
        'href': href
      };
      tmpTopics.push(topic);
    } else if (lenTd === 2) {
      score = parseInt($(tr).find('td.subtext span.score').text().split(' ')[0], 10) || 0;
      scores.push(score);
      if (typeof $(tr).find('td.title a').attr('href') !== 'undefined') {
        nextPage = baseUrl + $(tr).find('td.title a').attr('href');
        // console.log(nextPage);
      }
    }
  });

  _.each(tmpTopics, function (topic, idx) {
    tmpTopics[idx].score = scores[idx];
  });

  topics.push(tmpTopics);
  return getTopics(nextPage, topics, currentPages + 1);
}

function firstPage (requestUrl) {
  var $, $trs, $table, scores, topic, html, tmpTopics;

  html = request('GET', requestUrl).getBody();
  tmpTopics = [];
  scores = [];
  $ = cheerio.load(html);

  $table = $('table#hnmain');
  $table = $($table).find('tr:nth-child(3) > td');
  $ = cheerio.load($($table).html());
  $trs = $('tr');

  _.each($trs, function (tr) {
    var lenTd, score, text, href;

    lenTd = $(tr).find('td').length;
    if (lenTd === 3) {
      text = $(tr).find('td:nth-child(3) a').text();
      href = $(tr).find('td:nth-child(3) a').attr('href');
      if (_.contains(href, 'item?id')) {
        href = baseUrl + href;
      }

      topic = {
        'text': text,
        'href': href
      };
      tmpTopics.push(topic);
    } else if (lenTd === 2) {
      score = parseInt($(tr).find('td.subtext span.score').text().split(' ')[0], 10) || 0;
      scores.push(score);
    }
  });

  _.each(tmpTopics, function (topic, idx) {
    tmpTopics[idx].score = scores[idx];
  });

  return tmpTopics;
}

module.exports = {
  'firstPage': firstPage,
  'getTopics': getTopics
};
