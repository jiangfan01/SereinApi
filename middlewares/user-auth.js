const { success, error } = require("../utlis/messages")
const jwt = require("jsonwebtoken");

module.exports = function (options){
    return function (req,res,next){
        // 判断token是否存在
        const token = req.headers.token
        if (!token){
            return error(res,"当前接口需要登录才能访问",501)
        }

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                if (err){
                    //验证错误的名字是否为token已过期
                    if (err.name === "TokenExpiredError"){
                        return error(res,"token已过期，请重新登录",502)
                    }
                    //验证token是否正确
                    if (err.name === "JsonWebTokenError") {
                        return error(res, "token 错误，请重新登录！", 503)
                    }
                }

            }
            // 如果都成功，将 Token 解析出来的数据存入req。
            // 其他地方可以通过 req.decoded.user.id 获取当前登录用户 id
            req.decoded = decoded
            next()
        });

    }
}
