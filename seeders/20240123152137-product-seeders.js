"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = Array.from({ length: 50 }).map(() => ({
      name: faker.commerce.productName(),
      product_active: faker.datatype.boolean(),
      price: faker.commerce.price(),
      description: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("products", products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
