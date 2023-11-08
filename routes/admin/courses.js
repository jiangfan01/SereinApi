const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const router = express.Router();

/**
 * GET /admin/courses
 * 课程列表
 */
router.get('/', async function (req, res, next) {
    try {
        const courses = await models.Course.findAll({
            order: ['id']
        })
        success(res, "查询成功", {courses})
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /admin/courses
 * 单条课程
 */
router.get('/:id', async function (req, res, next) {
    try {
        const course = await models.Course.findByPk(req.params.id)
        if (!course) {
            error(res, "课程不存在")
        }
        success(res, "查询成功", {course})
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /admin/courses
 * 新增课程
 */
router.post('/', async function (req, res, next) {
    try {
        // 验证分类是否存在
        const categoryId = await models.Coategory.findByPk(req.body.categoryId)
        if (!categoryId) {
            error(res, "分类不存在")
        }

        // 验证用户是否存在
        const userId = await models.User.findByPk(req.body.userId)
        if (!userId) {
            error(res, "此用户不存在")
        }

        const course = await models.Course.create(req.body)
        success(res, "新增成功", {course})
    } catch (err) {
        error(res, err)
    }
});

/**
 * PUT /admin/courses
 * 修改课程
 */
router.put('/:id', async function (req, res, next) {
    try {
        const course = await models.Course.findByPk(req.params.id)
        if (!course) {
            error(res, "课程不存在")
        }
        success(res, "新增成功", {course})
    } catch (err) {
        error(res, err)
    }
});


module.exports = router;
