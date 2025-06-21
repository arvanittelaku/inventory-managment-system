'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('categories', 'created_by_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      references: {
        model: 'users', 
        key: 'user_id',  
      },
      onUpdate: 'CASCADE', 
      onDelete: 'SET NULL', 
    });

  
    await queryInterface.addColumn('categories', 'updated_by_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove updated_by_user_id
    await queryInterface.removeColumn('categories', 'updated_by_user_id');
    // Remove created_by_user_id
    await queryInterface.removeColumn('categories', 'created_by_user_id');
  }
};