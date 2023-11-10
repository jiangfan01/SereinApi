'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 插入一百条假数据
    const articles = []
    for (let i = 0; i < 100 ; i++) {
      articles.push({
        title: `测试标题${i}`,
        content: `测试内容${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
