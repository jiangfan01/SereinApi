const express = require('express');
const qiniu = require("qiniu");
const {success} = require("../utlis/messages");
const router = express.Router();

/**
 * GET /uploadToken
 * 上传图片
 */
router.get('/', function (req, res, next) {
    try {
        const accessKey = process.env.ACCESS_KEY;
        const secretKey = process.env.SECRET_KEY;
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

        // 上传到空间
        const options = {
            scope: process.env.SCOPE
        }
        const putPolicy = new qiniu.rs.PutPolicy(options);

        // 生成上传的token返回
        const uploadToken = putPolicy.uploadToken(mac)
        success(res, "生成token成功", {uploadToken})
    } catch (err) {

    }
});

module.exports = router;
