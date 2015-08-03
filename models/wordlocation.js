'use strict';
module.exports = function (sequelize, DataTypes) {
  var Wordlocation = sequelize.define('Wordlocations', {
    urlid: DataTypes.INTEGER,
    wordid: DataTypes.INTEGER,
    location: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Wordlocation;
};
