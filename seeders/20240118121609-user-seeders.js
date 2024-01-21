"use strict";

const bycrpt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "Vascomm Users",
          email: "vascommusers@vascomm.com",
          password: await bycrpt.hash("rahasia123", 10),
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: "Vascomm Admin",
          email: "vascommadmins@vascomm.com",
          password: await bycrpt.hash("rahasia1234", 10),
          role: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
