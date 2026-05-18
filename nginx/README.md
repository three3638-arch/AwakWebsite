# Nginx：PC 根路径 + `/m/` 移动站

## `http { }` 段

将 [`http-maps.awak.conf`](http-maps.awak.conf) 整文件内容粘贴或 `include` 进 `http { }`（不要放进单个 `server` 里）。

## `server { }` 段（静态站点）

1. 设置 `root` 为部署目录（含 PC 的 `index.html`、`assets/`，以及目录 `m/` 内移动站产物）。
2. `include` [`server-fragment.awak.conf`](server-fragment.awak.conf)，或复制其中指令。

合并后的目录示例：

- `/var/www/website/index.html`
- `/var/www/website/assets/…`
- `/var/www/website/m/index.html`
- `/var/www/website/m/assets/…`
- `/var/www/website/okr/index.html`（AwakOKR 前端）
- Node 进程 `127.0.0.1:3001` 提供 `/api/*`（见 `server-fragment.awak.conf`）

## 行为摘要

- 命中「手机」UA 且路径不是 `/m/...`、且 Cookie **`prefer_desktop=1`** 未设置时：**302** 到 `/m` + 原 `$request_uri`。
- iPad / 含 `tablet` 的 UA 视为非手机，不跳转。
- `/m/` 使用 SPA fallback：`try_files ... /m/index.html`。

本地双端联调默认使用仓库 [`dev/README.md`](../dev/README.md) 中的 **Node 网关**（`npm run dev:stack`）；可选 `npm run dev:stack:docker` 使用 Docker Nginx。
