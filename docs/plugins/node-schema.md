---
title: Node Schema
sidebar_position: 3
---

# Node Schema

插件节点和内置节点使用同一套 Schema。编辑器根据 `input_schema` 生成表单，校验器使用 `output_schema`、端口和错误定义。

```json
{
  "metadata": {
    "type": "acme.invoice.extract",
    "version": 1,
    "display_name": "提取发票信息",
    "description": "读取当前页面并输出结构化发票字段",
    "category": "业务处理",
    "security_level": "sensitive",
    "idempotency": "idempotent",
    "docs_url": "https://example.com/docs/invoice-extract"
  },
  "schema": {
    "version": 1,
    "input_schema": {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "selector": {
          "title": "内容选择器",
          "oneOf": [
            { "type": "string" },
            { "type": "object", "required": ["variable_ref"], "additionalProperties": false, "properties": { "variable_ref": { "type": "string" } } }
          ]
        }
      },
      "required": ["selector"]
    },
    "output_schema": {
      "type": "object",
      "properties": { "invoice_no": { "type": "string" } }
    },
    "ports": [
      { "name": "in", "kind": "input" },
      { "name": "success", "kind": "output" },
      { "name": "error", "kind": "error" }
    ],
    "errors": [
      { "code": "invoice_not_found", "description": "页面没有找到发票", "retryable": false }
    ]
  },
  "policy": {
    "capabilities": ["browser.read"],
    "required_permissions": ["browser.read"],
    "timeouts": { "default": 10000000000, "minimum": 100000000, "maximum": 60000000000 },
    "resources": { "profile_lease": true, "runtime": true, "active_page": true },
    "max_attempts": 1
  }
}
```

## 设计规则

- `metadata.type + metadata.version` 是不可变节点身份。
- 节点类型使用自己的小写命名空间，不能占用 `core`、`browser` 等内置命名空间。
- 节点只能使用 Manifest 与自身 `policy.required_permissions` 共同声明的权限。
- 输入、输出和事件应使用结构化 JSON，不要把多个字段拼成不可解析字符串。
- 需要引用变量的字段应在 Schema 中显式允许 `variable_ref` 对象；UI 提示本身不改变字段类型。
- JSON 中 `time.Duration` 使用纳秒数；Go SDK 可以直接写 `10*time.Second`。不要在 Manifest 的 timeout 字段填写 `"10s"`。
- `safe` 节点不得声明受限权限；带权限的节点使用 `sensitive` 或 `high_risk`，并通过运行授权。
- `network.fetch`、`browser.script`、`network.modify` 权限要求 `high_risk`。
- 返回变量或产物引用分别需要 `variables.write`、`run.artifacts.write`，即使没有发起 capability 调用也一样。
- `policy` 应保守声明资源和超时；过大的权限会增加审批成本。
- 新增不兼容字段或修改端口语义时递增节点版本。

推荐在 Go 中用 `sdk.Describe` 和 Schema helper 生成以上结构，详见 [Go SDK](go-sdk.md)。
