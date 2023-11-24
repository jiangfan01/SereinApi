const express = require('express');
const router = express.Router();
const models = require('../models');
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")

/**
 * GET /courses
 * 课程列表
 */
router.get('/', async function (req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const where = {};

        // 模糊查询名称
        const name = req.query.name;
        if (name) {
            where.name = {
                [Op.like]: "%" + name + "%"
            }
        }
        // 筛选分类
        const categoryId = req.query.categoryId;
        if (categoryId) {
            where.categoryId = {
                [Op.eq]: categoryId
            }
        }

        const result = await models.Course.findAndCountAll({
            order: [["id", "DESC"]],
            where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        });

        success(res, "查询成功", {
            courses: result.rows,
            pagination: {
                currentPage,
                pageSize,
                total: result.count
            }
        })
    } catch (err) {
        error(res, err)
    }
})

/**
 * GET /courses/:id
 * 单条课程
 */
router.get('/:id', async function (req, res, next) {
    try {

        const course = await models.Course.findOne({
            where: {id: req.params.id},
            include: [
                {
                    model: models.Chapter,
                    as: "chapters",
                },
                {
                    model: models.User,
                    as: "user",
                }
            ],

        })

        success(res, "查询成功", {course})
    } catch (e) {
        error(res, e.message)
    }
})

module.exports = router;
