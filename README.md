# PRD Demo

这个项目用于沉淀产品经理侧的 PRD + 可交互 Demo 工作流。

目标是把需求 idea 逐步推进成：

1. 清楚的交互逻辑
2. 可在手机上演示的 Demo
3. 适合需求评审会使用的 PRD
4. 可追溯的决策记录和版本记录
5. 后续可持续扩展的 Demo Hub

## 当前 Demo

| Demo | 状态 | 目录 |
| --- | --- | --- |
| 录音删除管理 | 可演示 | `audio-delete/` |
| 设备鉴权 | 可演示 | `device-auth-poc/` |
| OTA 手动升级 | 可演示 | `device-auth-poc/` |

## Demo Hub

当前统一预览入口由 `device-auth-poc/` 承载，首页可进入：
- 录音删除管理
- 设备鉴权
- OTA 手动升级

当前本地开发访问：

```text
http://127.0.0.1:5173/
```

当前 Cloudflare Pages 固定预览链接：

```text
https://prd-demo-hub.pages.dev
```

当前部署预览链接：

```text
https://21e8e81b.prd-demo-hub.pages.dev
```

说明：Cloudflare Pages 是稳定外网入口，适合长期分享给研发；部署预览链接对应本次发布版本。

## 手机添加到桌面

iPhone：
1. 用 Safari 打开 Demo Hub 链接。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 名称可设置为 `PRD Demo`。

Android：
1. 用 Chrome 打开 Demo Hub 链接。
2. 点击右上角菜单。
3. 选择“添加到主屏幕”或“安装应用”。
4. 名称可设置为 `PRD Demo`。

## 目录说明

```text
PRD_Demo/
  CLAUDE.md
  README.md
  docs/workflow/
  demos/
```

- `CLAUDE.md`：Claude Code 项目协作规则。
- `docs/workflow/`：项目级工作流说明和常用话术。
- `demos/`：每个具体需求 demo 的 PRD、决策、版本和源码。

## 新增需求 Demo 的推荐流程

1. 在项目根目录讨论需求 idea，不急着创建文件。
2. 讨论清楚后确认目录名和产物结构。
3. 用户明确说“实现”后，再创建 `demos/{demo-name}/`。
4. 生成或更新 PRD、decision-log、version-log 和 demo 源码。
5. 接入 Demo Hub。
6. 需要时更新部署或查看说明。
