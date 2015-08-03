'use strict';
module.exports = function (sequelize, DataTypes) {
  var Urllist = sequelize.define('Urllists', {
    url: DataTypes.TEXT,
    description: DataTypes.TEXT,
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Urllist;
};
