const {success, error} = require("../utlis/messages")
const jwt = require("jsonwebtoken");

module.exports = (options) => {
    return function (req, res, next) {

        return next()

        // 检查token是否存在
        const token = req.headers.token
        if (!token) {
            return error(res, "此接口必须认证才能访问！", 501)
        }

        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return error(res, "认证已过期，重新登录", 502)
                    }
                    if (err.name === "JsonWebTokenError") {
                        return error(res, "认证错误请重试！", 503)
                    }
                }
                // 验证是否为管理员
                if (!decoded.user.isAdmin) {
                    return error(res, "非法登录，当前用户不是管理员！", 504)
                }
            }
            // 如果都成功，将 Token 解析出来的数据存入req。
            // 其他地方可以通过 req.decoded.user.id 获取当前登录用户 id
            req.decoded = decoded
        })
    }
}