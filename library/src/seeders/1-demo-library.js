'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('libraries', [{
      id: 1,
      library_uid: "83575e12-7ce0-48ee-9931-51919ff3c9ee",
      name: "Библиотека имени 7 Непьющих",
      city: "Москва",
      address: "2-я Бауманская ул., д.5, стр.1",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('libraries', null, {});
  }
};
