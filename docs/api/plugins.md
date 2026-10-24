---
title: Plugins API
sidebar_position: 4
---

# Plugins API

## 查询已安装插件

```http
GET /api/plugins
```

响应只返回脱敏 Manifest 摘要，不返回安装路径和入口程序路径。

## 浏览器扩展

Chrome 商店扩展：

```http
POST /api/extensions/import/store
Content-Type: application/json

{ "profile_id": "profile-...", "url": "https://chromewebstore.google.com/detail/..." }
```

本地扩展目录或 ZIP 使用 multipart：

```http
POST /api/extensions/import/local
Content-Type: multipart/form-data
```

必须提供 `profile_id`、`paths` 和 `files`。浏览器扩展与指定窗口绑定，随该窗口启动加载。

## 自动化插件

```http
POST /api/plugins/automation/import
Content-Type: multipart/form-data

file=<plugin.abp|plugin.zip>
```

自动化插件是应用级能力包，不需要也不允许选择 Profile。安装后其节点进入 RPA Node Catalog，运行时使用当前工作流的环境。

删除：

```http
DELETE /api/plugins/automation/{plugin_id}
```

Manifest、节点 Schema 和 Host 协议见[自动化插件](../plugins/overview)。
