---
title: Profiles API
sidebar_position: 2
---

# Profiles API

Profile 是一个持久浏览器环境，包含独立的浏览器状态和身份配置。Profile 不等于账号，也不应该在插件中复制 Profile 数据。

## 查询

```http
GET /api/profiles
```

## 创建

```http
POST /api/profiles
Content-Type: application/json
```

最小字段：`name`、`platform`、`identity_template`、`browser_family`、`browser_version`、`languages`、`timezone`、`proxy_mode`、`window_width`、`window_height`。客户端会为内部浏览器运行参数填充安全默认值。

## 更新与删除

```http
PUT    /api/profiles/{profile_id}
DELETE /api/profiles/{profile_id}?revision=3
```

更新和删除都必须使用返回对象中的 `revision`，冲突时重新读取 Profile，不要盲目覆盖。

## 状态和网络配置

```http
POST /api/profiles/{profile_id}/enable
POST /api/profiles/{profile_id}/disable
GET  /api/profiles/{profile_id}/network
PUT  /api/profiles/{profile_id}/network
```

工作流可以在 Run 时通过 `profile_binding` 选择环境；自动化插件本身不绑定 Profile。
