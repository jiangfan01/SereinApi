const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const {Op} = require("sequelize");
const router = express.Router();

/**
 * GET /admin/articles
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {
        //  模糊搜索
        const where = {}
        // 定义搜索的关键词
        const title = req.query.title
        if (title) {
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        // 定义搜索的关键词
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
        const result = await models.Article.findAndCountAll({
            order: ["id"],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            articles: result.rows,
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
 * GET /admin/article/:id
 * 单条文章
 */
router.get('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id)
        if (!article) {
            return error(res, "文章不存在")
        }
        success(res, "查询成功", {article})
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /admin/articles
 * 新增文章
 */
router.post('/', async function (req, res, next) {
    try {
        const article = await models.Article.create(req.body);
        if (!article) {
            return error(res, "文章不存在")
        }
        success(res, "新增成功", {article})
    } catch (err) {
        error(res, err)
    }
});

/**
 * PUT /admin/articles/:id
 * 修改文章
 */
router.put('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id);
        if (!article) {
            return error(res, "文章不存在")
        }
        article.update(req.body)
        success(res, "修改成功",)
    } catch (err) {
        error(res, err)
    }

})

/**
 * DELETE /admin/articles/:id
 * 删除
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id);
        if (!article) {
            return error(res, "文章不存在")
        }
        await article.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }
})


module.exports = router;
