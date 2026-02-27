# SMS-Web

这是 `smsForwardClientWeb` 的 **纯 Web 版**（Vue2 + Vue CLI），用于**直接部署到 Cloudflare Pages**。

本项目的图片资源（如 `logo.png`、`sms.png`）已放在仓库的 `src/assets/` 中，构建后会随静态文件一起发布，不需要走外链，也不会触发图片防盗链。

## 1. 部署到 Cloudflare Pages（中文步骤）

1) 打开 Cloudflare 控制台 → **Pages** → **Create a project**
2) 连接 GitHub，选择仓库：`Xiuyixx/SMS-Web`
3) 构建配置填写：

- **Framework preset**：Vue
- **Build command**：`npm ci && npm run build`
- **Build output directory**：`docs`

4) （推荐）环境变量：

- `NODE_VERSION`：`22`（或 20+ 都可以）

5) 点击 Deploy，等待首次构建完成即可访问。

说明：构建产物在 `docs/`，这是一个纯静态站点，Pages 会自动托管。

## 2. 图片与防盗链

- 目前项目代码中 **没有引用任何外链图片**。
- 如果你后续要添加图片：建议直接把图片放进 `src/assets/`，然后在 Vue 组件里用本地路径引用（和 `logo.png` 的用法一样），这样最稳。

## 3. 本地开发

```bash
npm install
npm run serve
```

## 4. 本地构建

```bash
npm ci
npm run build
```
