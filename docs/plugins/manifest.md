---
title: Manifest
sidebar_position: 2
---

# Manifest

`.abp`/`.zip` 包中必须包含一个 `manifest.json`。入口程序路径必须是包内相对路径；安装时 Core 会重新解析路径并拒绝路径逃逸。

```json
{
  "id": "acme.invoice",
  "name": "Invoice automation",
  "version": "0.1.0",
  "kind": "automation",
  "entrypoint": "bin/plugin",
  "entrypoints": {
    "darwin-arm64": "bin/darwin-arm64/plugin",
    "linux-amd64": "bin/linux-amd64/plugin",
    "windows-amd64": "bin/windows-amd64/plugin.exe"
  },
  "permissions": ["browser.read", "variables.write"],
  "nodes": []
}
```

## 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 稳定命名空间 ID，只允许小写字母、数字、`.`、`_`、`-` |
| `name` | 是 | 展示名称 |
| `version` | 是 | 插件版本，建议 SemVer |
| `kind` | 是 | 自动化插件固定为 `automation` |
| `entrypoint` | 否 | 默认入口，包内相对路径 |
| `entrypoints` | 否 | 按 `GOOS-GOARCH` 选择平台入口 |
| `permissions` | 否 | 插件允许申请的最大权限集合 |
| `nodes` | 否 | 导出的 Node Descriptor 列表 |

`entrypoint` 或 `entrypoints` 至少提供一个。浏览器扩展的 Manifest 不应声明 `entrypoint` 或 `nodes`。

## 包结构

```text
acme-invoice.abp
└── acme-invoice/
    ├── manifest.json
    ├── bin/
    │   └── plugin
    └── nodes/
        └── invoice.extract.json
```

包内禁止符号链接、绝对路径、`..` 路径和重复 Manifest。入口程序会被单独授予执行权限，其他文件按普通数据处理。
