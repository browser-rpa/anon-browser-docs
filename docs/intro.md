---
sidebar_position: 1
title: 开发者中心
slug: /
---

# anon-browser 客户端开发者中心

anon-browser 是一个可以公开下载并运行在本地电脑上的隔离浏览器客户端。安装后即可创建相互隔离的 Chrome 窗口、配置窗口身份、运行 RPA 自动化任务，也可以通过本地 API 和插件扩展能力进行集成。

从[客户端下载](./download)开始安装，再按[快速开始](./quickstart)创建第一个窗口和工作流。本网站介绍客户端 API、自动化插件开发和工作流集成；开发时请使用文档列出的接口，并按需声明权限。

## 两种插件

| 类型 | 作用 | 是否绑定窗口 |
| --- | --- | --- |
| 浏览器插件 | Chrome 扩展，随指定浏览器窗口启动加载 | 是，绑定 Profile |
| 自动化插件 | 提供 RPA 节点的能力包，可用代码实现复杂业务逻辑 | 否，运行时使用当前工作流环境 |

如果目标是增加一个可以拖到 RPA 画布上的操作，应开发自动化插件，而不是浏览器插件。

## 文档状态

当前文档对应桌面客户端的 `plugin_api_version=1` 和 HTTP API `v0`。标记为 **Preview** 的接口可能在正式版本前调整；集成程序应固定 anon-browser 版本，并在升级前重新校验插件 Schema 和 API 响应。

## 推荐阅读顺序

1. [快速开始](./quickstart)
2. [HTTP API 概览](./api/overview)
3. [自动化插件概览](./plugins/overview)
4. [Manifest](./plugins/manifest)
5. [节点 Schema](./plugins/node-schema)
6. [Plugin Host 协议](./plugins/protocol)
