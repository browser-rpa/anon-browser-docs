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
      Core 能力边界
```

## 开发闭环

1. 为插件分配稳定 ID，例如 `acme.invoice`。
2. 编写 `manifest.json` 和一个或多个 Node Descriptor。
3. 实现入口程序，读取 stdin 的 JSON 请求并向 stdout 返回 JSON 结果。
4. 在节点 Policy 中声明最小权限、超时、资源和错误码。
5. 使用示例仓库的打包脚本生成 `.abp` 或 `.zip`。
6. 在桌面扩展中心导入，或通过 `/api/plugins/automation/import` 上传。
7. 重新读取 Node Catalog，在 RPA 编辑器中拖入节点。

## 什么时候使用插件

适合插件：复杂的页面解析、行业数据清洗、业务规则计算、外部系统适配、需要多步 capability 调用的操作。

不适合插件：仅仅是点击、输入、等待、导航、HTTP 请求等已有基础节点可以完成的流程。优先复用内置节点，避免增加不必要的权限和升级成本。

## 当前限制

- 插件运行在 Core 启动的受控子进程中。
- 一个节点调用的输入和输出默认限制为 1 MiB 级别，并受输出数量限制。
- 插件不能自行修改工作流、创建 Run 或读取其他 Profile。
- 签名发布和远程插件市场尚未作为公开稳定能力；本地导入适合开发测试。
