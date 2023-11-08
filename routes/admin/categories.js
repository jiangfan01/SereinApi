const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const express = require("express");
const router = express.Router();

/**
 * GET /admin/categories
 * 分类列表
 */
router.get('/', async function (req, res, next) {
    try {
        const categories = await models.Category.findAll({
            order: [['sort'],['id']]
        })
        success(res, "查询成功", {categories})
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /admin/categories/:id
 * 单条分类
 */
router.get('/:id', async function (req, res, next) {
    try {
        const category = await models.Category.findByPk(req.params.id)
        if (!category) {
            error(res, "分类不存在！")
        }
        success(res, "查询成功", {category})
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /admin/categories
 * 新增分类
 */
router.post('/', async function (req, res, next) {
    try {
        const category = await models.Category.create(req.body)
        success(res, "新增成功", {category})
    } catch (err) {
        error(res, err)
    }
});

/**
 * PUT /admin/categories/:id
 * 修改分类
 */
router.put('/:id', async function (req, res, next) {
    try {
        const category = await models.Category.findByPk(req.params.id)
        if (!category) {
            error(res, "分类不存在")
        }

        category.update(req.body)
        success(res, "修改成功",)
    } catch (err) {
        error(res, err)
    }
});

/**
 * DELETE /admin/categories/:id
 * 删除分类
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const category = await models.Category.findByPk(req.params.id)
        if (!category) {
            error(res, "分类不存在")
        }

        category.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;