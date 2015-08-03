'use strict';
module.exports = function (sequelize, DataTypes) {
  var Wordlist = sequelize.define('Wordlists', {
    word: DataTypes.TEXT,
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Wordlist;
};
