# Memorandum API

快速说明：本项目使用 MySQL，数据库连接由 `config/db.js` 使用环境变量配置。

必需环境变量（放在 `.env`）：

- `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`
- `JWT_SECRET`（可选，默认 'changeme'）
- `PORT`（可选，默认 3000）

建表示例 SQL：

```sql
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  account VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  created_at BIGINT
);

CREATE TABLE memos (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at BIGINT,
  updated_at BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

运行：

1. 安装依赖：

```bash
npm install
```

2. 启动服务：

```bash
npm run start
```

Docker 运行：

```bash
docker compose up --build
```

默认服务会绑定到 `http://localhost:3000`，MySQL 会在 `mysql` 服务内部运行，并将宿主机端口映射为 `3307:3306`。

如果你需要直接从宿主机访问 MySQL，请使用 `localhost:3307`。

数据库建表脚本：

```bash
# 进入 api 服务目录后执行
mysql -u root -psecret memorandum < create_tables.sql
```

如果你在 Windows 上用 Docker Desktop，也可以先进入 MySQL 容器：

```bash
docker compose exec mysql bash
mysql -u root -psecret memorandum < /usr/src/app/create_tables.sql
```

接口实现基于文档：`/api/auth/*` 与 `/api/memos/*`。登录返回 `token`，请在请求头 `Authorization: Bearer <token>` 中带上。
