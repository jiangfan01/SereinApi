const express = require('express');
const router = express.Router();
const models = require('../models');
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")

/**
 * GET /categories
 * 分类列表
 */
router.get('/', async function (req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await models.Category.findAndCountAll({
            order: [["sort", "ASC"], ["id", "DESC"]],
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        });

        success(res, "查询成功", {
            categories: result.rows,
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

module.exports = router;
