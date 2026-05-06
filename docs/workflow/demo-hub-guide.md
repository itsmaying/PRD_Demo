# Demo Hub 查看与安装说明

## Demo Hub 是什么

Demo Hub 是手机端 Demo 入口页。打开后可以像 App 一样进入不同需求 Demo。

## 当前访问方式

当前统一预览入口由 `device-auth-poc/` 承载，首页可进入录音删除、设备鉴权和 OTA 手动升级三个 Demo。

本地开发访问：

```text
http://127.0.0.1:5173/
```

Cloudflare Pages 固定预览链接：

```text
https://prd-demo-hub.pages.dev
```

当前部署预览链接：

```text
https://21e8e81b.prd-demo-hub.pages.dev
```

## 手机添加到桌面

### iPhone / iPad

1. 用 Safari 打开 Demo Hub 链接。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 名称可设置为 `PRD Demo`。
5. 点击“添加”。

### Android

1. 用 Chrome 打开 Demo Hub 链接。
2. 点击右上角三个点菜单。
3. 选择“添加到主屏幕”或“安装应用”。
4. 名称可设置为 `PRD Demo`。
5. 点击“添加”。

## 当前限制

当前使用的是 Cloudflare Quick Tunnel：

- 电脑必须开着。
- Vite 开发服务必须运行。
- cloudflared 隧道必须运行。
- Quick Tunnel 链接可能在重启后变化。
- 适合临时演示，不适合长期固定分享。

## 后续推荐

如果要长期给同事使用，建议部署到：

- Vercel
- Cloudflare Pages

部署后可以获得固定链接，同事手机桌面入口无需频繁更换。
