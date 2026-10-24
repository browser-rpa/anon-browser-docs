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

```json
{
  "type": "capability_call",
  "id": "call-1",
  "capability": "browser.read",
  "action": "read_text",
  "arguments": { "selector": "#invoice" }
}
```

Host 返回：

```json
{
  "type": "capability_result",
  "id": "call-1",
  "ok": true,
  "data": { "text": "..." }
}
```

然后插件继续发送最终的 `ok/result` 消息。Host 会限制调用次数、消息大小、超时和输出数量；插件不能自行访问 CDP 或 Core 数据库。
