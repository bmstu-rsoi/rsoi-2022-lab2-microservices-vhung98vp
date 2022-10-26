'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books', [{
      id: 1,
      book_uid: "f7cdc58f-2caf-4b15-9727-f89dcc629b27",
      name: "Краткий курс C++ в 7 томах",
      author: "Бьерн Страуструп",
      genre: "Научная фантастика",
      condition: "EXCELLENT",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', null, {});
  }
};
