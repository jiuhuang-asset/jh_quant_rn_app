# JH_QUANT_RN_APP — 移动端量化数据看板

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-~53.0.0-blue?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-~0.79.0-61dafb?logo=react)](https://reactnative.dev)
[![pnpm](https://img.shields.io/badge/pnpm-9+-orange?logo=pnpm)](https://pnpm.io)

</div>

> **jh_quant_rn_app** 是 [jh_quant](https://github.com/jiuhuang-asset/jh_quant) 的衍生移动端项目，提供随时随地查看量化交易数据的可视化看板。

---

## ⚠️ 前置条件

本项目**依赖远程数据库中的数据**方能正常使用。在使用本 App 之前，你必须：

1. 安装并配置 [jh_quant](https://github.com/jiuhuang-asset/jh_quant)
2. 使用 `jh_quant` 的 `sync` 命令将本地数据同步到远程数据库：

```bash
jh_quant sync
```

执行后，量化交易数据（会话、持仓、交易记录等）将被导入到 `REMOTE_DB_URL` 指定的数据库中，本 App 连上同一数据库即可读取和展示。

---

## 快速开始

### 环境要求

- **Node.js** ≥ 18
- **pnpm** ≥ 9
- **Expo Go** (手机端，从 App Store / Google Play 安装)

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 配置数据库连接

App 首次启动时会进入 Splash 配置页，在该页面输入你的远程数据库连接串（如 PostgreSQL 连接串），点击「测试连接」验证通过后即可进入主界面。连接串会安全保存在你的设备本地存储中，后续启动将自动连接。

> 无需在 `.env` 或环境变量中配置数据库 —— 一切在 App 内完成。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Expo 开发服务器 (等同于 `pnpm start`) |
| `pnpm start` | 启动 Expo 开发服务器 |
| `pnpm android` | 启动并连接 Android 模拟器 |
| `pnpm ios` | 启动并连接 iOS 模拟器 |
| `pnpm web` | 启动 Web 预览模式 |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |

---

## 在手机上安装使用

### 方式一：Expo Go（推荐，开发阶段）

1. 在手机上下载 **Expo Go**：
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. 确保手机和开发电脑在**同一 Wi-Fi** 下
3. 运行 `pnpm dev` 启动开发服务器
4. 用 Expo Go 扫描终端中显示的 **二维码**：
   - iOS：打开相机 App 扫描
   - Android：打开 Expo Go → "Scan QR code"
5. App 将自动加载，首次启动时在 Splash 页输入数据库连接串并测试通过后即可使用

### 方式二：构建独立安装包（生产阶段）

```bash
# Android (APK/AAB)
npx eas build --platform android --profile production

# iOS (IPA)
npx eas build --platform ios --profile production
```

构建完成后下载安装包到手机安装即可，无需 Expo Go。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Expo SDK 53 + React Native 0.79 |
| 路由 | Expo Router (文件系统路由) |
| 状态管理 | TanStack React Query |
| 数据库 | PostgreSQL (pg) |
| 图表 | react-native-gifted-charts |
| 语言 | TypeScript |

---

## 项目结构

```
jh_quant_rn/
├── app/              # Expo Router 页面 & API Routes
│   ├── (tabs)/       # Tab 导航页面 (看板/持仓/交易/设置)
│   ├── session/      # 会话详情页
│   └── api/          # API Routes (数据查询接口)
├── src/
│   ├── components/   # 可复用组件 (图表/卡片/表格/骨架屏)
│   ├── hooks/        # 自定义 Hooks (数据查询/预加载)
│   ├── lib/          # 核心库 (DB连接/API客户端/类型定义)
│   ├── theme/        # 主题配置 (颜色/间距/字体)
│   └── utils/        # 工具函数 & 常量
├── assets/           # 静态资源 (图片/字体)
├── .env.example      # 环境变量模板
└── app.json          # Expo 应用配置
```

---

## 相关链接

- [jh_quant](https://github.com/jiuhuang-asset/jh_quant) — 主项目，量化数据管理与同步
- [jiuhuang.xyz](https://jiuhuang.xyz) — 官方网站
- [Expo 文档](https://docs.expo.dev)

---

© 2026 JH_QUANT. Licensed under the [MIT License](LICENSE).
