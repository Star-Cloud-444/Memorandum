# Memorandum 前端所需后端接口文档

## 1. 概述

这是一个基于node.js的后端项目,我的数据库连接方式于.env的配置文件和db.js

当前项目前端页面主要包含：
- 登录页（`/pages/login/login`）
- 注册页（`/pages/register/register`）
- 备忘录列表页（`/pages/memo/memo`）
- 备忘录详情/编辑页（`/pages/memo/detail`）

目前备忘录数据仅在本地存储（`src/utils/memoStorage.js`）中读取/写入。为了支持真实后端服务，需要补充以下接口。

---

## 2. 目标接口

接口分为两类：
1. 用户认证接口
2. 备忘录 CRUD 接口

### 2.1 用户认证接口

#### 2.1.1 登录

- 方法：`POST`
- 路径：`/api/auth/login`
- 描述：用户登录，返回访问令牌和用户信息。

请求示例：
```json
{
  "account": "user@example.com",
  "password": "123456",
  "rememberMe": true
}
```

响应示例：
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "xxx.xxx.xxx",
    "user": {
      "id": "user_123",
      "account": "user@example.com",
      "nickname": "Memorandum 用户"
    }
  }
}
```

可能返回：
- `400` 参数校验错误
- `401` 账号或密码错误

#### 2.1.2 注册

- 方法：`POST`
- 路径：`/api/auth/register`
- 描述：用户注册。

请求示例：
```json
{
  "account": "user@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

响应示例：
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": "user_123"
  }
}
```

可能返回：
- `400` 参数不完整或密码不一致
- `409` 账号已存在

#### 2.1.3 获取当前用户

- 方法：`GET`
- 路径：`/api/auth/me`
- 描述：获取当前登录用户信息。
- 认证：需要携带 `Authorization: Bearer <token>`

响应示例：
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "user_123",
    "account": "user@example.com",
    "nickname": "Memorandum 用户"
  }
}
```

#### 2.1.4 登出（可选）

- 方法：`POST`
- 路径：`/api/auth/logout`
- 描述：登出并使当前令牌失效。
- 认证：需要携带 `Authorization`。

响应示例：
```json
{
  "code": 0,
  "message": "已登出"
}
```

---

### 2.2 备忘录 CRUD 接口

前端备忘录页面使用的数据结构如下（来自 `memo.vue` 和 `detail.vue`）：
- `id`：笔记唯一 ID
- `title`：标题
- `content`：内容
- `createdAt`：创建时间戳
- `dateLabel`：日期显示文本（前端当前直接格式化）

建议后端模型包含：
```json
{
  "id": "memo_123",
  "title": "买菜清单",
  "content": "牛奶、鸡蛋、面包",
  "createdAt": 1690000000000,
  "updatedAt": 1690000001000
}
```

#### 2.2.1 获取备忘录列表

- 方法：`GET`
- 路径：`/api/memos`
- 描述：返回当前用户的备忘录列表。
- 认证：`Authorization: Bearer <token>`

响应示例：
```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "memo_001",
      "title": "会议纪要",
      "content": "周一 10 点部门会议",
      "createdAt": 1690000000000,
      "updatedAt": 1690000000000
    },
    {
      "id": "memo_002",
      "title": "购物清单",
      "content": "苹果、牛奶、面包",
      "createdAt": 1690001000000,
      "updatedAt": 1690001000000
    }
  ]
}
```

备注：
- 前端当前直接读取本地缓存数据并展示。
- 后端返回时可附带 `dateLabel`，也可由前端根据 `createdAt` 计算。

#### 2.2.2 获取单条备忘录

- 方法：`GET`
- 路径：`/api/memos/{id}`
- 描述：获取单条备忘录详情。
- 认证：`Authorization`

响应示例：
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "memo_001",
    "title": "会议纪要",
    "content": "周一 10 点部门会议",
    "createdAt": 1690000000000,
    "updatedAt": 1690000000000
  }
}
```

可能返回：
- `404` 笔记不存在

#### 2.2.3 创建备忘录

- 方法：`POST`
- 路径：`/api/memos`
- 描述：创建一条新笔记。
- 认证：`Authorization`

请求示例：
```json
{
  "title": "新笔记",
  "content": "这里是笔记内容"
}
```

响应示例：
```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "id": "memo_003",
    "title": "新笔记",
    "content": "这里是笔记内容",
    "createdAt": 1690002000000,
    "updatedAt": 1690002000000
  }
}
```

可能返回：
- `400` 标题为空或参数不合法

#### 2.2.4 更新备忘录

- 方法：`PUT`
- 路径：`/api/memos/{id}`
- 描述：更新笔记标题和内容。
- 认证：`Authorization`

请求示例：
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

响应示例：
```json
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": "memo_001",
    "title": "更新后的标题",
    "content": "更新后的内容",
    "createdAt": 1690000000000,
    "updatedAt": 1690003000000
  }
}
```

可能返回：
- `400` 参数不合法
- `404` 笔记不存在

#### 2.2.5 删除备忘录

- 方法：`DELETE`
- 路径：`/api/memos/{id}`
- 描述：删除指定备忘录。
- 认证：`Authorization`

响应示例：
```json
{
  "code": 0,
  "message": "删除成功"
}
```

可能返回：
- `404` 笔记不存在

---

## 3. 接口补充建议

- 所有备忘录接口都应基于当前登录用户，避免跨用户访问。
- `rememberMe` 选项可在登录接口层面保留，决定 token 的有效期策略。
- 后端返回 `createdAt` / `updatedAt` 后，前端可继续按当前逻辑生成 `dateLabel`。
- 登录与注册页面目前属于演示逻辑，若接入后端，需要将 `onSubmit` 中的 `setTimeout` 替换为真实请求。

## 4. 前端改造建议

- 将当前 `src/utils/memoStorage.js` 抽象为 HTTP 请求层：
  - `loadMemos()` 替换为 `GET /api/memos`
  - `saveMemos(...)` 替换为 `POST /api/memos` / `PUT /api/memos/{id}` / `DELETE /api/memos/{id}`
- 登录、注册页面增加请求逻辑，并保存 `token` 到本地存储或 Cookie。
- 备忘录页面应在页面展示时刷新列表，并在保存/删除成功后重新获取或更新缓存。

---

## 5. 接口列表汇总

| 功能 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 登录 | POST | `/api/auth/login` | 用户登录 |
| 注册 | POST | `/api/auth/register` | 用户注册 |
| 当前用户 | GET | `/api/auth/me` | 获取登录用户信息 |
| 登出 | POST | `/api/auth/logout` | 退出登录 |
| 获取笔记列表 | GET | `/api/memos` | 获取当前用户的备忘录 |
| 获取笔记详情 | GET | `/api/memos/{id}` | 获取单条备忘录 |
| 创建笔记 | POST | `/api/memos` | 新建笔记 |
| 更新笔记 | PUT | `/api/memos/{id}` | 编辑笔记 |
| 删除笔记 | DELETE | `/api/memos/{id}` | 删除笔记 |
