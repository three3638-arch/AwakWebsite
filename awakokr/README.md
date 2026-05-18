# AwakOKR

全栈 OKR 子应用：`client/`（React + Vite）+ `server/`（Express + JSON 文件存储）+ `data/`。

与主站集成方式与 `mobile/` 类似：前端挂在 **`/okr/`**，API 挂在 **`/api/`**（需单独运行 Node 服务）。

## 首次安装

```bash
cd awakokr/server && npm install
cd ../client && npm install
```

仓库根目录也需 `npm install`（`concurrently`、`http-proxy` 等）。

## 本地开发

### 仅 OKR（前后端）

```bash
# 仓库根目录
npm run dev:okr
```

- 前端：`http://127.0.0.1:3005/okr/`
- API：`http://127.0.0.1:3001/api/health`

### 与 PC + mobile 一起联调（推荐）

```bash
npm run dev:stack
```

浏览器打开 **`http://127.0.0.1:8080/okr/`**（网关会把 `/api` 转到后端、`/okr` 转到前端）。

初始化管理员（首次）：

```bash
cd awakokr/server && npm run init-admin
```

## 构建

```bash
cd awakokr/client && npm run build
# 或由根目录合并构建：
cd ../.. && npm run build:site
```

产物会进入仓库根 `dist/okr/`。

## 发布

1. **静态前端**：随主站 `npm run deploy` 上传（`dist/okr/` 已合并进 `dist`）。
2. **API 服务**：在服务器上单独部署（见 [`deploy-server.sh`](deploy-server.sh)），并在 Nginx 中保留 `location ^~ /api/` 反代到 `127.0.0.1:3001`（见 [`../nginx/server-fragment.awak.conf`](../nginx/server-fragment.awak.conf)）。

生产环境请设置 `JWT_SECRET`、`CORS_ORIGINS`（含站点 origin）。
