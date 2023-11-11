const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const {where} = require("sequelize");
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
 * GET /admin/courses/:id
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
        const categoryId = await models.Category.findByPk(req.body.categoryId)
        if (!categoryId) {
            error(res, "此分类不存在")
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
        const course = await models.Course.findByPk(req.params.id);
        if (!course) {
            return error(res, "课程不存在")
        }
        //验证分类是否存在
        const category = await models.Category.findByPk(req.body.categoryId)
        if (!category) {
            return error(res, "分类不存在")
        }
        //验证用户是否存在
        const user = await models.User.findByPk(req.body.userId)
        if (!user) {
            return error(res, "所选择的用户不存在")
        }
        course.update(req.body)
        success(res, "修改成功", {course})
    } catch (err) {
        error(res, err)
    }
});

/**
 * DELETE /admin/courses
 * 修改课程
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const course = await models.Course.findByPk(req.params.id);
        if (!course) {
            return error(res, "课程不存在")
        }

        const chapterCount = await models.Chapter.count({
            where: {
                "courseId": id
            }
        })
        if (chapterCount > 0) {
            return error(res, "该课程还有章节无法删除！")
        }
        course.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;
