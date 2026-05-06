# OTA / 鉴权源码交接说明

## 1. 目的
本文用于给开发快速说明：
- 当前可运行 Demo 的源码在哪里
- OTA 和鉴权分别对应哪些代码
- Demo 怎么本地跑起来
- 演示场景怎么切换
- 开发看源码时应该先从哪里进入

## 2. 当前源码总体情况
当前可运行 Demo 只有一套，目录为：

`device-auth-poc/`

虽然目录名是 `device-auth-poc`，但这套 Demo 实际同时承载了：
- 设备鉴权演示
- OTA 升级演示

也就是说：
- **鉴权不是一套独立源码 + OTA 另一套独立源码**
- 而是**同一个 React Demo 里通过场景模式切换**来分别演示两条产品链路

## 3. 开发应拿哪些文件
如果只需要“可运行代码”，建议给开发整个目录：

```text
device-auth-poc/
├── src/
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
└── eslint.config.js
```

不必附带：
- `README.md`
- `prd.md`
- `decision-log.md`
- `version-log.md`
- `dist/`
- `node_modules/`
- `assets/`（项目根目录下的演示素材目录）

## 4. 本地运行方式
在 `device-auth-poc/` 目录下执行：

```bash
npm install
npm run dev
```

默认是 Vite 开发环境。
启动后按终端提示打开本地地址即可查看 Demo。

如果需要打包验证：

```bash
npm run build
npm run preview
```

## 5. 代码入口怎么看
### 5.1 应用入口
- `device-auth-poc/src/main.jsx`
  - React 挂载入口
- `device-auth-poc/src/App.jsx`
  - 顶层组件
  - 默认把 `demoMode` 设为 `ota`

关键代码：
- `device-auth-poc/src/App.jsx:5`

```jsx
const [demoMode, setDemoMode] = useState('ota')
```

这里决定默认打开 Demo 时先进入 OTA 模式还是鉴权模式。

### 5.2 主体演示组件
- `device-auth-poc/src/DeviceAuthDemo.jsx`

这是整个 Demo 的核心文件，OTA 和鉴权两条链路都在这里。
开发如果要看逻辑，优先读这个文件。

## 6. Demo 怎么切
Demo 内置了一个顶部场景条，可以直接切换：
- `鉴权`
- `OTA`

对应代码在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:125`
- `device-auth-poc/src/DeviceAuthDemo.jsx:131`
- `device-auth-poc/src/DeviceAuthDemo.jsx:137`

其中：
- `鉴权` 对应 `demoModes.auth`
- `OTA` 对应 `demoModes.ota`

相关定义在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:23`

```jsx
const demoModes = {
  auth: 'auth',
  ota: 'ota',
}
```

如果开发想直接改默认模式，可以改：
- `device-auth-poc/src/App.jsx:5`

把：

```jsx
const [demoMode, setDemoMode] = useState('ota')
```

改成：

```jsx
const [demoMode, setDemoMode] = useState('auth')
```

## 7. 鉴权源码怎么看
## 7.1 鉴权场景定义
鉴权场景都定义在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:62`

包括这些场景：
- 鉴权-设备页通过
- 鉴权-设备页未授权
- 鉴权-SN获取失败
- 鉴权-服务端未完成
- 鉴权-首页已连通过
- 鉴权-首页已连未授权
- 鉴权-租户未开启
- 鉴权-本机缓存命中

这些场景通过 `authScenarios` 数组控制。

## 7.2 鉴权结果文案
鉴权失败弹窗文案定义在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:85`

```jsx
const modalContent = {
  unauthorized: '当前设备未授权，请联系管理员',
  sn-missing: '当前无法识别设备，请重新连接后重试',
  service-pending: '当前无法完成设备验证，请稍后重试',
}
```

## 7.3 鉴权流程核心逻辑
鉴权结果落页面和弹窗的核心逻辑在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:547`

即 `presentOutcome` 方法。

它控制：
- 租户未开启时直接通过
- 缓存命中时直接通过
- 校验通过时直接展示已连接
- 校验失败时弹出失败弹窗

## 7.4 鉴权链路页面流转
鉴权相关页面状态定义在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:13`

主要会经过：
- `home`
- `setup`
- `bluetooth`
- `connected`

进入逻辑主要在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:710`

即 `handleOpenEarbud`。

蓝牙连接后的自动结果推进在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:637`

这里用 `setTimeout` 模拟连接完成后进入鉴权结果。

## 7.5 鉴权页面组件
主要页面组件：
- 首页：`HomePage` `device-auth-poc/src/DeviceAuthDemo.jsx:189`
- 配对引导页：`SetupPage` `device-auth-poc/src/DeviceAuthDemo.jsx:223`
- 蓝牙连接页：`BluetoothPage` `device-auth-poc/src/DeviceAuthDemo.jsx:256`
- 连接成功页：`ConnectedPage` `device-auth-poc/src/DeviceAuthDemo.jsx:312`
- 失败弹窗：`FailureModal` `device-auth-poc/src/DeviceAuthDemo.jsx:160`

## 8. OTA 源码怎么看
## 8.1 OTA 场景定义
OTA 场景定义在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:73`

包括：
- OTA-已是最新版本
- OTA-升级成功
- OTA-耳机占用中
- OTA-连接异常
- OTA-未放盒内或盒盖未开
- OTA-网络异常
- OTA-电量不足
- OTA-暂时无法升级
- OTA-升级失败

这些场景通过 `otaScenarios` 数组切换。

## 8.2 OTA 阻断文案
升级前 Bottom Sheet 的标题和副标题在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:91`

即 `otaBlockContent`。

这里定义了：
- 耳机占用中
- 连接异常
- 电量不足
- 未放盒内 / 盒盖未开启
- 网络异常
- 暂时无法升级

## 8.3 OTA 链路页面
OTA 主要页面包括：
- 设备连接页中的固件入口：`ConnectedPage` `device-auth-poc/src/DeviceAuthDemo.jsx:312`
- 升级说明页：`OtaDetailPage` `device-auth-poc/src/DeviceAuthDemo.jsx:403`
- 升级中页：`OtaProgressPage` `device-auth-poc/src/DeviceAuthDemo.jsx:469`
- 升级结果页：`OtaResultPage` `device-auth-poc/src/DeviceAuthDemo.jsx:505`
- 升级前阻断弹层：`BottomSheet` `device-auth-poc/src/DeviceAuthDemo.jsx:174`

## 8.4 OTA 启动升级逻辑
点击“开始升级”后的核心逻辑在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:573`

即 `startOtaUpgrade`。

这里控制两类结果：
1. 如果当前场景是阻断类场景，弹 Bottom Sheet
2. 如果可升级，进入升级中页

## 8.5 OTA 进度与成功/失败模拟
OTA 进度推进逻辑在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:647`

这里通过 `setTimeout` 模拟：
- 准备中
- 升级中
- 成功结果页
- 失败结果页

成功完成后返回设备页并刷新版本号的逻辑在：
- `device-auth-poc/src/DeviceAuthDemo.jsx:690`

即 `handleOtaDone`。

## 8.6 OTA 入口怎么进
在 OTA 模式下：
1. 先进入已连接页
2. 点击“固件版本”这一行
3. 进入 OTA 详情页
4. 点击“开始升级”
5. 按当前场景进入阻断提示 / 升级中 / 结果页

相关代码在：
- 固件入口点击：`device-auth-poc/src/DeviceAuthDemo.jsx:701`
- 设备页固件行：`device-auth-poc/src/DeviceAuthDemo.jsx:353`

## 9. 样式和资源怎么看
### 9.1 主要样式文件
- 主体页面样式：`device-auth-poc/src/AudioDeleteDemo.css`
- 外层应用样式：`device-auth-poc/src/App.css`
- 全局样式：`device-auth-poc/src/index.css`

虽然文件名叫 `AudioDeleteDemo.css`，但当前实际承载了这套 OTA / 鉴权 Demo 的主要样式。

### 9.2 图标文件
- `device-auth-poc/src/icons.jsx`

页面里用到的大部分图标组件都定义在这里。

### 9.3 静态资源
- `device-auth-poc/public/assets/`
- `device-auth-poc/public/reference/`
- `device-auth-poc/public/favicon.svg`
- `device-auth-poc/public/icons.svg`

## 10. 开发快速阅读顺序
建议开发按这个顺序看：

1. `device-auth-poc/src/App.jsx`
2. `device-auth-poc/src/DeviceAuthDemo.jsx`
3. 先看 `demoModes`、`authScenarios`、`otaScenarios`
4. 再看页面状态 `pages`
5. 再看：
   - 鉴权：`presentOutcome`、`handleOpenEarbud`
   - OTA：`startOtaUpgrade`、OTA progress 的 `useEffect`、`handleOtaDone`
6. 最后再看 `AudioDeleteDemo.css`

## 11. 给开发时要特别说明的一句话
当前 OTA 和鉴权不是分开的两个前端工程，而是同一个 React Demo 中通过场景模式切换展示的两条链路；开发如需拆分实现，请以 `DeviceAuthDemo.jsx` 中的场景定义、页面状态和结果流转为参考。
