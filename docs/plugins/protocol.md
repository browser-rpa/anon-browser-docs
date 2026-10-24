---
title: Plugin Host 协议
sidebar_position: 4
---

# Plugin Host 协议

当前公开的 `plugin_api_version=1` 使用 stdin/stdout 上的 JSON 消息。stdout 只能输出协议消息，日志请写 stderr。

## 节点调用

Core 启动入口程序后发送一行：

```json
{
  "protocol": "anon-browser.plugin.node.v1",
  "plugin_id": "acme.invoice",
  "node_type": "acme.invoice.extract",
  "node_version": 1,
  "run": { "project_id": "local", "run_id": "run-123", "profile_id": "profile-123" },
  "node_id": "extract-1",
  "attempt": 1,
  "input": { "selector": "#invoice" },
  "settings": { "timeout_ms": 10000 }
}
```

节点成功：

```json
{
  "ok": true,
  "result": {
    "next_port": "success",
    "output": { "invoice_no": "A-001" },
    "variables": { "invoice_no": "A-001" },
    "artifacts": []
  }
}
```

节点失败：

```json
{ "ok": false, "error": "invoice_not_found" }
```

## Capability 调用

交互模式下，插件可以请求已经在 Manifest、Node Policy 和 Run 授权交集中的能力：

Capability 消息中的 `capability` 是能力域，权限控制仍使用 Manifest 和 Node
Policy 中的完整权限字符串。例如读取页面标题：

```json
{
  "type": "capability_call",
  "id": "call-1",
  "capability": "browser",
  "action": "read_title",
  "arguments": {}
}
```

变量和 HTTP 的调用方式相同：

```json
{"type":"capability_call","id":"call-2","capability":"variables","action":"get","arguments":{"name":"page.title"}}
{"type":"capability_call","id":"call-3","capability":"http","action":"request","arguments":{"method":"POST","url":"https://example.test/callback","body":"{}"}}
```

Host 返回：

```json
{
  "type": "capability_result",
  "id": "call-1",
  "ok": true,
  "data": "页面标题"
}
```

然后插件继续发送最终的 `ok/result` 消息。Host 会限制调用次数、消息大小、超时和输出数量；插件不能自行访问 CDP 或 Core 数据库。

## Go 最小调用示例

插件程序可以使用标准库的 `encoding/json` 发送和读取 JSON 行：

```go
encoder := json.NewEncoder(os.Stdout)
decoder := json.NewDecoder(os.Stdin)

_ = encoder.Encode(map[string]any{
    "type": "capability_call",
    "id": "call-1",
    "capability": "browser",
    "action": "read_title",
    "arguments": map[string]any{},
})

var response struct {
    Type string `json:"type"`
    ID   string `json:"id"`
    OK   bool   `json:"ok"`
    Data any    `json:"data"`
}
if err := decoder.Decode(&response); err != nil {
    // capability 通道异常，返回节点失败
}
```

可运行的完整 Go 示例见公开仓库的
[`plugins/capability-node`](https://github.com/browser-rpa/anon-browser-examples/tree/main/plugins/capability-node)。
