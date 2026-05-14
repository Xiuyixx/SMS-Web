/**
 * SMS-Web CF Worker 入口
 * 静态资源由 CF Assets 处理，Worker 只做 SPA fallback
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 有文件扩展名的请求交给 Assets 处理（.js/.css/.png 等）
    // SPA 路由（无扩展名）统一返回 index.html
    if (url.pathname.includes('.')) {
      // 尝试从 Assets 获取静态文件
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // SPA fallback：返回 index.html
    const indexReq = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(indexReq);
  }
};
