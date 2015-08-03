'use strict';
module.exports = function (sequelize, DataTypes) {
  var Linkwords = sequelize.define('Linkwords', {
    wordid: DataTypes.INTEGER,
    linkid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Linkwords;
};
