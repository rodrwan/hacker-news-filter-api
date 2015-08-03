'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Wordlists', ['word'], {
      indexName: 'wordidx',
      indicesType: 'UNIQUE'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Wordlists', 'wordidx');
  }
};
