# anon-browser 客户端与开发者文档

anon-browser 是一个面向本地用户的、可公开下载的桌面浏览器客户端。下载客户端后，可以在本机创建相互隔离的浏览器窗口、运行 RPA 工作流，并通过本地 HTTP API 或插件扩展能力进行集成。

本网站同时提供面向开发者的公开契约，内容只覆盖客户端使用方式、本地 HTTP API、RPA 工作流接口、浏览器扩展导入能力和自动化插件协议。当前版本不介绍服务端部署、远程执行或内部运维逻辑。

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

## 公开边界

不要在本仓库提交以下内容：

- 私有仓库源码、内部路径和数据库结构；
- 代理、TLS、Gateway、Profile data-dir 等内部实现细节；
- 任何 Token、Cookie、证书私钥或测试账号；
- 未经确认的内部 API 和实验功能。

API 契约见 [`openapi/anon-browser.yaml`](openapi/anon-browser.yaml)，可运行示例见 [anon-browser-examples](https://github.com/browser-rpa/anon-browser-examples)。

客户端下载与安装说明见[客户端下载](https://browser-rpa.github.io/anon-browser-docs/download)。
