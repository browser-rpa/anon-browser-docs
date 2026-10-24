---
title: 兼容性与版本
---

# 兼容性与版本

## API 版本

当前公开 HTTP API 使用 `/api` 前缀，尚未承诺跨大版本兼容。建议在客户端启动时读取 `/healthz`，并将 anon-browser 版本、插件 API 版本和节点 Catalog revision 记录到自己的运行日志。

## 插件版本

Manifest 使用 SemVer，节点类型使用稳定命名空间，例如：

```text
acme.invoice.extract
```

节点的 `type + version` 是不可变契约。修改输入、输出或端口语义时应递增节点版本，而不是覆盖旧版本。

## 发布锁定

生产工作流应固定：

- anon-browser 版本；
- 自动化插件版本和包摘要；
- 工作流发布版本；
- 节点 Catalog revision。

如果 Catalog revision 发生变化，应重新校验草稿并重新发布工作流。
