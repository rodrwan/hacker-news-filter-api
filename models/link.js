'use strict';
module.exports = function (sequelize, DataTypes) {
  var Link = sequelize.define('Links', {
    fromid: DataTypes.INTEGER,
    toid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Link;
};
