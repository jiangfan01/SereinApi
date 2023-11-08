const {error, success} = require("../../utlis/messages");
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const models = require('../../models');
const bcrypt = require("bcryptjs")

/**
 * POST /admin/auth
 * 登录
 */
router.post("/", async function (req, res, next) {
    try {
        //获取账号密码进行验证
        const username = req.body.username
        const password = req.body.password

        if (!username) {
            return error(res, "用户名必须填写！")
        }

        if (!password) {
            return error(res, "密码必须填写！")
        }
        // 查询用户名是否存在及用户是否为管理员
        const user = await models.User.findOne({where: {username}})
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

        const token = jwt.sign({
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        }, process.env.SECRET, {expiresIn: "7d"})

        success(res, "登录成功", {token})
    } catch (err) {
        error(res, err)
    }
})
module.exports = router;