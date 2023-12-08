# 介绍： 此项目是APP及后台接口项目

# Node.js + Express + Sequelize + MySQL 示例

## 项目概述

该项目演示了如何使用 Node.js、Express、Sequelize 和 MySQL 构建一个简单的Web应用。项目包括用户管理和基本的数据库操作。

## 技术栈

- Node.js 18.13
- Express
- Sequelize
- MySQL

## 项目结构

project-root/
│
├── models/
│ └── user.js
│
├── routes/
│ └── users.js
│
├── config/
│ └── database.js
│
├── app.js
└── package.json

## 安装依赖

```bash
推荐使用 yarn 代替 npm，如果还没有安装，可以现在安装并配置好中国镜像
npm i -g yarn

yarn config set registry https://registry.npmmirror.com/ -g
yarn config set disturl https://npmmirror.com/package/dist -g
yarn config set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass --global

## 安装依赖

# 安装 express-generator
yarn global add  express-generator

# 创建名为demo的项目
express --no-view demo

# 进入项目目录
cd demo

# 安装依赖包
yarn

#监听代码变动
yarn add nodemon
