const express = require("express");
const router = express.Router();
const models = require("../models");
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")

/* GET home page. */
router.get('/', async function (req, res, next) {
    try {
        //轮播图（推荐课程）
        const recommendedCourses = await models.Course.findAll({
            where: {recommended: true},
            order: [["id", "desc"]],
            limit: 6
        })

        // 课程日历（按日期倒序）
        const calendarCourses = await models.Course.findAll({
            order: [["id", "desc"]],
            limit: 6
        })

        // 人气课程
        const likesCourses = await models.Course.findAll({
            order: [["LikesCount", "desc"], ["id", "desc"]],
            limit: 6
        })

        // 入门课程
        const introductoryCourses = await models.Course.findAll({
            where: {introductory: true},
            order: [["id", "desc"]],
            limit: 6
        })

        success(res, "查询成功", {
            recommendedCourses,
            calendarCourses,
            likesCourses,
            introductoryCourses
        })
    } catch (e) {

    }

});

module.exports = router;
