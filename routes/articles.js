const express = require('express');
const router = express.Router();
const models = require('../models');
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")

/**
 * GET /articles
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {

        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const result = await models.Article.findAndCountAll({
            order: [["id", "DESC"]],
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        });

        success(res, "查询成功", {
            articles: result.rows,
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
 * GET /articles/:id
 * 单条文章
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const article = await models.Article.findByPk(req.params.id)
        if (!article) {
            return error(res, "文章不存在")
        }
        success(res, "查询成功", {article})
    } catch (err) {
        error(res, err)
    }
})

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

})

/**
 * PUT /admin/articles
 * 修改文章
 */
router.put('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id);
        const title = req.body.title
        const content = req.body.content
        if (!article) {
            return error(res, "文章不存在")
        }
        article.update(req.body)
        success(res, "修改成功", article)
    } catch (err) {
        error(res, err)
    }
})

/**
 * DELETE /admin/articles/:id
 * 删除文章
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id);
        if (!article) {
            return error(res, "文章不存在")
        }
        article.destroy()
        success(res, "删除成功",)
    } catch (err) {
        error(res, err)
    }

})

module.exports = router;
