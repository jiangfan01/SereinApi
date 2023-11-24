const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const {Op} = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const router = express.Router();
const crypto = require('crypto');

/**
 * GET /admin/users
 * 用户列表
 */
router.get('/', async function (req, res, next) {
    try {
        const where = {}
        // 模糊查询标题
        const username = req.query.username;

        if (username) {
            where.username = {
                [Op.like]: "%" + username + "%"
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.User.findAndCountAll({
            order: [["id",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            users: result.rows,
            pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                total: result.count
            }
        }
        success(res, "查询成功", data)
    } catch (err) {
        error(res, err)
    }
})

/**
 * POST /admin/users
 * 新增用户
 */
router.post('/', async function (req, res, next) {
    try {
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm
        if (password !== passwordConfirm) {
            return error(res, "两次密码输入不一致")
        }

        //  使用bcryptjs加密密码
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await models.User.create({
            ...req.body,
            password: hash
        })
        success(res, "新增成功", {user})
    } catch (err) {
        error(res, err)
    }
})

/**
 * GET /admin/users/me
 * 查看当前用户
 */
router.get('/me', async function (req, res, next) {
    try {
        const user = await models.User.findByPk(req.decoded.user.id)
        if (!user) {
            return error(res, "用户不存在")
        }
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
})

/**
 * GET /admin/users/:id
 * 查看单条
 */
router.get('/:id', async function (req, res, next) {
    try {
        const user = await models.User.findByPk(req.params.id)
        if (!user) {
            return error(res, "用户不存在")
        }
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
})

/**
 * PUT /admin/users/:id
 * 修改当前用户
 */
router.put('/:id', async function (req, res, next) {
    try {
        const oldPassword = req.body.oldPassword
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm

        if (!oldPassword) {
            return error(res, "请输入原始密码")
        }

        if (!password) {
            return error(res, "请输入新密码")
        }
        if (!passwordConfirm) {
            return error(res, "请输入确认密码")
        }

        if (password !== passwordConfirm) {
            return error(res, "两次密码不一致")
        }

        const user = await models.User.findByPk(req.params.id)
        if (!user) {
            return error(res, "用户不存在,无法修改")
        }

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return error(res, "原始密码错误！")
        }

        //取出加密后的密码
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        await user.update({
            ...req.body,
            password: hash
        })
        success(res, "修改成功", {user})
    } catch (err) {
        error(res, err)
    }
})

/**
 * DELETE /admin/users/:id
 * 删除用户
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const user = await models.User.findByPk(id);
        if (!user) {
            return error(res, "用户不存在不存在")
        }

        await user.destroy()
        success(res, "删除成功",)
    } catch (e) {
        error(res, e.message)
    }
})

module.exports = router;