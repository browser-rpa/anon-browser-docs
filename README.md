# anon-browser 客户端与开发者文档

anon-browser 是一个面向本地用户的、可公开下载的桌面浏览器客户端。下载客户端后，可以在本机创建相互隔离的浏览器窗口、运行 RPA 工作流，并通过本地 HTTP API 或插件扩展能力进行集成。

本网站提供客户端使用指南、本地 HTTP API、RPA 工作流接口、浏览器扩展导入说明和自动化插件开发文档。

## 本地开发

要求 Node.js 20+：

```bash
npm install
npm run start
```

构建静态站点：

```bash
npm run build
npm run serve
```

## 编写与贡献

文档和示例应面向使用者，说明操作步骤、参数、权限要求及适用版本：

- 接口说明以 OpenAPI 和客户端返回的节点 Schema 为准。
- 示例使用占位网址和引用，不提交真实 Token、Cookie、证书私钥或账号数据。
- 实验能力应明确标记为 Preview，并说明使用限制。

API 契约见 [`openapi/anon-browser.yaml`](openapi/anon-browser.yaml)，可运行示例见 [anon-browser-examples](https://github.com/browser-rpa/anon-browser-examples)。

客户端下载与安装说明见[客户端下载](https://browser-rpa.github.io/anon-browser-docs/download)。
