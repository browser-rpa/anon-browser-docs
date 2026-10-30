---
title: 自动化插件概览
sidebar_position: 1
---

# 自动化插件概览

自动化插件用于把无法用现有节点表达的业务逻辑封装成可复用的 RPA 节点。插件可以用 Go、Rust、Node.js、Python 或其他能生成受控入口程序的语言实现。

插件不是浏览器扩展，也不是裸 CDP 客户端：

```text
manifest.json + node schema
            ↓ 安装校验
      Node Catalog
            ↓ 工作流运行
       Plugin Host
            ↓ capability.call
      宿主授权能力
```

## 开发闭环

1. 为插件分配稳定 ID，例如 `acme.invoice`。
2. 使用 [Go SDK](go-sdk.md) 在 Go 中声明 Manifest 和 Node Descriptor，并生成 `manifest.json`。
3. 注册节点 handler，SDK 负责 stdin/stdout 协议和 capability 往返；不再手写公共类型。
4. 在节点 Policy 中声明最小权限、超时、资源和错误码。
5. 使用示例仓库的打包脚本生成 `.abp` 或 `.zip`。
6. 在桌面扩展中心导入，或通过 `/api/plugins/automation/import` 上传。
7. 安装/升级后重启客户端，使启动时注册的 Node Catalog 更新，再拖入节点。

## 什么时候使用插件

适合插件：复杂的页面解析、行业数据清洗、业务规则计算、外部系统适配、需要多步 capability 调用的操作。

不适合插件：仅仅是点击、输入、等待、导航、HTTP 请求等已有基础节点可以完成的流程。优先复用内置节点，避免增加不必要的权限和升级成本。

## 当前限制

- 插件运行在客户端启动的受控子进程中。
- 一个节点调用输入最大 1 MiB，默认累计 stdout 最大 4 MiB，最多 64 次 capability 调用；输出、变量及产物引用各最多 256 项。
- 插件不能自行修改工作流、创建 Run 或读取其他 Profile。
- 签名发布和远程插件市场尚未作为公开稳定能力；本地导入适合开发测试。

SDK 的 [workflow 包](workflow-authoring.md) 可以生成包含内置节点的工作流；它与运行中的插件 capability 是两种不同用途。新增会话、事件、文件和持久等待能力应按工作流/API 编排，不表示插件可直接调用所有内置节点。
