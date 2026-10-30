---
title: 用 Go 创建工作流
sidebar_position: 3
---

# 用 Go 创建工作流

`github.com/browser-rpa/anon-browser-sdk/workflow` 是工作流 JSON 的类型化作者工具。它只生成 Graph，不执行节点；生成的工作流仍需通过目标 anon-browser 的 Node Catalog、权限审批、校验和发布。

```go
flow, err := workflow.New("local", "复用会话").Add(
    workflow.Start("start"),
    workflow.BindSession("bind", "session-REPLACE_ME"),
    workflow.Open("open", false),
    workflow.Navigate("page", "https://example.test/workspace"),
    workflow.End("end"),
).Then("start", "bind", "open", "page", "end").Build()
if err != nil { return err }
data, _ := json.MarshalIndent(flow, "", "  ")
```

`Then` 只连 success 端口；超时、失败、拒绝和条件不满足必须使用 `Link` 显式接出。复杂节点使用类型化 Config，尚未封装的 Catalog 节点可以使用 `workflow.N(id, type, config)`，不需要拼接 JSON 字符串。

## 能力构造器

SDK 已提供以下常用构造器：

- 会话：`KeepSession`、`BindSession`；
- 人工操作与检测：`HumanWait`、`WaitCondition`；
- 页面脚本：`RegisterScript`、`UnregisterScript`；
- 外部指令：`WaitSignal`、`CompleteSignal`、`RequestReply`、`Webhook`；
- 网络与文件：`WaitResponse`、`Upload`、`Download`；
- 复用：`Call` 和根图 `Subflow`；
- 引用：`Ref`（工作流变量）、`Secret`（Secret 引用）、`Material`（素材 `artifact_ref`）。

素材上传只允许项目素材引用，不允许本机路径或 CDN URL。上传文件应先进入素材库，或通过受控 `browser.download` 入库；接口响应的 Header/Body/Cookie 等敏感内容由宿主按 Secret 引用规则管理。

## 示例生成

公开 examples 的 `scenarios/` 是 Go 源码，`cmd/generate-workflows` 生成 `workflows/*.json`：

```bash
go run ./cmd/generate-workflows
go run ./cmd/generate-workflows --check
```

当前覆盖人工登录后保持浏览器、复用会话、页面脚本/连接器、外部指令、消息回复、上传响应、下载入库、共享子流程和响应监听。所有站点 URL、选择器、会话、连接器、Secret 和素材 ID 都是占位值；示例不宣称已适配小红书原生协议。

子流程统一定义在根图 `subflows`，主图通过 `flow.call` 调用；SDK 输出 schema_version 3。工作流可嵌套，但管理 UI 创建的子流程仍是一级定义。
