'use strict';

var normalize, models, _, Q, sequelize;

normalize = require('../utils').normalize;
_ = require('lodash');
models = require('../models');
sequelize = models.sequelize;
Q = require('q');

function getMatchRows (q) {
  var fieldlist = 'w0.urlid',
      tablelist = '',
      clauselist = '',
      wordids = Q.resolve([]),
      deffered = Q.defer(),
      words = normalize(q),
      tablenumber = 0;

  _.each(words, function (word) {
    var search = {};

    wordids = wordids.then(function (arr) {
      search = {
        'where': {
          'word': word
        },
        'attributes': ['id']
      };

      return models.Wordlists.findOne(search, {'raw': true}).then(function (result) {
        arr = arr.concat([result.id]);
        return arr;
      });
    });
  });

  wordids.then(function (wids) {
    _.each(wids, function (wid) {
      if (tablenumber > 0) {
        tablelist += ', ';
        clauselist += ' and ';
        clauselist += 'w' + (tablenumber - 1) + '.urlid=w' + tablenumber + '.urlid and ';
      }

      fieldlist += ', w' + tablenumber + '.location';
      tablelist += 'Wordlocations w' + tablenumber;
      clauselist += 'w' + tablenumber + '.wordid=' + wid;
      tablenumber += 1;
    });

    var fullquery = 'SELECT ' + fieldlist + ' FROM ' + tablelist + ' WHERE ' + clauselist + ';';
    sequelize.query(fullquery, {'type': sequelize.QueryTypes.SELECT})
    .then(function (result) {
      deffered.resolve([result, wids]);
    });
  });

  return deffered.promise;
}

function getUrlName (id) {
  var deffered = Q.defer(),
      search = {
    'where': {
      'id': id
    },
    'attributes': ['url', 'description', 'score']
  };

  models.Urllists.find(search, {'raw': true}).then(function (result) {
    if (result) {
      deffered.resolve(result);
    } else {
      deffered.resolve({});
    }
  }, function (err) {
    deffered.reject(err);
  });

  return deffered.promise;
}

function getScoredList (rows) {
  var totalscores = {},
      weights = [];

  _.each(rows, function (row) {
    totalscores[row.urlid.toString()] = 0;
  });

  _.each(rows, function (row) {
    weights.push([1.0, distanceScore(row)]);
  });

  _.each(weights, function (weight) {
    _.each(Object.keys(totalscores), function (key) {
      totalscores[key.toString()] += weight[0] * weight[1][key.toString()];
    });
  });

  return totalscores;
}

function distanceScore (row) {
  var response = {};
  response[row.urlid.toString()] = 1.0;
  return response;
}

function query (q) {
  var deffered = Q.defer();
  var search = {
    'where': {
      'description': {
        'like': '%' + q + '%'
      }
    },
    'attributes': ['url', 'description', 'score']
  };
  var topics = [];
  models.Urllists.findAll(search).then(function (results) {
    _.each(results, function (result) {
      topics.push({
        'href': result.url,
        'text': result.description,
        'score': result.score
      });
    });
    deffered.resolve(topics);
  });
  // getMatchRows(q).then(function (matches) {
  //   var rows = matches[0],
  //       wordids = matches[1],
  //       scores,
  //       results = Q.resolve([]);

  //   scores = getScoredList(rows);

  //   _.each(Object.keys(scores), function (key) {
  //     results = results.then(function (arr) {
  //       return getUrlName(key).then(function (res) {
  //         arr = arr.concat([{
  //           'href': res.url,
  //           'text': res.description,
  //           'score': res.score
  //         }]);

  //         return arr;
  //       });
  //     });
  //   });

  //   return results.then(function (result) {
  //     deffered.resolve(result);
  //   });
  // });
  return deffered.promise;
}

module.exports = {
  'query': query,
  'getMatchRows': getMatchRows,
  'getUrlName': getUrlName
};
