'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });

    await queryInterface.addColumn('categories', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'updatedAt');
    await queryInterface.removeColumn('categories', 'createdAt');
  }
};