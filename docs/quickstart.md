---
sidebar_position: 2
title: 快速开始
---

# 快速开始

本文面向已经下载 anon-browser 桌面客户端的本地用户。若尚未安装，请先查看[客户端下载](./download)。本页只使用客户端本机提供的 loopback API，不涉及服务端部署。

## 1. 启动桌面客户端

桌面客户端会在本机 loopback 地址提供管理 API。文档示例假设 API 地址为 `http://127.0.0.1:8787`：

```bash
curl http://127.0.0.1:8787/healthz
```

该 API 只用于本机客户端集成。不要把它转发到公网，也不要在插件或示例代码中硬编码任何凭据。

## 2. 创建一个浏览器环境

```bash
curl -X POST http://127.0.0.1:8787/api/profiles \
  -H 'Content-Type: application/json' \
  -d '{
    "project_id": "local",
    "name": "开发测试窗口",
    "platform": "mac",
    "identity_template": "mac-default",
    "browser_family": "chrome",
    "browser_version": "stable",
    "languages": ["zh-CN", "en-US"],
    "timezone": "Asia/Shanghai",
    "proxy_mode": "direct",
    "window_width": 1440,
    "window_height": 900
  }'
```

返回的 `id` 是 Profile ID。工作流运行时通过 Profile 绑定使用隔离环境；插件安装阶段不应保存或推断其他 Profile 的数据目录。

## 3. 获取节点目录

```bash
curl http://127.0.0.1:8787/api/rpa/node-catalog
```

自动化插件安装成功后，插件节点会出现在这个目录中，RPA 编辑器和 API 使用同一份节点 Schema。

## 4. 创建、发布并运行工作流

工作流遵循“草稿 → 校验 → 发布 → 运行”。发布版本不可被后续草稿编辑直接修改：

```bash
curl -X POST http://127.0.0.1:8787/api/rpa/workflows \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-workflow-001' \
  -d @workflow.json

curl -X POST http://127.0.0.1:8787/api/rpa/workflows/WORKFLOW_ID/publish \
  -H 'Content-Type: application/json' \
  -d @publish.json
```

完整接口见 [RPA API](./api/rpa)。可运行的最小工作流和节点配置见 [示例仓库](https://github.com/browser-rpa/anon-browser-examples)。

## 5. 安装自动化插件

```bash
curl -X POST http://127.0.0.1:8787/api/plugins/automation/import \
  -F 'file=@example.echo-node.abp'
```

安装后重新打开 RPA 编辑器或刷新节点目录。插件包由 Core 复制到应用管理目录，调用方不需要传入安装路径。
