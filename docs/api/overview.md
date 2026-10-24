---
title: HTTP API 概览
sidebar_position: 1
---

# HTTP API 概览

## 基本约定

| 项目 | 约定 |
| --- | --- |
| Base URL | 桌面客户端本地 loopback 地址，例如 `http://127.0.0.1:<port>` |
| JSON | 请求和响应使用 UTF-8 JSON |
| 错误 | `{ "error": "..." }`，HTTP 状态码表示类别 |
| 幂等 | 创建工作流、Run、Schedule 使用 `Idempotency-Key` |
| 并发 | 更新资源携带 `revision` 或 `expected_revision` |
| 分页 | Run 列表使用 `limit` 与 `cursor` |

## 状态码

| 状态码 | 含义 |
| --- | --- |
| `200` | 查询或更新成功 |
| `201` | 创建成功 |
| `204` | 删除或停止成功，无响应体 |
| `400` | 请求格式或业务参数错误 |
| `401/403` | 鉴权或权限不足 |
| `404` | 资源不存在 |
| `409` | revision、幂等键或资源状态冲突 |
| `422` | 工作流或节点校验失败 |
| `501` | 当前部署没有启用该服务 |

## 公开接口分组

| 分组 | 入口 | 用途 |
| --- | --- | --- |
| Health | `/healthz`, `/readyz` | 进程和依赖检查 |
| Profiles | `/api/profiles` | 创建和管理浏览器环境 |
| Runtime | `/api/runtimes` | 启停环境和执行受限浏览器命令 |
| Plugins | `/api/plugins`, `/api/extensions` | 查询、导入、删除插件 |
| RPA | `/api/rpa` | 节点目录、工作流、发布和运行 |

更完整的机器可读描述见仓库中的 [`openapi/anon-browser.yaml`](https://github.com/browser-rpa/anon-browser-docs/blob/main/openapi/anon-browser.yaml)。

## 使用边界

这是安装在本机的桌面客户端 API，默认只监听 loopback 地址。请不要把它转发到公网，也不要把浏览器前端、插件包或工作流配置中的敏感信息当作管理凭据保存。服务端部署和远程调用不属于当前公开客户端契约。
