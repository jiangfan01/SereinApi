'use strict';
const {
    Model, BOOLEAN
} = require('sequelize');
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 课程属于分类,别名category,用分类ID来关联
            models.Course.belongsTo(models.Category,{as:"category",foreignKey:"categoryId"})
            // 课程属于用户,别名user,使用用户ID来关联
            models.Course.belongsTo(models.User,{as:"user",foreignKey:"userId"})
            // 课程有很多章节,别名chapters
            models.Course.hasMany(models.Chapter,{as:"chapters"})
        }
    }

    Course.init({
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {msg: "分类必须填写"},
                notEmpty: {msg: "分类不能为空字符串"},
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {msg: "分类必须选择"},
                notEmpty: {msg: "分类不能为空字符串"},
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "名称必须填写"},
                notEmpty: {msg: "名称不能为空字符串"},
                len: {args: [2, 10], msg: "长度必须是2~10之间"}
            },
        },
        image: DataTypes.TEXT,
        recommended: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {msg: "必须选择是否推荐"},
            }
        },
        introductory: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {msg: "必须选择是否介绍"},
            }
        },
        content: DataTypes.TEXT,
        likesCount: DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            get() {
                moment.locale("zh-CN")
                return moment(this.getDataValue("createdAt")).format("ll")
            }
        }
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;
};
