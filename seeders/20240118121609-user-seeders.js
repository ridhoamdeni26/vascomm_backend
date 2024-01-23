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
          phone: "081628162812",
          password: await bycrpt.hash("rahasia123", 10),
          role: "user",
          user_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: "Vascomm Admin",
          email: "vascommadmins@vascomm.com",
          phone: "082618261827",
          password: await bycrpt.hash("rahasia1234", 10),
          user_active: true,
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
