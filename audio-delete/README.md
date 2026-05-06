# 录音删除管理

## 当前状态

- 状态：可手机演示
- 当前版本：v0.1
- Demo Hub：已接入
- PRD：已整理评审版
- 决策记录：已整理初版

## 需求目标

支持用户清理未关联录音，同时避免误删已关联客户或业务记录的录音。

## 文件说明

```text
README.md        # 当前需求说明
prd.md           # 评审用 PRD
decision-log.md  # 决策记录
version-log.md   # 版本记录
src/             # 可运行 Demo 源码
assets/          # 截图、参考图、素材 (待恢复)
```

## 开发与访问

本地开发访问：

```bash
cd audio-delete
npm install
npm run dev
```

## 当前 Demo 覆盖范围

- 录音列表页 (全部/已关联/未关联)
- 左滑进入批量管理
- 批量删除 / 单条重命名
- 统一删除确认弹窗
- 详情页删除交互
- Toast 反馈

## 移动端交接参考

- `handoff/AudioDeleteHandoff.jsx`：单文件交互参考实现，适合安卓 / iOS 按页面状态和交互规则翻译。
- `handoff/handoff-note.md`：交付说明，概括交付目标、阅读顺序和必须保持一致的规则。
- 交付目录保留列表页、编辑模式、详情页、删除确认、重命名、Toast 等完整状态流转，便于快速阅读逻辑。
