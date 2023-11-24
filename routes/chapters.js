const express = require('express');
const router = express.Router();
const models = require('../models');
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")

/**
 * GET /chapters/:id
 * 单条章节
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const chapter = await models.Chapter.findByPk(req.params.id)
        if (!chapter) {
            return error(res, "文章不存在")
        }

        //  一个课程的所有章节
        const chapters = await models.Chapter.findAll({
            where: {courseId: chapter.courseId},
            order: [["sort", "ASC"], ["id", "DESC"]],
        })

        success(res, "查询成功", {chapter,chapters})
    } catch (err) {
        error(res, err)
    }
})


module.exports = router;
