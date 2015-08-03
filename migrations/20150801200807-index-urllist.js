'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Urllists', ['url'], {
      indexName: 'urlidx',
      indicesType: 'UNIQUE'
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Urllists', 'urlidx');
  }
};
