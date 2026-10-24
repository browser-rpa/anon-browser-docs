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
          "type": "string",
          "title": "内容选择器",
          "x-allow-variable-ref": true
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
    "timeouts": { "default": "10s", "minimum": "100ms", "maximum": "60s" },
    "resources": { "profile_lease": true, "runtime": true, "active_page": true },
    "max_attempts": 1
  }
}
```

## 设计规则

- `metadata.type + metadata.version` 是不可变节点身份。
- 节点只能使用 Manifest 已声明的权限。
- 输入、输出和事件应使用结构化 JSON，不要把多个字段拼成不可解析字符串。
- 需要引用工作流变量的字段可使用 `x-allow-variable-ref: true`。
- `policy` 应保守声明资源和超时；过大的权限会增加审批成本。
- 新增不兼容字段或修改端口语义时递增节点版本。
