'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('flows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ip_src: {
        type: Sequelize.STRING
      },
      ip_dst: {
        type: Sequelize.STRING
      },
      port_dst: {
        type: Sequelize.STRING
      },
      label: {
        type: Sequelize.STRING
      },
      len_fwd: {
        type: Sequelize.FLOAT
      },
      len_bwd: {
        type: Sequelize.FLOAT
      },
      timestamp: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('flows');
  }
};