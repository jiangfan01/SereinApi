const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const express = require("express");
const {Op} = require("sequelize");
const router = express.Router();

/**
 * GET /admin/chapters
 * 章节列表
 */
router.get('/', async function (req, res, next) {
    try {
        const where = {}

        //查询当前课程对应的章节
        const courseId = req.query.courseId;
        if (courseId) {
            where.courseId = {
                [Op.eq]: courseId
            }
        }

        // 模糊搜索标题
        const title = req.query.title
        if (title) {
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        const content = req.query.content
        if (content) {
            where.content = {
                [Op.like]: `%${content}%`
            }
        }
        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.Chapter.findAndCountAll({
            order: [["sort",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            include: [
                {
                    model: models.Course,
                    as: "course",
                    attributes: ["id", "name"]
                },
            ],
        })

        const data = {
            chapters: result.rows,
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
});

/**
 * GET /admin/chapters/:id
 * 单条章节
 */
router.get('/:id', async function (req, res, next) {
    try {
        const chapter = await models.Chapter.findByPk(req.params.id)
        if (!chapter) {
            error(res, "章节不存在！")
        }
        success(res, "查询成功", {chapter})
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /admin/chapters
 * 新增章节
 */
router.post('/', async function (req, res, next) {
    try {
        const chapter = await models.Chapter.create(req.body)
        success(res, "新增成功", {chapter})
    } catch (err) {
        error(res, err)
    }
});

/**
 * PUT /admin/chapters/:id
 * 修改章节
 */
router.put('/:id', async function (req, res, next) {
    try {
        const chapter = await models.Chapter.findByPk(req.params.id)
        if (!chapter) {
            error(res, "章节不存在")
        }

        await chapter.update(req.body)
        success(res, "修改成功",)
    } catch (err) {
        error(res, err)
    }
});

/**
 * DELETE /admin/chapters/:id
 * 删除章节
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const chapter = await models.Chapter.findByPk(req.params.id)
        if (!chapter) {
            error(res, "章节不存在")
        }

        await chapter.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;