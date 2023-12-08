# 介绍： 此项目是APP及后台接口项目

#  Node.js + Express + Sequelize + MySQL 

## 项目概述

## 技术栈

- Node.js 18.13
- Express
- Sequelize
- MySQL


## 安装Laragon

- 下载地址
<https://laragon.org/index.html>

- 安装完成后启动所有即可

## 配置yarn及依赖

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

# 监听代码变动
yarn add nodemon

# 安装配置 Sequelize
# 安装Sequelize 及其命令行支持
yarn add sequelize
yarn global add sequelize-cli

# 安装对mysql的支持
yarn add mysql2

# 初始化Sequelize项目结构
sequelize init

```
## 配置数据库

```bash

## 找到 config/config.json，设置正确的项目名称和数据库账号密码

"development": {
    "username": "root", //你的数据库命
    "password": "root", //你的数据库密码
    "database": "blog_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
``` 


## 快速开始

克隆项目：

   ```bash
   git clone https://github.com/jiangfan01/SereinApi.git

 ```

进入项目:

    ```bash
    
    cd SereinApi
    
    ```
