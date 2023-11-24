'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class History extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 浏览历史属于课程和章节,别名course,chapter
            models.History.belongsTo(models.Course, { as: "course" })
            models.History.belongsTo(models.Chapter, { as: "chapter" })
        }
    }

    History.init({
        userId: DataTypes.INTEGER,
        courseId: DataTypes.INTEGER,
        chapterId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'History',
    });
    return History;
};
