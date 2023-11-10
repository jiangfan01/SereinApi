const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const moment = require("moment");
const {Op} = require("sequelize");
const router = express.Router();

/**
 * GET /admin/articles
 * 文章统计
 */
router.get('/articles', async function (req, res, next) {
    try {
        // 选择中国时区
        moment.locale("zh-ch")
        const months = []
        const counts = []


        for (let i = 0; i < 12; i++) {
            // 月份格式化,subtract减去每个月
            const month = moment().subtract(i, "months").format("YYYY-MM")
            months.unshift(month)

            // 对应月份的文章数量
            const startTime = moment().subtract(i, "months").startOf("months").format("YYYY-MM-D") + " 00:00:00"
            const endTime = moment().subtract(i, "months").endOf("months").format("YYYY-MM-D") + " 23:59:59"
            const count = await models.Article.count({
                where: {
                    "createdAt": {
                        [Op.between]: [startTime, endTime]
                    }
                }
            })
            counts.unshift(count)
        }
        success(res, "查询成功", {months, counts})
    } catch (err) {
        error(res, err)
    }
})

/**
 * GET /charts/courses
 * 统计课程
 */
router.get("/courses", async function (req, res, next) {
    moment.locale("zh-cn");
    const months = []
    const counts = []

    for (let i = 0; i < 12; i++) {
        // 往前推入12个月
        const month = moment().subtract(i, "months").format("YYYY-MM")
        months.unshift(month)

        // 对应月份的文章数量
        const startTime = moment().subtract(i, "months").startOf("months").format("YYYY-MM-D") + " 00:00:00"
        const endTime = moment().subtract(i, "months").endOf("months").format("YYYY-MM-D") + " 23:59:59"
        const count = await models.Course.count({
            where: {
                "createdAt": {
                    [Op.between]: [startTime, endTime]
                }
            }
        })
        counts.unshift(count)
    }

    success(res, "查询成功", {months, counts})
});

/**
 * GET /charts/users
 * 用户数量统计
 */
router.get("/users", async function (req, res, next) {
    moment.locale("zh-cn");
    const months = []
    const counts = []

    for (let i = 0; i < 12; i++) {
        const month = moment().subtract(i, "months").format("YYYY-MM")
        months.unshift(month)

        const startTime = moment().subtract(i, "months").startOf("months").format("YYYY-MM-D") + " 00:00:00"
        const endTime = moment().subtract(i, "months").endOf("months").format("YYYY-MM-D") + " 23:59:59"
        const count = await models.User.count({
            where: {
                "createdAt": {
                    [Op.between]: [startTime, endTime]
                }
            }
        })
        counts.unshift(count)
    }

    success(res, "查询成功", {months, counts})
});


/**
 * GET /charts/sexes
 * 性别统计
 */
router.get('/sexes', async function (req, res, next) {
    const counts = []
    const man = await models.User.count({
        where: {
            sex: {
                [Op.eq]: 1
            }
        }
    })
    const women = await models.User.count({
        where: {
            sex: {
                [Op.eq]: 0
            }
        }
    })
    counts.push(
        {
            value: man,
            name: "男性"
        },
        {
            value: women,
            name: "女性"
        }
    )
    success(res, "查询成功", {counts})
});

module.exports = router;