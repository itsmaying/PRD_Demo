# 版本管理说明

## 为什么需要版本管理

一个需求 Demo 可能会经历多轮迭代。版本管理用于记录：

- 每一版改了什么
- 哪一版已经给同事看过
- 哪一版进入需求评审
- 哪些决策发生过变化

## 单个 Demo 的版本文件

每个需求目录下使用：

```text
version-log.md
```

记录版本变化。

## 推荐版本格式

```md
## v0.1 - YYYY-MM-DD

### 变更
- 完成初版交互 Demo。
- 接入 Demo Hub。

### 状态
- 可手机演示
- 未正式评审

### 备注
- 后续待确认……
```

## 版本命名建议

- `v0.1`：初版探索 Demo
- `v0.2`：交互调整版
- `v0.3`：评审前整理版
- `v1.0`：评审确认版

## Git 使用建议

每次形成一个阶段性版本后，建议提交一次 git commit。

commit 信息可写：

```text
Add audio delete demo v0.1
```

或：

```text
Update audio delete interaction for review
```

## 注意

版本记录关注产品侧变化，不需要记录工程实现细节。
