const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const express = require("express");
const {Op} = require("sequelize");
const router = express.Router();

/**
 * GET /admin/categories
 * 分类列表
 */
router.get('/', async function (req, res, next) {
    try {
        //  模糊搜索
        const where = {}
        // 定义搜索的关键词
        const name = req.query.name
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.Category.findAndCountAll({
            order: [["sort",]],
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