'use strict';

var normalize, _, models, Q;

normalize = require('../utils').normalize;
models = require('../models');
_ = require('lodash');
Q = require('q');

function getEntryId (table, field, value, text, score) {
  var query, model, objToSave, deffered = Q.defer();

  if (table === 'Urllist') {
    model = models.Urllists;
    objToSave = {
      'url': value,
      'description': text,
      'score': score
    };
    query = {
      'where': {},
      'attributes': ['id']
    };
  } else {
    model = models.Wordlists;
    objToSave = {
      'word': value
    };
    query = {
      'where': {},
      'attributes': ['id', 'count']
    };
  }

  query.where[field.toString()] = value;
  model.find(query, {'raw': true}).then(function (result) {
    if (!result) {
      model.create(objToSave).then(function (res) {
        deffered.resolve(res.id);
      }, function (err) {
        deffered.reject(err);
      });
    } else if (result && table !== 'Urllist') {
      result.updateAttributes({
        'count': result.count + 1
      }).then(function () {
        deffered.resolve('ok');
      }, function (err) {
        deffered.reject(err);
      });
    }
  });
  return deffered.promise;
}

function isIndexed (href) {
  var deffered = Q.defer();
  var query = {
    'where': {
      'url': href
    },
    'attributes': ['id']
  };

  models.Urllists.find(query, {'raw': true}).then(function (u) {
    if (u) {
      query = {
        'where': {
          'urlid': u.id
        }
      };

      models.Wordlocations.find(query, {'row': true}).then(function (v) {
        if (v) {
          deffered.resolve(true);
        }
      });
    }

    deffered.resolve(false);
  });

  return deffered.promise;
}

function addToIndex (href, text, score) {
  var words;

  isIndexed(href).then(function (status) {
    if (!status) {
      words = normalize(text);
      getEntryId('Urllist', 'url', href, text, score).then(function (urlid) {
        var dataChain = Q.resolve([]);

        _.each(words, function (word, idx) {
          dataChain = dataChain.then(function (data) {
            return getEntryId('Wordlist', 'word', word, '', '').then(function (wordid) {
              if (wordid !== 'ok') {
                data = data.concat([{
                  'urlid': urlid,
                  'wordid': wordid,
                  'location': idx
                }]);
              }
              return data;
            });
          });
        });

        dataChain.then(function (res) {
          console.log(res);
          models.Wordlocations.bulkCreate(res).then(function () {
            return true;
          }, function (err) {
            console.log(err);
            return false;
          });
        });
      });
    }
  });
}

function insertTopics (topics) {
  _.each(topics, function (topic) {
    addToIndex(topic.href, topic.text, topic.score);
  });
}

// public methods
module.exports = {
  'addToIndex': addToIndex,
  'isIndexed': isIndexed
};
