---
title: 安全边界
---

# 安全边界

客户端公开 API 是能力边界，不是数据库或浏览器进程的直通接口。

## 插件不能直接访问

- Profile 数据目录、SQLite 文件和其他 Profile 的状态
- 原始 CDP WebSocket 地址
- Gateway 私钥、代理凭据和 Secret 明文
- 任意 Shell、动态库、公共 TCP 监听和全局文件系统
- 其他项目、Run 或工作流的变量和产物

插件必须通过声明的 capability 请求浏览器、网络、变量和 Artifact 操作。每一次调用还会结合当前节点 Schema、工作流发布版本和 Run 授权再次检查。

## 敏感能力

`browser.script`、`storage.read`、`storage.write`、`network.modify`、`environment.manage` 等能力不会因为安装插件自动获得。它们需要同时满足：

1. 插件 Manifest 声明权限；
2. 节点 Policy 声明所需权限；
3. 当前工作流和 Run 明确批准。

## 数据处理建议

- Secret 只传递 `secret_ref`，不要写入节点配置或日志。
- Cookie、Token、Authorization Header 不应写入普通输出。
- 大文件使用 Run Artifact，不要把二进制内容塞入单个 JSON 节点输出。
- 所有 mutation 请求使用稳定的 `Idempotency-Key`，重试不会重复创建资源。
