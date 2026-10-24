---
title: RPA API
sidebar_position: 3
---

# RPA API

## 节点目录

```http
GET /api/rpa/node-catalog
POST /api/rpa/validate
```

Catalog 返回内置节点和已安装自动化插件节点。校验请求必须带 `catalog_revision` 和完整 Graph。

## 工作流生命周期

```http
GET   /api/rpa/workflows?project_id=local
POST  /api/rpa/workflows
GET   /api/rpa/workflows/{workflow_id}
PATCH /api/rpa/workflows/{workflow_id}
PUT   /api/rpa/workflows/{workflow_id}/draft
POST  /api/rpa/workflows/{workflow_id}/validate
POST  /api/rpa/workflows/{workflow_id}/publish
GET   /api/rpa/workflows/{workflow_id}/versions
GET   /api/rpa/workflows/{workflow_id}/schema
```

草稿修改必须带 `expected_workflow_revision`、`expected_version_revision` 和 `catalog_revision`。发布后生成不可变版本。

## 运行与调度

```http
POST  /api/rpa/workflows/{workflow_id}/runs
GET   /api/rpa/workflows/{workflow_id}/runs?limit=20&cursor=...
GET   /api/rpa/runs/{run_id}
GET   /api/rpa/runs/{run_id}/events
POST  /api/rpa/runs/{run_id}/execute
POST  /api/rpa/runs/{run_id}/step
POST  /api/rpa/runs/{run_id}/cancel
POST  /api/rpa/workflows/{workflow_id}/schedules
```

运行请求可以提供 `input`、`profile_binding`、`workflow_version_id` 和 `debug`。生产调用应显式指定已发布版本，并携带 `Idempotency-Key`。

## 文件产物

工作流节点产生的文件通过 Run Artifact 查询或下载：

```http
GET /api/rpa/runs/{run_id}/artifacts/{artifact_id}
GET /api/rpa/runs/{run_id}/artifacts/{artifact_id}?download=1
```
