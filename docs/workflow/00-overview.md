# PRD_Demo 工作流总览

## 项目定位

PRD_Demo 是产品经理侧的需求表达与交互演示项目。

它用于把需求 idea 逐步沉淀为：
- 可讨论的需求结构
- 可交互的手机端 Demo
- 适合需求评审会使用的 PRD
- 可追溯的决策记录
- 可持续迭代的版本记录

## 工作边界

关注：
- 业务背景
- 用户场景
- 页面范围
- 交互流程
- 状态规则
- 边界条件
- 演示物料
- 版本记录

不主动关注：
- Android/iOS 翻译实现建议
- 前端工程实现建议
- 技术架构设计
- 接口设计

除非用户明确要求，否则不输出工程侧实现建议。

## 标准工作流

```text
需求 idea
→ 场景 / 用户 / 目标澄清
→ 页面范围和交互规则
→ Demo 方案
→ 用户确认实现
→ 创建需求目录和 Demo
→ 接入 Demo Hub
→ 生成评审 PRD
→ 记录 decision-log 和 version-log
→ 需要时更新操作文档和部署说明
```

## 讨论与实现边界

需求讨论阶段：
- 只讨论、澄清、总结和给建议。
- 不改代码。
- 不创建项目文件。

实现阶段：
- 只有用户明确说“实现”“开始实现”“继续执行”等授权后才进入。
- 实现前应说明将创建或修改哪些文件。

## 项目级文件

```text
CLAUDE.md
README.md
docs/workflow/00-overview.md
docs/workflow/prompt-cheatsheet.md
docs/workflow/demo-hub-guide.md
docs/workflow/versioning-guide.md
```

## 单个需求目录

推荐结构：

```text
demos/{demo-name}/
  README.md
  prd.md
  decision-log.md
  version-log.md
  demo/
  assets/
    screenshots/
    references/
```

## 切换模型或新会话时

先让模型读取：

```text
请先读取：
- docs/workflow/00-overview.md
- 当前需求目录下的 README.md、prd.md、decision-log.md、version-log.md

读取后先总结你理解到的上下文，再继续。
```

如果是新需求、还没有目录：

```text
这是一个新需求，目前还没有目录。
请先读取 docs/workflow/00-overview.md，然后只和我讨论需求，不要创建文件或改代码。
```
