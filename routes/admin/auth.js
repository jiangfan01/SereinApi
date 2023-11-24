const {error, success} = require("../../utlis/messages");
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const models = require('../../models');
const bcrypt = require("bcryptjs")
const {Op} = require("sequelize");
const registeredUsers = [];
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

/**
 * POST /admin/auth/email
 * 发送邮件
 */
router.post('/email', async function (req, res, next) {
    try {
        const email = req.body.email;
        if (!email) {
            return error(res, "请填写邮箱！ ");
        }

        // 设置验证码的有效期（单位：分钟）
        const expirationMinutes = 100; // 将过期时间设置为30分钟，或您希望的任何值

        // 生成注册验证码
        const verificationCodeData = generateVerificationCodeData(expirationMinutes);
        registeredUsers.push({ email, verificationCode: verificationCodeData.code });

        // 验证码是否已过期
        const isCodeExpired = new Date() - verificationCodeData.generatedAt > expirationMinutes * 60 * 1000;
        if (isCodeExpired) {
            return error(res, "验证码已过期");
        }

        function generateVerificationCodeData(expirationMinutes) {
            const verificationCode = crypto.randomBytes(4).toString('hex');
            const generatedAt = new Date(); // 记录生成时间

            return { code: verificationCode, generatedAt, expirationMinutes };
        }

        // 发送邮件
        const sendVerificationEmail = (to, verificationCode) => {
            const transporter = nodemailer.createTransport({
                host: 'smtp.163.com',
                port: 465,
                secure: true,
                auth: {
                    user: "m13647228144@163.com", // 你的有效邮箱地址
                    pass: 'EMZNCIEFHVXGEINE' // QQ 邮箱密码或应用程序密码
                },
            });
            const mailOptions = {
                from: "m13647228144@163.com",
                to: email,
                subject: '注册码',
                text: `您的注册验证码是：${verificationCode},有效期${expirationMinutes}分钟，过期作废`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('发送失败！', error);
                    error(res, "邮件发送失败");
                } else {
                    console.log('邮箱已发送', info.response);
                    success(res, "邮件已发送请查收");
                }
            });
        }

        sendVerificationEmail(email, verificationCodeData.code);
    } catch (err) {
        error(res, err);
    }
});

/**
 * POST /admin/auth/emailLogin
 * 邮箱注册用户
 */
router.post('/emailLogin', async function (req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const emailCode = req.body.emailCode;
        const username = req.body.username

        // 查询数据库，检查邮箱是否已经存在
        const existingUser = await models.User.findOne({where: {email}});

        // 如果用户已存在，返回相应错误信息
        if (existingUser) {
            return error(res, "邮箱已注册，请直接登录");
        }

        const userVerificationCode = registeredUsers.find((user) => user.email === email)?.verificationCode;

        if (!userVerificationCode || userVerificationCode.trim() !== emailCode.trim()) {
            return error(res, "验证码不正确");
        }

        // 使用 bcrypt 对密码进行哈希处理
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // 创建用户
        const user = await models.User.create({
            email: email,
            password: hash,
            username: username
        });

        success(res, "注册成功", {user});
    } catch (err) {
        error(res, err);
    }
});

module.exports = router;