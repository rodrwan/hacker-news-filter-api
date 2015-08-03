'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Links', ['fromid'], {
      indexName: 'urlfromidx',
      indicesType: 'UNIQUE'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Links', 'fromid');
  }
};
