# Memorandum API

Memorandum API 是一个基于 Node.js 的后端服务项目，主要用于为备忘录应用提供用户认证和备忘录数据管理能力。它负责处理用户注册、登录、身份验证，以及备忘录的增删改查等操作。

## 项目用途

这个项目的目标是为前端备忘录应用提供稳定的接口支持，让用户可以：

- 注册并登录账户
- 创建、查看、编辑和删除备忘录
- 通过 JWT 令牌实现安全认证
- 将数据持久化保存到 MySQL 数据库中

## 技术栈

本项目主要使用以下技术：

- Node.js：后端运行环境
- Express：Web 服务框架
- MySQL：数据存储
- JWT：用户身份认证
- bcryptjs：密码加密
- dotenv：环境变量管理
- CORS：跨域访问支持
- Docker / Docker Compose：容器化部署与数据库运行

## 项目结构

```text
.
├── config/          # 数据库配置
├── controllers/     # 控制器逻辑
├── middleware/      # 中间件，例如认证校验
├── routes/          # 路由定义
├── create_tables.sql # 数据库建表脚本
├── docker-compose.yml # Docker 服务编排
├── Dockerfile       # Docker 镜像构建文件
├── index.js         # 服务入口
├── package.json     # 项目依赖与脚本
```

## 环境变量配置

在项目根目录创建 `.env` 文件，内容如下：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=memorandum
JWT_SECRET=your_secret_key
PORT=3000
```

说明：

- `DB_*` 用于连接 MySQL 数据库
- `JWT_SECRET` 用于签发和校验 JWT Token
- `PORT` 为服务监听端口，默认是 3000

## 数据库准备

项目提供了建表脚本 [create_tables.sql](create_tables.sql)。

如果你使用本地 MySQL，可以执行：

```bash
mysql -u root -p < create_tables.sql
```

如果使用 Docker，可以通过以下方式启动数据库并初始化：

```bash
docker compose up --build
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务

```bash
npm run dev
```

### 3. 生产环境启动

```bash
npm run start
```

启动后默认访问地址为：

```text
http://localhost:3000
```

## 接口说明

### 用户认证接口

- `POST /api/auth/register`：注册账号
- `POST /api/auth/login`：登录并获取 Token
- `GET /api/auth/me`：获取当前登录用户信息
- `POST /api/auth/logout`：退出登录

### 备忘录接口

- `GET /api/memos`：获取当前用户的备忘录列表
- `GET /api/memos/:id`：获取单条备忘录详情
- `POST /api/memos`：创建备忘录
- `PUT /api/memos/:id`：更新备忘录
- `DELETE /api/memos/:id`：删除备忘录

访问需要认证的接口时，请在请求头中携带：

```http
Authorization: Bearer <token>
```

## Docker 使用说明

项目已提供 Docker 配置，适合快速部署开发环境：

```bash
docker compose up --build
```

默认情况下，MySQL 会映射到宿主机的 `3307` 端口，可通过以下方式访问：

```text
localhost:3307
```

## 说明

这是一个轻量级、易于扩展的后端接口项目，适合用于学习 Node.js + Express + MySQL 的后端开发流程，也可以直接作为备忘录前端应用的数据服务接口。
