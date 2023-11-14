const {error, success} = require("../../utlis/messages");
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const models = require('../../models');
const bcrypt = require("bcryptjs")
const {Op} = require("sequelize");

/**
 * POST /admin/auth/login
 * 登录
 */
router.post("/login", async function (req, res, next) {
    try {
// 获取登录信息
        const usernameOrEmail = req.body.usernameOrEmail;
        const password = req.body.password;

        if (!usernameOrEmail || !password) {
            return error(res, "用户名/邮箱和密码必须填写！");
        }

        // 通过用户名或邮箱查询用户是否是管理员和用户是否存在
        const user = await models.User.findOne({
            where: {
                [Op.or]: [
                    {username: usernameOrEmail},
                    {email: usernameOrEmail} // 添加邮箱查询条件
                ]
            }
        });
        console.log(555, user)
        if (!user) {
            return error(res, "用户不存在，请联系管理员！")
        }
        if (!user.isAdmin) {
            return error(res, "用户不是管理员无法登录")
        }

        // 再比对密码是否正确
        if (!bcrypt.compareSync(password, user.password)) {
            return error(res, "密码错误！")
        }

        // token包生产token
        const token = jwt.sign({
            //对user的id和admin进行加密
            user: {
                id: user.id,
                admin: user.admin
            }
        }, process.env.SECRET, {expiresIn: "7d"});
        //  env.SECRET在环境变量中定义
        success(res, "登录成功", {token})
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;