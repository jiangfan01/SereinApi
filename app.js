const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();


// 后台路由
const adminArticlesRouter = require("./routes/admin/articles")
const adminCoursesRouter = require("./routes/admin/courses")
const adminCategoryRouter = require("./routes/admin/categories")
const adminChapterRouter = require("./routes/admin/chapters")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 后台
app.use("/admin/articles", adminArticlesRouter)
app.use("/admin/courses", adminCoursesRouter)
app.use("/admin/categories", adminCategoryRouter)
app.use("/admin/chapters", adminChapterRouter)

module.exports = app;
