const express = require("express");
const router = express.Router();
const models = require("../models");
const {success, error} = require("../utlis/messages")

/**
 * POST /likes
 * 添加收藏，取消收藏
 */
router.post("/", async function (req, res, next) {
    try {
        const courseId = req.body.courseId
        const userId = req.decoded.user.id
        let message = ""

        //查询要收藏的课程是否存在
        const course = await models.Course.findByPk(courseId)
        if (!course){
            return error(res,"当前课程不存在")
        }

        // 检查课程之前是否收藏过
        const like = await models.Like.findOne({ where: { courseId, userId } })

        // 如果没有收藏过，那就新增。并且课程收藏数量 + 1
        if (!like){
            await models.Like.create({ courseId, userId })
            await course.increment("likesCount")
            message = "收藏成功"
        }else {
            //取消收藏，销毁当前收藏，并且课程收藏数量 - 1
            await like.destroy()
            await course.decrement("likesCount")
            message = "取消收藏成功"
        }


        success(res,message)
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;
