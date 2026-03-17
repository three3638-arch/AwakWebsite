---
name: Local Nginx Setup
overview: 通过 Homebrew 安装 Nginx 并配置为本地静态服务器，将 awak_will 项目发布到 localhost。
todos:
  - id: install-nginx
    content: 通过 brew install nginx 安装 Nginx
    status: completed
  - id: fix-logo-path
    content: 修正 index.html 中 logo_white.png 路径为 image/logo_white.png
    status: completed
  - id: nginx-config
    content: 在 /opt/homebrew/etc/nginx/servers/ 下创建 awak_will.conf 配置文件
    status: completed
  - id: start-verify
    content: 测试配置、启动 Nginx 服务并验证访问
    status: completed
isProject: false
---

# 本地 Nginx 发布 awak_will

## 当前状态

- 项目路径：`/Users/apple/Sites/localhost/awak_will/`
- 纯静态网站：`index.html` + `styles.css` + `script.js` + `image/` 目录
- Homebrew 已安装，Nginx 未安装

## 步骤

### 1. 通过 Homebrew 安装 Nginx

```bash
brew install nginx
```

安装后 Nginx 默认配置目录在 `/opt/homebrew/etc/nginx/`。

### 2. 修正 logo 图片路径

上一步将 logo 改为 `logo_white.png`，但该文件实际位于 `image/logo_white.png`，需要修正 [index.html](index.html) 中的路径：

```html
<img src="image/logo_white.png" alt="Awak Will">
```

### 3. 创建 Nginx 站点配置

在 `/opt/homebrew/etc/nginx/servers/` 目录下创建配置文件 `awak_will.conf`，内容要点：

- 监听端口：`8080`（避免与其他服务冲突，也不需要 sudo）
- `server_name`：`localhost`
- `root`：`/Users/apple/Sites/localhost/awak_will`
- 配置 `index index.html`
- 配置 MIME 类型以正确处理 CSS/JS/图片

### 4. 启动 Nginx 并验证

```bash
nginx -t          # 测试配置是否正确
brew services start nginx   # 启动服务
```

启动后通过浏览器访问 `http://localhost:8080` 即可查看网站。

## 最终访问地址

- `http://localhost:8080`

