# SMS-Web

这是基于 `SendSms`（Vue 3 + Vite + Vant）的短信转发器 Web 控制端。

## 部署到 Cloudflare（推荐：Pages）

Cloudflare 控制台 → Pages → Create a project → 选择仓库 `Xiuyixx/SMS-Web`，然后填写：

- Build command：`npm ci && npm run build`
- Build output directory：`dist`

可选环境变量：

- `NODE_VERSION=22`（或 20+）

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
