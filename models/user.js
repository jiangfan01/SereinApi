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
            models.User.hasMany(models.Course, {as: "courses"})
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
        isAdmin: {
          type:DataTypes.TINYINT,
            allowNull:false,
            validate:{
              notNull:{msg:"必须填写是否为管理员"}
            }
        },
        avatar: DataTypes.STRING,
        sex: {
            type:DataTypes.TINYINT,
            allowNull:false,
            validate:{
                notNull:{msg:"必须填写性别"}
            }
        },
        signature: DataTypes.STRING,
        introduce: DataTypes.STRING,
        company: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
