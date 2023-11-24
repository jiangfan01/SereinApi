const express = require("express");
const router = express.Router();
const models = require("../models");
const {success, error} = require("../utlis/messages")

/**
 * POST /histories
 * 浏览历史记录
 */
router.post("/", async function (req, res, next) {
    try {
        const courseId = req.body.courseId;
        const chapterId = req.body.chapterId;
        const userId = req.decoded.user.id;

        const course = await models.Course.findByPk(courseId);
        if (!course) {
            return error(res, "当前课程不存在");
        }

        const chapter = await models.Chapter.findByPk(chapterId);
        if (!chapter) {
            return error(res, "当前教程不存在");
        }

        // 检查课程之前是否记录
        const history = await models.History.findOne({ where: { courseId, chapterId } });

        // 如果没有记录，那就新增
        if (!history) {
            await models.History.create({ courseId, chapterId, userId });
        } else {
            // 如果有记录，就更新章节id
            await history.update({ chapterId });
        }

        success(res, "记录成功");
    } catch (err) {
        return error(res, err);
    }
});



module.exports = router;
