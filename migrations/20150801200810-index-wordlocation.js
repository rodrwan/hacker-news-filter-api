'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Wordlocations', ['wordid'], {
      indexName: 'wordurlidx',
      indicesType: 'UNIQUE'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Wordlocations', 'wordurlidx');
  }
};
