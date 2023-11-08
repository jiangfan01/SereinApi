const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const express = require("express");
const router = express.Router();

/**
 * GET /admin/chapters
 * 章节列表
 */
router.get('/', async function (req, res, next) {
    try {
        const chapters = await models.Chapter.findAll({
            order: [['sort'],['id']]
        })
        success(res, "查询成功", {chapters})
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

        chapter.update(req.body)
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

        chapter.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;