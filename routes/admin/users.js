const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const {Op} = require("sequelize");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const router = express.Router();
const crypto = require('crypto');
const registeredUsers = [];

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
 * POST /admin/users/email
 * 发送邮件
 */
router.post('/email', async function (req, res, next) {
    try {
        const email = req.body.email;

        // 生成注册验证码
        const verificationCodeData = generateVerificationCodeData();
        // 注册存储信息
        registeredUsers.push({ email, verificationCode: verificationCodeData });

        const sendVerificationEmail = (to, verificationCode) => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.qq.com',
                port: 465,
                secure: true,
                auth: {
                    user: email, // 发送邮件的邮箱
                    pass: "fcowdfflghrdhahi" // QQ 邮箱密码或应用程序密码
                },
            });
            const mailOptions = {
                from: email,
                to,
                subject: '注册码',
                text: `您的注册验证码是：${verificationCode},有效期15分钟，过期作废`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('发送失败！', error);
                } else {
                    console.log('邮箱已发送', info.response);
                }
            });
        }

        sendVerificationEmail(email, verificationCodeData.code);
        success(res, "邮件已发送请查收");
    } catch (err) {
        error(res, err);
    }
});
/*
* 邮箱验证时间
* */
function generateVerificationCodeData() {
    const verificationCode = crypto.randomBytes(4).toString('hex');
    const generatedAt = new Date(); // 记录生成时间
    const expirationMinutes = 15; // 设置有效期为 15 分钟

    return { code: verificationCode, generatedAt, expirationMinutes };
}

/**
 * POST /admin/users/emailLogin
 * 邮箱注册用户
 */
router.post('/emailLogin', async function (req, res, next) {
    try {
        const email = req.body.email
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm
        const emailCode = req.body.emailCode;

        if (registeredUsers.find((user) => user.email === email)) {
            return error(res, "邮箱已注册请直接登录")
        }
        // 查找用户之前存储的验证码
        const userVerificationCode = registeredUsers.find((user) => user.email === email)?.verificationCode;

        // 验证用户提供的验证码是否正确
        if (!userVerificationCode || userVerificationCode !== emailCode) {
            return error(res, "验证码不正确");
        }

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
 * 查看当前用户
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
 * 查看当前用户
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

module.exports = router;