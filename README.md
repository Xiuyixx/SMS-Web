# SMS-Web

短信转发器 Web 控制端（Vue 3 + Vite + Vant）。

## 部署到 Cloudflare Pages（推荐）

Cloudflare 控制台 → Pages → Create a project → 选择仓库 `Xiuyixx/SMS-Web`，然后填写：

- Build command：`npm ci && npm run build`
- Build output directory：`dist`

可选环境变量：

- `NODE_VERSION=22`（或 20+）

## 部署/使用注意事项（很重要）

### 1) 服务端地址必须带协议

在页面里填写“服务器地址 / 服务端地址”时，请写完整 URL，例如：

- `http://192.168.1.222:5000`
- `https://example.com:5000`

不要只写 `192.168.1.222:5000`（不带 `http://`/`https://` 会被浏览器当成站内相对路径，导致 404）。

### 2) HTTPS 页面请求 HTTP 服务端会被浏览器拦截

Cloudflare Pages 默认是 HTTPS。

如果你的短信转发器服务端是 `http://192.168.x.x:5000` 这种 **HTTP** 地址，浏览器通常会因为 **Mixed Content** 直接拦截请求（表现为请求失败或控制台报错），即使服务端本身已启动。

解决方式任选其一：

- 给服务端加 HTTPS（例如 Nginx/Caddy 反代出 `https://`）
- 用 Cloudflare Tunnel/反代把服务端暴露成 HTTPS 域名

### 3) CORS

Web 端会直接请求你的服务端接口，服务端需要允许跨域（CORS），否则浏览器会拦截请求。

### 4) 路由模式

本项目使用 Hash 路由（URL 带 `#`），一般不需要额外配置 Pages 的 SPA 重写规则。

## 本地开发

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm ci
npm run build
```
