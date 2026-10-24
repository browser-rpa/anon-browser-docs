---
title: Capability 权限
sidebar_position: 5
---

# Capability 权限

权限字符串是插件和宿主之间的公开声明，不代表可以直接获得底层对象。

| 权限 | 用途 | 风险 |
| --- | --- | --- |
| `browser.read` | URL、标题、文本和属性 | 低 |
| `browser.navigate` | 导航、刷新、前进后退 | 中 |
| `browser.interact` | 点击、输入、按键、滚动 | 中 |
| `browser.tabs` | 新建、切换、关闭标签页 | 中 |
| `browser.script` | 执行页面脚本 | 高 |
| `storage.read` | 读取 Cookie/Web Storage | 敏感 |
| `storage.write` | 写入 Cookie/Web Storage | 敏感 |
| `network.fetch` | 通过 Core 发起外部请求 | 中 |
| `network.modify` | 拦截、屏蔽或改写请求 | 高 |
| `variables.read` | 读取当前 Run 变量 | 低 |
| `variables.write` | 写入当前 Run 变量 | 低 |
| `run.artifacts.write` | 写入 Run 文件产物 | 中 |
| `environment.manage` | 创建或管理临时环境 | 高 |
| `background.tasks` | 请求后台任务能力 | 高 |

最终权限是三者交集：

```text
Manifest permissions
∩ Node policy.required_permissions
∩ Workflow/Run authorization
```

任意一层未声明都会 fail-closed。插件不应申请“以后可能用到”的权限，只申请当前节点实际需要的最小集合。
