'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 一个用户有多个课程,别名courses
            models.User.hasMany(models.Course, {as: "courses"})

            /*
                User和Course建立多对多关系,关联别名LikeCourses,用外键用户的ID来进行查询Likes表
            * */
            models.User.belongsToMany(models.Course, { as: "LikeCourses", through: "Likes", foreignKey: "userId" })
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "用户名已经存在，请直接登录"
            },
            validate: {
                notNull: {msg: "用户名必须填写"},
                notEmpty: {msg: "用户名不能为空字符串"},
                len: {args: [2, 45], msg: "长度必须是2~45之间"}
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "密码必须填写"},
                notEmpty: {msg: "密码不能为空字符串"},
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "邮箱已经存在，请直接登录"
            },
            validate: {
                notNull: {msg: "邮箱必须填写"},
                notEmpty: {msg: "邮箱不能为空字符串"},
            },
        },
        isAdmin: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        },
        avatar: DataTypes.STRING,
        sex: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        signature: DataTypes.STRING,
        introduce: DataTypes.STRING,
        company: DataTypes.STRING,
        verificationCode: {
            type: DataTypes.STRING,
        },
        verificationCodeExpiration: {
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
