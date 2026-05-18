# 本地单入口：`/` + `/m/` + `/okr/` + `/api/` + UA 跳转

## 前置

- 仓库根目录、`mobile/`、`awakokr/client`、`awakokr/server` 均已执行过 `npm install`（根目录会安装 `http-proxy`，供本地网关使用）。

## 命令（默认：无需 Docker）

在**仓库根目录**执行：

```bash
npm run dev:stack
```

该脚本会并行启动：

- PC Vite：`http://127.0.0.1:3003`
- Mobile Vite：`http://127.0.0.1:3004`（`base` 为 `/m/`）
- AwakOKR API：`:3001`，前端 Vite：`:3005`（`base` 为 `/okr/`）
- **Node 网关 [`stack-proxy.cjs`](stack-proxy.cjs)**：对外 **`http://127.0.0.1:8080`**（UA 跳转 + 反代 + **Vite HMR WebSocket**）

日常只需在浏览器打开 **`http://127.0.0.1:8080`**；OKR 入口：**`http://127.0.0.1:8080/okr/`**。

若拉不动 Docker 镜像（例如访问 Docker Hub EOF），**不影响**上述流程；默认已不再依赖 Docker。

### 可选：仍使用 Docker + Nginx（与生产配置更接近）

在你本机能正常 `docker pull nginx:alpine` 时可用：

```bash
npm run dev:stack:docker
```

## 用 Chrome 测 UA 跳转

仅缩小视口**不会**改变 `User-Agent`。请打开开发者工具 → **More tools → Network conditions**，取消 **Use browser default**，选择手机 UA；访问 `/zh` 应 **302** 到 `/m/zh`。设置 Cookie **`prefer_desktop=1`** 后应不再跳转。iPad UA 应留在 PC 根站。

## 合并构建预览（无 HMR）

```bash
npm run build:site
npm run preview
```

在预览服务器打开 `/` 与 `/m/zh` 验证静态产物（需在 preview 根目录正确映射 `/m/`，复杂场景优先用 `vite preview` 分别预览根目录与 `mobile`，或使用本地 Nginx `root` 指向合并后的 `dist`）。

AwakOKR 静态页在 `/okr/`，但 **`/api` 仍需单独启动后端**（`npm run dev --prefix awakokr/server` 或生产 systemd）。详见 [`../awakokr/README.md`](../awakokr/README.md)。
