---
title: Manifest
sidebar_position: 2
---

# Manifest

`.abp`/`.zip` 包中必须包含一个 `manifest.json`。入口程序路径必须是包内相对路径；客户端安装时会重新解析路径并拒绝路径逃逸。

推荐由 [Go SDK](go-sdk.md) 的 `Manifest`、`NodeDescriptor` 生成，不再手动复制类型或编辑生成文件。公开 Manifest 不包含宿主安装路径、数据库字段或运行时对象。

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

## 校验与升级

生成前调用 `manifest.Validate()`；`manifest.Marshal()` 也会自动校验节点声明，错误会指出节点类型、版本和字段。客户端安装时再次校验，拒绝无效节点、内置命名空间和其他插件已占用的节点身份。错误不会覆盖已安装的版本。

每次安装使用独立目录，并由客户端计算内容摘要；无需在公开 Manifest 填写安装路径或摘要。升级不会替换已注册节点使用的可执行文件，重启客户端后才加载新版本及新节点声明。同一版本号的不同代码也会产生不同的实现身份。

为避免影响仍在运行的旧版本，升级后会保留旧安装目录，目前不自动回收。启动时发现无效声明或缺失入口的插件，会跳过该插件并记录诊断，不阻断其他节点加载。
