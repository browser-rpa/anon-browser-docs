---
title: Go SDK
sidebar_position: 2
---

# Go SDK

SDK 仓库：[anon-browser-sdk](https://github.com/browser-rpa/anon-browser-sdk)。模块路径 `github.com/browser-rpa/anon-browser-sdk`，Go 1.24+，仅依赖标准库。

SDK 提供插件协议类型、节点定义、能力调用和工作流构建工具。使用 SDK 编写插件时，可以直接复用这些类型；浏览器操作通过客户端提供的授权能力完成。

目前 SDK 为公开的预览版本，尚未发布稳定标签。[examples](https://github.com/browser-rpa/anon-browser-examples) 已固定提交依赖，可独立克隆、编译，无需相邻 SDK 目录。自己的项目可以固定同一版本：

```bash
go get github.com/browser-rpa/anon-browser-sdk@v0.0.0-20261030151347-bf8a97357247
```

## 入口与类型化调用

```go
package main

import (
    "context"
    "fmt"
    "os"
    sdk "github.com/browser-rpa/anon-browser-sdk/plugin"
)

func main() {
    server := sdk.NewServer()
    err := server.Register("acme.page_title", 1, func(ctx context.Context, call sdk.NodeCall) (sdk.NodeResult, error) {
        title, err := call.Client.ReadTitle(ctx)
        if err != nil { return sdk.NodeResult{}, err }
        return sdk.NodeResult{NextPort: "success", Output: map[string]any{"title": title}}, nil
    })
    if err == nil { err = server.Serve(context.Background(), os.Stdin, os.Stdout) }
    if err != nil { fmt.Fprintln(os.Stderr, err); os.Exit(1) }
}
```

同时在 Go Manifest 和 Node Policy 中声明 `browser.read`，安全等级使用 `sensitive`。完整可编译并可打包的定义见 examples 的 `plugins/capability-node/main.go`。

SDK 已处理消息封装、唯一调用 ID、响应匹配、大小/次数限制和最终结果编码。业务输入可用 `call.DecodeInput(&input)` 解码成自己的结构体，不需要重写 Invocation、Result 或 capability 信封类型。

常用方法包括 `ReadTitle`、`ReadURL`、`ReadText`、`Navigate`、`Click`、`TypeText`、`Evaluate`、`GetVariable`、`SetVariable`、`HTTPRequest`、`GetStorage`、`SetStorage`、`WriteTextArtifact`。HTTP Header 返回多值映射，避免丢失重复 Header。低层 `Call` 只请求宿主已经开放的能力，不会解锁新权限。

## 节点与 Manifest 用 Go 声明

`sdk.Manifest`、`NodeDescriptor`、`NodeMetadata`、`NodeSchema`、`NodePolicy` 与宿主使用相同公开类型。`Describe`、`Object`、`String` 帮助构造常用表单 Schema；复杂 JSON Schema 可以使用 `json.RawMessage` 扩展。

```go
node, err := sdk.Describe(
    sdk.NodeMetadata{Type: "acme.page_title", Version: 1, DisplayName: "读取标题", Category: "业务", SecurityLevel: "sensitive", Idempotency: "idempotent"},
    sdk.Object(nil),
    sdk.Object(map[string]sdk.Schema{"title": sdk.String("标题")}, "title"),
    sdk.NodePolicy{
        RequiredPermissions: []string{sdk.PermissionBrowserRead},
        Resources: sdk.NodeResources{ProfileLease: true, Runtime: true, ActivePage: true},
        Timeouts: sdk.NodeTimeout{Default: 10*time.Second, Minimum: time.Second, Maximum: time.Minute},
        MaxAttempts: 1,
    },
)
```

上例需要导入 `time`。将 node 放入 Manifest 的 Nodes，并在 Manifest.Permissions 中声明同一权限。examples 的打包脚本先在构建主机上执行 `--manifest`，再编译目标平台，支持交叉编译。JSON 是生成物，Go 才是修改入口。

## 运行边界

- 一个插件进程只处理一个节点调用，返回结果后退出；不要等待下一条 invocation，否则可能阻塞宿主。
- stdout 只输出协议，日志写 stderr。输入最大 1 MiB、SDK 累计输出最大 4 MiB、最多 64 次 capability 调用。
- capability 调用串行，失败不自动重试。点击、提交等副作用不能被网络重试悄悄重放。
- 宿主负责超时/取消并终止进程；普通 io.Reader 的阻塞读取无法仅由 context 打断。
- 进程隔离不等于 OS 安全沙箱。只运行可信插件，不把 Secret、Cookie 或宿主环境变量当日志输出。

工作流编排是 SDK 的另一个公开包，参见 [用 Go 创建工作流](workflow-authoring.md)。
