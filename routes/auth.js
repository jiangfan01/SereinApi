const express = require('express');
const router = express.Router();
const models = require('../models');
const {success, error} = require("../utlis/messages")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");

/**
 * POST /auth/sign_up
 * 注册
 */
router.post("/sign_up", async function (req, res, next) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        if (!username) {
            return error(res, "用户名必须填写！");
        }

        if (!password) {
            return error(res, "密码必须填写！");
        }

        if (!email) {
            return error(res, "邮箱必须填写！");
        }

        // 判断邮箱是否已经注册过
        const existingEmail = await models.User.findOne({ where: { email } });
        if (existingEmail) {
            return error(res, "邮箱已注册，请直接登录！");
        }

        // 1、生成盐 2、对密码进行加密
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await models.User.create({
            ...req.body,
            password: hash,
            isAdmin: false
        });
        success(res, "注册成功", { user });
    } catch (err) {
        error(res, err);
    }
});

/**
 * POST /auth/sign_in
 * 登录
 */
router.post("/sign_in", async function (req, res, next) {
    try {
        const usernameOrEmail = req.body.usernameOrEmail;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword; // 新增确认密码字段

        if (!usernameOrEmail || !password || !confirmPassword) {
            return error(res, "用户名/邮箱、密码和确认密码必须填写！");
        }

        // 确认密码是否匹配
        if (password !== confirmPassword) {
            return error(res, "密码和确认密码不一致！");
        }

        // 通过用户名或邮箱查询用户是否是管理员和用户是否存在
        const user = await models.User.findOne({
            where: {
                [Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail } // 添加邮箱查询条件
                ]
            }
        });
        if (!user) {
            return error(res, "用户不存在，请联系管理员！");
        }

        // 再比对密码是否正确
        if (!bcrypt.compareSync(password, user.password)) {
            return error(res, "密码错误！");
        }

        const token = jwt.sign({
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        }, process.env.SECRET, { expiresIn: "7d" });

        success(res, "登录成功", { token });
    } catch (err) {
        error(res, err);
    }
});
module.exports = router;
