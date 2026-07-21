# DESIGN: JH_QUANT 跨端统一设计系统

| field | value |
| --- | --- |
| brand | **JH_QUANT** |
| tagline | 您的私人量化助手 |
| primary color | `#154587` (深海军蓝) |
| logo path | `assets/logo/` |
| target | iOS / Android / Web 三端统一的 UI/UX 设计规范 |
| version | v1 |
| date | 2026-07-20 |

---

## 0. 品牌标识 (Brand Identity)

### 0.1 Logo

Logo 位于 [assets/logo/](assets/logo/)，提供以下尺寸：

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `logo.png` | 原始尺寸 | 通用 |
| `logo_16x16.png` | 16×16 | Favicon |
| `logo_32x32.png` | 32×32 | 小图标 |
| `logo_48x48.png` | 48×48 | Tab 图标 |
| `logo_64x64.png` | 64×64 | 通知图标 |
| `logo_128x128.png` | 128×128 | App 图标 (小) |
| `logo_256x256.png` | 256×256 | App 图标 (大) |

**Logo 使用规则：**
- App 启动页/加载页：使用 `logo_256x256.png`，居中，背景色 `#154587`
- 导航栏/Header：使用 `logo_32x32.png`
- 关于页：使用 `logo_128x128.png`
- Logo 周围保留至少 1/4 logo 宽度的安全间距

### 0.2 品牌标语

```
JH_QUANT  —  您的私人量化助手
```

- 中文环境显示中文标语，英文环境显示 "Your Personal Quant Assistant"
- 标语字号比品牌名小一级，颜色使用 `gray-500`

---

## 1. 色彩系统 (Color Palette)

### 1.1 主色调

以品牌色 `#154587` 为基准生成完整调色板：

| Token | Hex | HSL | 用途 |
| --- | --- | --- | --- |
| `--color-primary-50` | `#E8F0FA` | hsl(213, 64%, 95%) | 浅色背景、选中态背景 |
| `--color-primary-100` | `#C5D8F0` | hsl(213, 58%, 86%) | 标签背景 |
| `--color-primary-200` | `#9DBFE6` | hsl(213, 55%, 76%) | 边框、分隔线 |
| `--color-primary-300` | `#72A3DB` | hsl(213, 52%, 65%) | 次要图标 |
| `--color-primary-400` | `#4A88D0` | hsl(213, 48%, 55%) | Hover 态按钮 |
| `--color-primary-500` | `#154587` | hsl(213, 73%, 31%) | **主色** — 主按钮、链接、活跃态 |
| `--color-primary-600` | `#113A6F` | hsl(213, 73%, 25%) | 按钮按下态 |
| `--color-primary-700` | `#0D2E58` | hsl(213, 73%, 20%) | 深色背景元素 |
| `--color-primary-800` | `#0A2342` | hsl(213, 73%, 15%) | 导航栏背景 |
| `--color-primary-900` | `#06172D` | hsl(213, 74%, 10%) | 深色模式背景 |

### 1.2 功能色

#### 涨跌色（默认红涨绿跌，符合 A 股习惯）

| Token | Hex | 用途 |
| --- | --- | --- |
| `--color-up` | `#DC2626` | 上涨 / 盈利 / 买入 |
| `--color-up-light` | `#FEE2E2` | 上涨背景 |
| `--color-down` | `#16A34A` | 下跌 / 亏损 / 卖出 |
| `--color-down-light` | `#DCFCE7` | 下跌背景 |

> **用户偏好设置**：提供开关切换「红涨绿跌 ↔ 绿涨红跌」(国际惯例)。图表、卡片、列表中的涨跌色统一响应此设置。

#### 语义色

| Token | Hex | 用途 |
| --- | --- | --- |
| `--color-success` | `#16A34A` | 成功 / 盈利 |
| `--color-warning` | `#F59E0B` | 警告 / 关注 |
| `--color-danger` | `#DC2626` | 危险 / 亏损 |
| `--color-info` | `#0EA5E9` | 信息 / 提示 |

### 1.3 中性色

| Token | Hex | 用途 |
| --- | --- | --- |
| `--color-gray-50` | `#F8FAFC` | 页面背景 |
| `--color-gray-100` | `#F1F5F9` | 卡片背景、区域分隔 |
| `--color-gray-200` | `#E2E8F0` | 边框、分割线 |
| `--color-gray-300` | `#CBD5E1` | 禁用态边框 |
| `--color-gray-400` | `#94A3B8` | 占位文字、禁用文字 |
| `--color-gray-500` | `#64748B` | 次要文字 |
| `--color-gray-600` | `#475569` | 正文辅助 |
| `--color-gray-700` | `#334155` | 正文 |
| `--color-gray-800` | `#1E293B` | 标题 |
| `--color-gray-900` | `#0F172A` | 重要标题、强调文字 |

### 1.4 图表色板 (DataViz Palette)

用于多组数据对比，与主色调和谐：

```
系列色:  #154587  #2E86AB  #A23B72  #F18F01  #C73E1D
         #6A994E  #386641  #BC4742  #264653  #E9C46A
```

区分度 ≥ 5:1，色盲友好（蓝-橙、绿-紫搭配）。

---

## 2. 字体系统 (Typography)

### 2.1 字体栈

```css
/* 中文友好字体栈 */
--font-sans: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
             'Noto Sans SC', system-ui, -apple-system,
             'Segoe UI', Roboto, sans-serif;
--font-mono: 'SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono',
             'Noto Sans Mono SC', monospace;
--font-number: 'DIN Alternate', 'SF Pro Display', 'PingFang SC',
               'Tabular Nums', monospace;  /* 等宽数字，用于表格和指标 */
```

### 2.2 字号阶梯 (Type Scale)

| Token | Size | Line Height | 用途 |
| --- | --- | --- | --- |
| `--text-xs` | 12px | 1.25 (15px) | 标签、注释、图表 micro-text |
| `--text-sm` | 14px | 1.4 (20px) | 表格正文、辅助信息、列表副标题 |
| `--text-base` | 16px | 1.5 (24px) | 正文、输入框、按钮 |
| `--text-lg` | 18px | 1.5 (27px) | 卡片标题、列表主标题 |
| `--text-xl` | 20px | 1.4 (28px) | 页面副标题、KPI 标签 |
| `--text-2xl` | 24px | 1.35 (32px) | 页面标题、Section Header |
| `--text-3xl` | 30px | 1.3 (39px) | 大数字指标 (如 +12.5%) |
| `--text-4xl` | 36px | 1.2 (43px) | Hero 数字、启动页 |

### 2.3 字重

| Token | Weight | 用途 |
| --- | --- | --- |
| `--font-normal` | 400 | 正文、表格、标签 |
| `--font-medium` | 500 | 列表标题、按钮文字、导航项 |
| `--font-semibold` | 600 | 卡片标题、指标标签、图表标题 |
| `--font-bold` | 700 | 页面标题、KPI 数值、重要强调 |

---

## 3. 间距系统 (Spacing)

基于 4px 栅格：

| Token | Px | 用途 |
| --- | --- | --- |
| `--space-1` | 4px | 图标与文字间距、紧密元素 |
| `--space-2` | 8px | 标签内边距、列表项内间距 |
| `--space-3` | 12px | 卡片内边距 (小)、按钮内边距 |
| `--space-4` | 16px | 卡片内边距 (标准)、列表项间距 |
| `--space-5` | 20px | Section 内间距 |
| `--space-6` | 24px | 页面水平边距、Section 间间距 |
| `--space-8` | 32px | 页面垂直间距、大模块分隔 |
| `--space-10` | 40px | 页面首尾留白 |
| `--space-12` | 48px | Hero 区域留白 |

---

## 4. 圆角 (Border Radius)

| Token | Value | 用途 |
| --- | --- | --- |
| `--radius-sm` | 6px | 标签、徽章、小按钮 |
| `--radius-md` | 10px | 卡片、输入框、标准按钮 |
| `--radius-lg` | 14px | 大卡片、模态框、图表容器 |
| `--radius-xl` | 20px | 底部弹出面板、图表卡片 |
| `--radius-full` | 9999px | 头像、药丸标签、圆角按钮 |

---

## 5. 阴影 (Shadows)

| Token | Value | 用途 |
| --- | --- | --- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 轻微层级区分（表格行） |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 卡片、图表容器 |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | 模态框、下拉面板、FAB |
| `--shadow-xl` | `0 8px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)` | 底部抽屉、通知弹窗 |

**暗色模式**：阴影在深色背景下透明度增加 2×（深色背景需要更强阴影才能感知层次）。

---

## 6. 动效 (Motion)

| Token | Duration | Easing | 用途 |
| --- | --- | --- | --- |
| `--duration-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 按钮点击、开关切换 |
| `--duration-normal` | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 页面切换、卡片展开、下拉出现 |
| `--duration-slow` | 400ms | `cubic-bezier(0.4, 0, 0, 1)` | 大区域展开、图表数据动画、启动过渡 |
| `--duration-chart` | 800ms | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 图表入场动画 (ease-out-quad) |

**原则：**
- 入场动画仅首屏触发一次，滚动到视口时不重复
- 图表数据更新时使用 `--duration-normal` 过渡
- 所有可点击区域的按压反馈使用 `--duration-fast`
- 列表滚动时禁用动效（性能优先）

---

## 7. 组件规范 (Component Patterns)

### 7.1 StatCard — 指标卡片

```
┌──────────────────────────┐
│  累计收益率            📈 │  ← icon + label (text-sm, gray-500)
│                        │
│  +35.82%               │  ← value (text-3xl, font-bold, up-color)
│                        │
│  ─────────────────────  │  ← sparkline / progress bar
│                        │
│  较年初 ↑12.3%          │  ← secondary stat (text-xs, gray-400)
└──────────────────────────┘
```

**设计规则：**
- 卡片宽度：最小 140px，弹性布局
- 内边距：`--space-4`
- 背景：`gray-50` / 暗色模式 `gray-800`
- 圆角：`--radius-md`
- 阴影：`--shadow-sm` → hover 时 `--shadow-md`
- 间距：卡片间 12px

**状态变体：**
| 状态 | 处理方式 |
| --- | --- |
| Loading | 骨架屏，灰色脉冲动画 |
| Error | 灰色底 + "加载失败" + 重试图标 |
| Empty | 灰色底 + "暂无数据" |
| 正值 | 数值色 `--color-up` |
| 负值 | 数值色 `--color-down` |

### 7.2 ChartCard — 图表卡片

```
┌──────────────────────────────────────┐
│  净值曲线                    1M 3M 1Y All │  ← title + 时间周期切换
│  ──────────────────────────────────── │
│                                      │
│  📈                                   │
│  │    ╱╲                             │
│  │   ╱  ╲    ╱╲                     │
│  │  ╱    ╲  ╱  ╲   ___             │
│  │ ╱      ╲╱    ╲_╱                │  ← 图表区 (高度 ≥ 220px)
│  │                                  │
│  ─────────────────────────────────── │
│  ── 净值  ── 回撤                  │  ← 图例
└──────────────────────────────────────┘
```

**设计规则：**
- 卡片高度：图表区 ≥ 220px，总高 ~320px
- 内边距：`--space-4` (图表区内边距 `--space-2`)
- 标题行：左侧标题 (text-lg, font-semibold)，右侧控制组
- 时间周期切换：Segmented Control 样式，选中态 `primary-500`
- 图表区：全宽，有独立横纵坐标轴

### 7.3 DataTable — 数据表格

```
┌──────────────────────────────────────────────┐
│  交易记录                          🔍 筛选  │
│  ──────────────────────────────────────────── │
│  日期 ▼    股票    方向  价格   数量   金额   │  ← 表头 (text-sm, font-medium, gray-500)
│  ──────────────────────────────────────────── │
│  07-18  600519  BUY  1580.0   200  316,000  │  ← 数据行 (text-sm)
│  07-18  000858  SELL  142.5   500   71,250  │
│  07-17  300750  BUY   210.3  1000  210,300  │
│  ...                                         │
│  ──────────────────────────────────────────── │
│              <  1 / 25  >                    │  ← 分页器
└──────────────────────────────────────────────┘
```

**设计规则：**
- 表头：sticky，底部 1px `gray-200` 分割线
- 行高：48px（单行），72px（双行）
- 奇数行背景：`transparent`，偶数行：`gray-50/5`（极浅交替色）
- 点击行：`primary-50` 高亮，→ 跳转详情
- BUY 行文字色 `--color-up`，SELL 行文字色 `--color-down`
- 数字列：等宽字体 `--font-number`，右对齐
- 移动端列数 > 4 时：前 3 列固定，其余横向滚动

### 7.4 PositionRow — 持仓行

```
┌──────────────────────────────────────────────────┐
│  600519  贵州茅台                          ↗     │
│  ───────────────────────────────────────────────│
│  持仓 200股  ·  成本 ¥1,580.00  ·  现价 ¥1,650.00│  ← 二级信息
│  ───────────────────────────────────────────────│
│  市值 ¥330,000    盈亏 +¥14,000    +4.43%       │  ← 三级信息 (盈亏着色)
│  ████████████████░░░░  权重 12.5%               │  ← 权重进度条
└──────────────────────────────────────────────────┘
```

**设计规则：**
- 单行高度：自适应（~100px）
- 背景：白色卡片，圆角 `--radius-md`，阴影 `--shadow-sm`
- 盈亏正数 `--color-up`，负数 `--color-down`
- 权重进度条：`primary-500`，背景 `gray-100`

### 7.5 EmptyState — 空状态

```
┌──────────────────────────────────┐
│                                  │
│            📭                    │  ← 图标 (48px, gray-300)
│                                  │
│       暂无数据                    │  ← 标题 (text-lg, gray-500)
│   请确认数据库连接正常后重试       │  ← 描述 (text-sm, gray-400)
│                                  │
│       [ 重新加载 ]               │  ← 按钮 (primary-500)
│                                  │
└──────────────────────────────────┘
```

### 7.6 ErrorState — 错误状态

```
┌──────────────────────────────────┐
│                                  │
│            ⚠️                    │
│                                  │
│       数据加载失败                │
│   无法连接到远程数据库            │
│                                  │
│       [ 重试 ]                   │
│                                  │
└──────────────────────────────────┘
```

### 7.7 Pull-to-Refresh

- 刷新指示器颜色：`primary-500`
- 下拉最小距离：80px
- 刷新动画：旋转 + 渐入

---

## 8. 布局规范 (Layout)

### 8.1 页面布局

```
┌──────────────────────────────┐
│  Status Bar (system)         │
├──────────────────────────────┤
│  Header / Nav Bar            │  ← 56px, primary-800 背景
├──────────────────────────────┤
│                              │
│  ┌──────────────────────┐   │
│  │ Session Selector      │   │  ← 可选 filter bar
│  └──────────────────────┘   │
│                              │
│  ┌─────────┐ ┌─────────┐   │
│  │ KPI 1   │ │ KPI 2   │   │  ← KPI 卡片行 (横向滚动)
│  └─────────┘ └─────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ Chart Card            │   │  ← 图表区
│  │                       │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │ Position List         │   │  ← 列表/表格区
│  │  ···                  │   │
│  └──────────────────────┘   │
│                              │
├──────────────────────────────┤
│  Tab Bar                     │  ← 56px, white / gray-900
├──────────────────────────────┤
│  Home Indicator (iOS)        │
└──────────────────────────────┘
```

### 8.2 栅格

- 移动端 (iPhone 14 Pro: 393×852)：1 列
- 平板 (iPad Pro 11": 834×1194)：2 列
- Web 端 (≥ 1024px)：最多 3 列

KPI 卡片「自适应列数」策略：
- 容器宽度 < 400px → 2 列横向滚动
- 400–700px → 2 列固定
- > 700px → 4 列固定

### 8.3 Safe Area

- 使用 `SafeAreaView` 确保避开刘海/底部指示器
- 水平安全边距：16px（移动端）、24px（平板）
- 列表内容底部留白 ≥ 100px（避开 Tab Bar）

---

## 9. 导航 (Navigation)

### 9.1 Tab Bar

```
┌──────────┬──────────┬──────────┬──────────┐
│    📊    │    💼    │    📋    │    ⚙️    │
│   总览    │   组合    │   交易    │   设置    │
└──────────┴──────────┴──────────┴──────────┘
```

- 高度：56px + safe area
- 背景：白色 (`white`) / 暗色模式 (`gray-900`)
- 选中态：icon `primary-500` + label `primary-500` (font-medium)
- 未选中态：icon `gray-400` + label `gray-400`
- 选中态上方 3px `primary-500` 指示线

### 9.2 Stack 导航

- 从列表 → 详情页：标准 push 动画（iOS 从右滑入，Android 从下往上）
- 返回按钮：左箭头 + 页面标题缩写
- 手势返回：iOS 边缘右滑、Android 系统返回键

---

## 10. 数据可视化规范 (DataViz Standards)

### 10.1 图表类型选择

| 数据类型 | 图表类型 | 说明 |
| --- | --- | --- |
| 时序 — 净值曲线 | 面积图 (Area) | 填充色 `primary-200` 20% 透明度，线色 `primary-500` |
| 时序 — 回撤 | 柱状图 (Bar) | 负值向下，色 `--color-down-light` 边框 `--color-down` |
| 时序 — 多系列对比 | 折线图 (Line) | 使用 1.4 图表色板，2px 线宽 |
| 构成 — 持仓比例 | 环形图 (Donut) | 中间显示总市值，外圈 ≤ 6 段 + "其他"合并 |
| 构成 — 盈亏来源 | 水平柱状图 | 正值向右 (`--color-up`)，负值向左 (`--color-down`) |
| 分布 — 月度收益 | 热力图 (Heatmap) | 色阶从 `--color-down` → `white` → `--color-up` |
| 比较 — 交易活跃度 | 分组柱状图 | BUY/SELL 双色，`--color-up` / `--color-down` |
| 迷你 — Sparkline | 无轴折线 | 42px 高，2px 线宽，无坐标轴和数据点，纯趋势 |

### 10.2 图表交互

- **Tooltip**：长按/悬停时显示，带日期+数值，背景 `gray-900` 90% 不透明度，白色文字
- **Zoom**：双指捏合缩放（移动端），滚轮缩放（Web）
- **Period Switch**：1M / 3M / 6M / 1Y / ALL，切换时图表做过渡动画
- **Legend Click**：点击图例切换系列显隐

### 10.3 坐标轴

- X 轴：时间轴，自动间隔标注（月份/季度切换），标签 `text-xs`, `gray-400`
- Y 轴：左轴 净值/金额，右轴 百分比（如需要双轴），标签 `text-xs`, `gray-400`
- 网格线：水平虚线 `gray-200`，2px 间隔，0.5px 宽
- 零线：实线 `gray-300`，1px 宽

---

## 11. 暗色模式 (Dark Mode)

### 11.1 色彩映射

| 浅色 Token | 暗色值 | 规则 |
| --- | --- | --- |
| `gray-50` (页面背景) | `#0F172A` (`gray-900`) | bg ↔ 最深色 |
| `gray-100` (卡片/区域背景) | `#1E293B` (`gray-800`) | surface ↔ 次深色 |
| `white` | `#0F172A` | 纯白 ↔ 纯黑背景 |
| `gray-900` (标题) | `#F8FAFC` (`gray-50`) | 文字 ↔ 最浅色 |
| `gray-700` (正文) | `#CBD5E1` (`gray-300`) | 正文反转 |
| `primary-500` | `#4A88D0` (`primary-400`) | 主色调微提亮 |
| 阴影 | 透明度 × 2 | 深色背景需要更深阴影 |

### 11.2 切换方式

- 默认跟随系统 `Appearance.getColorScheme()`
- 设置页提供手动切换: 跟随系统 / 浅色 / 暗色
- 切换使用 `--duration-normal` 颜色过渡

---

## 12. 无障碍 (Accessibility)

- 最小触摸区域：44×44px（iOS HIG）/ 48×48dp（Android Material）
- 颜色对比度：文字/背景 ≥ 4.5:1（WCAG AA）
- 图表数据：除颜色外使用图例/标签区分系列（色盲友好）
- 支持 Dynamic Type / 字体缩放（最大 1.5×）
- 读屏器标签：所有图标按钮需 `accessibilityLabel`

---

## 13. 图标 (Iconography)

- 推荐图标集：**Ionicons** (`@expo/vector-icons`)
- 系统/导航图标：24px，`gray-500` / 选中 `primary-500`
- 卡片内图标：20px，`gray-400`
- 按钮内图标：18px，与文字同色
- KPI 趋势小箭头：14px，与涨跌色同步

常用图标映射：

| 场景 | Ionicons name |
| --- | --- |
| 总览/Dashboard | `grid` / `stats-chart` |
| 组合/Portfolio | `briefcase` |
| 交易/Trades | `swap-horizontal` |
| 设置/Settings | `settings` |
| 上涨 | `trending-up` |
| 下跌 | `trending-down` |
| 刷新 | `refresh` |
| 搜索 | `search` |
| 筛选 | `funnel` |

---

## 14. 实现参考 (Implementation Tokens)

### 14.1 Tailwind (Web) / StyleSheet (RN) 公共 Token

```typescript
// apps/mobile/src/theme/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#E8F0FA', 100: '#C5D8F0', 200: '#9DBFE6',
      300: '#72A3DB', 400: '#4A88D0', 500: '#154587',
      600: '#113A6F', 700: '#0D2E58', 800: '#0A2342', 900: '#06172D',
    },
    up: '#DC2626',       upLight: '#FEE2E2',
    down: '#16A34A',     downLight: '#DCFCE7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: { primary: '#0F172A', secondary: '#334155', tertiary: '#64748B' },
    border: '#E2E8F0',
  },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  radius: { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 },
  fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 },
  fontFamily: {
    sans: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif",
    mono: "'SF Mono', 'JetBrains Mono', 'Noto Sans Mono SC', monospace",
    number: "'DIN Alternate', 'SF Pro Display', 'PingFang SC', 'Tabular Nums', monospace",
  },
  shadow: {
    sm: { shadowColor: '#000', shadowOffset: { w:0, h:1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { w:0, h:2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
    lg: { shadowColor: '#000', shadowOffset: { w:0, h:4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
  },
}
```

### 14.2 文件

本设计系统的所有视觉参考统一在此文档中。App 中的 `src/theme/theme.ts` 文件为本规范的 TS 实现入口。

---

## 15. 参考截图/原型

> 此节在 UI 原型开发完成后补充，记录关键页面的屏幕截图链接。
