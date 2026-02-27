# SMS-Web

`smsForwardClientWeb` 的纯 Web 版（去掉 Electron 依赖），用于部署到 Cloudflare Pages。

## Cloudflare Pages 部署

在 Cloudflare Dashboard → **Pages** → **Create a project**：

- **Framework preset**: Vue
- **Build command**: `npm ci && npm run build`
- **Build output directory**: `docs`
- **Environment**:
  - `NODE_VERSION`: `22`（或 20+ 均可）

构建产物在 `docs/`，可直接作为静态站点托管。

## 图片防盗链（可选）

如果后端/外链图片启用了 `Referer` 防盗链，浏览器从 Pages 域名直接请求可能被 403。

本项目提供一个 Cloudflare Pages Function 作为图片代理：

- 代理地址：`/img?url=<encoded>`
- 代码位置：`functions/img.js`

示例：

```text
https://<your-pages-domain>/img?url=https%3A%2F%2Fexample.com%2Fa.png
```

安全建议：在 Pages 项目里配置环境变量 `IMG_PROXY_ALLOWLIST`，只允许代理指定域名：

```text
IMG_PROXY_ALLOWLIST=example.com,static.example.com
```

## 开发

```bash
npm install
npm run serve
```
