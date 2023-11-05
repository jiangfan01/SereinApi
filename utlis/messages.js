/*
   成功信息
   * */
const success = (res, message = "", data = {}) => {
    return res.json({
        code: 200,
        message,
        data
    })
}

const error = (res, err = "", code = 500) => {
    let message = []

    // 如果错误是字符串信息，说明是用户直接传递的错误消息过来
    if (typeof err === "string") {
        message.push(err)
    }
    //如果是模型错误
    else if (err.name === "SequelizeValidationError") {
        message = err.errors.map(item => item.message)
    }
    // 如果是其他异常，例如数据库缺少必须字段等
    else message.push(err.message)

    return res.json({
        code,
        message
    })
}

module.exports = {
    success, error
}