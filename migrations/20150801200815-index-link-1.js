'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Links', ['toid'], {
      indexName: 'urltoidx',
      indicesType: 'UNIQUE'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Links', 'toid');
  }
};
