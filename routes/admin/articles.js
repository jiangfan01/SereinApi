const express = require('express');
const {error, success} = require("../../utlis/messages");
const models = require("../../models")
const router = express.Router();


/**
 * GET /admin/articles
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {
        const articles = await models.Article.findAll({
            order: ['id']
        })
        success(res, "查询成功", {articles})
    } catch (err) {
        error(res, err)
    }
});

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
        if (!article){
            return error(res, "文章不存在")
        }
        article.update(req.body)
        success(res,"修改成功",)
    }catch (err) {
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
        if (!article){
            return error(res, "文章不存在")
        }
        article.destroy()
        success(res,"删除成功",)
    }catch (err) {
        error(res, err)
    }

})


module.exports = router;
