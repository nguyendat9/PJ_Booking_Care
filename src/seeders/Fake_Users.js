'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{

      email: 'new@gmail.com',
      password: '123456',
      firstName: 'new',
      lastName: 'new',
      address: 'Hà Nội',
      gender: 'Nam',
      roles: 'R1',
      phoneNumber: '0926019013',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
