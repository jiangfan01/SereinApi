'use strict';
const {
    Model
} = require('sequelize');
const moment = require("moment/moment");
module.exports = (sequelize, DataTypes) => {
    class Chapter extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Chapter.belongsTo(models.Course, {as: "course", foreignKey: "courseId"})
        }
    }

    Chapter.init({
        courseId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty: {msg: "排序不能为空数字"},
                notNull:{msg:"必须填写属于什么课程"},
                isInt:{msg:"课程id必须是整数"},
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "标题必须填写"},
                notEmpty: {msg: "标题不能为空字符串"},
                len: {args: [2, 45], msg: "长度必须是2~45之间"}
            },
        },
        video: DataTypes.STRING,
        sort: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {msg: "排序必须填写"},
                notEmpty: {msg: "排序不能为空字符串"},
                len: {args: [1, 99], msg: "长度必须是1~99之间"},
                isInt: {msg: "排序必须是整数"},
            },
        },
        content: DataTypes.TEXT,
        contentHtml: DataTypes.TEXT,
        createdAt:{
            type:DataTypes.DATE,
            get(){
                moment.locale("zh-CN")
                return moment(this.getDataValue("createdAt")).format("ll")
            }
        }
    }, {
        sequelize,
        modelName: 'Chapter',
    });
    return Chapter;
};
