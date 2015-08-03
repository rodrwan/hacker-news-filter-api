'use strict';

var natural, stopwords, punctuation, tokenizer, _;

natural = require('natural');
stopwords = require('stopwords').english;
_ = require('lodash');

punctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\.\/:;<=>\?@\[\]\^_`\{\|\}~]/g;
tokenizer = new natural.WordTokenizer();

function normalize (text) {
  var tokens = [];

  text = text.toLowerCase();
  text = text.replace(punctuation, '').replace(/\s+/g, ' ');
  _.each(tokenizer.tokenize(text), function (token) {
    if (stopwords.indexOf(token) === -1) {
      tokens.push(token);
    }
  });

  return tokens;
}

module.exports = {
  'normalize': normalize
};
