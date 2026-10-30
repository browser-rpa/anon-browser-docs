---
title: Capability 权限
sidebar_position: 5
---

# Capability 权限

插件调用与内置工作流节点是两套入口。SDK 封装现有插件 Broker，不会把所有内置节点自动变为可调用 capability。

## 已开放的插件调用

| 能力域 | action | Manifest 与当前 Node Policy 均需声明 |
| --- | --- | --- |
| browser | read_title/read_url/read_text/read_attribute/screenshot | browser.read |
| browser | navigate/back/forward/reload | browser.navigate |
| browser | wait/click/double_click/right_click/hover/clear/type/press/scroll/select/check | browser.interact |
| browser | open/close/new_tab/switch_tab/close_tab | browser.tabs |
| browser | evaluate | browser.script |
| browser | cookies_get/cookies_set | storage.read/storage.write |
| storage | get/set | storage.read/storage.write |
| variables | get/set | variables.read/variables.write |
| http（network 为别名） | request | network.fetch |
| artifacts | write | run.artifacts.write |

使用 SDK 的 ReadTitle、GetVariable、HTTPRequest 等方法时，能力域和 action 已封装。未封装的方法可以使用 Client.Call，但只能填表中已实现的 action。

插件必须在 Manifest 声明最小权限，并把当前节点需要的权限放入 `policy.required_permissions`；安装时检查节点声明，运行前按节点安全等级审批，Broker 同时检查 Manifest 和当前节点权限，并核对节点类型与版本。不能借用同包其他节点的权限。SDK 不是权限边界，不应把未审核插件当作任意代码安全沙箱。

声明了权限的节点不能标为 `safe`，使用 `sensitive` 或 `high_risk`。其中 `network.fetch`、`browser.script`、`network.modify` 必须使用 `high_risk`。不要申请未来可能使用的权限，也不要将 Cookie、Secret、响应正文或截图内容随意输出到日志与外部接口。

结果返回同样受权限约束：`NodeResult.Variables` 需要 `variables.write`，`NodeResult.Artifacts` 需要 `run.artifacts.write`，不能通过直接返回结果绕过 Broker。只返回 `Output` 不需要变量写入权限。

## 工作流能力，不是直接插件调用

| 新增能力 | 推荐编排入口 |
| --- | --- |
| 人工操作等待与元素/文本/URL/Cookie 检测 | human.wait |
| 保持和复用浏览器 | browser.session_keep / browser.session_bind |
| 新文档注入及事件桥 | browser.script_register / browser.script_unregister，配合事件连接器 |
| 外部 HTTP 发起任务或指令 | 触发器 start_run / signal_run / reply_request |
| 请求外部处理、可靠回调、领取与完成指令 | reply.request / webhook.emit / signal.wait / signal.complete |
| 先监听接口再动作、选择多次响应并提取字段 | browser.wait_for_response |
| 受管素材上传和下载 | browser.file_upload / browser.download |
| 共享步骤、批量和分页 | flow.call / flow.batch / data.paginate |

可用 SDK workflow 包生成以上节点，但不能通过 capability_call 凭空调用它们。environment.manage、background.tasks、network.modify 等权限名称即使能在 Manifest 中声明，也不代表当前插件 Broker 已提供对应 action。

工作流的 browser.click 已用 mode=single/double/right 合并点击方式；插件 Broker 的 double_click/right_click action 仍保留，不要混淆节点类型和 capability action。

完整示例与边界见 [用 Go 创建工作流](workflow-authoring.md)。
