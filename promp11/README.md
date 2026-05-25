# 运营活动模板 (Vue2 + TypeScript)

基于 Vue2 + TypeScript 实现的运营活动模板，包含 H5 活动页面和后台管理配置页面，前后端分离架构。

## 项目结构

```
promp11/
├── h5/                  # H5活动页面（前端）
│   ├── src/
│   │   ├── components/  # H5组件
│   │   │   ├── HeaderImage.vue         # 头图组件
│   │   │   ├── RuleModal.vue           # 规则弹窗
│   │   │   ├── GiftArea.vue            # 活动礼物区域
│   │   │   ├── GameButtons.vue         # 玩法按钮
│   │   │   ├── Lottery.vue             # 九宫格抽奖
│   │   │   ├── LotteryResultModal.vue  # 中奖弹窗
│   │   │   └── Ranking.vue             # 榜单页面
│   │   ├── api/         # API接口层
│   │   ├── types/       # TypeScript类型定义
│   │   ├── views/       # 页面视图
│   │   └── router/      # 路由配置
│   └── package.json
├── admin/              # 后台管理页面（前端）
│   ├── src/
│   │   ├── components/ # 后台配置组件
│   │   │   ├── HeaderConfig.vue   # 头图配置
│   │   │   ├── GiftConfig.vue     # 礼物配置
│   │   │   ├── GameConfig.vue     # 玩法配置
│   │   │   ├── LotteryConfig.vue  # 抽奖配置
│   │   │   └── RankingConfig.vue  # 榜单配置
│   │   ├── api/       # API接口层
│   │   ├── types/     # TypeScript类型定义
│   │   ├── views/     # 页面视图
│   │   └── router/    # 路由配置
│   └── package.json
└── api-server/        # Mock API服务（后端模拟）
    ├── server.js      # Express服务器
    ├── mock/data.json # 模拟数据
    └── package.json
```

## 功能特性

### H5 页面
1. **头图区域**
   - 支持后台配置头图图片（尺寸 750×1000px）
   - 头图上显示大标题文案
   - 右下角"规则"按钮，点击弹出规则弹窗
   - 右下角"奖励"按钮，跳转至后台配置的链接

2. **活动礼物区域**
   - 后台配置活动礼物列表
   - 礼物区域背景可配置（尺寸 750×500px）
   - 横向自适应显示礼物
   - 礼物过多时自动从右向左滚动

3. **玩法按钮区**
   - 后台可配置玩法组合：抽奖+榜单、仅抽奖、仅榜单
   - 按钮名称可后台配置
   - 根据配置动态显示/隐藏

4. **九宫格抽奖**
   - 背景图可配置（尺寸 750×900px）
   - 格子默认/选中背景可配置
   - 抽奖按钮文案可配置
   - 抽奖次数可选（后台配置：单抽/十连抽/50抽等）
   - 九宫格动画效果
   - 根据概率随机中奖
   - 中奖弹窗汇总显示（重复奖品合并显示数量）

5. **榜单页面**
   - 支持收礼榜/送礼榜（后台配置）
   - 列表显示头像、昵称、积分
   - 前三名特殊样式

### 后台管理页面
1. **头图配置**：头图图片、标题、规则文案、奖励链接
2. **礼物配置**：背景图、礼物列表（图片/名称/积分）
3. **玩法配置**：玩法组合、按钮名称
4. **抽奖配置**：背景图、格子样式、按钮文案、抽奖次数、奖品列表
5. **榜单配置**：榜单类型（收礼/送礼）

## 技术栈

- **前端框架**: Vue 2.7 + TypeScript
- **路由**: Vue Router 3
- **样式**: SCSS
- **构建工具**: Vue CLI 5
- **后端模拟**: Express.js

## 快速开始

### 1. 安装依赖

```bash
# 安装 API 服务依赖
cd api-server && npm install

# 安装 H5 页面依赖
cd ../h5 && npm install

# 安装后台管理页面依赖
cd ../admin && npm install
```

### 2. 启动服务

```bash
# 启动 Mock API 服务 (端口 3001)
cd api-server && npm start

# 启动 H5 页面开发服务器 (端口 8080)
cd h5 && npm run serve

# 启动后台管理页面开发服务器 (端口 8081)
cd admin && npm run serve
```

### 3. 访问页面

- H5 活动页面: http://localhost:8080
- 后台管理页面: http://localhost:8081
- API 服务: http://localhost:3001

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/activity/config` | GET | 获取活动配置（H5端） |
| `/api/admin/activity/config` | GET | 获取活动配置（后台端） |
| `/api/admin/activity/config` | POST | 保存活动配置 |
| `/api/activity/draw` | POST | 执行抽奖 |
| `/api/activity/ranking` | GET | 获取榜单数据 |
| `/api/admin/activity/ranking` | GET | 获取榜单数据（后台） |

## 类型定义

核心类型定义在 `types/index.ts` 中：

- `ActivityConfig` - 活动配置整体结构
- `GiftItem` - 活动礼物
- `LotteryConfig` - 抽奖配置
- `LotteryPrize` - 奖品信息
- `RankingConfig` - 榜单配置
- `RankingItem` - 榜单条目

## 九宫格布局

```
┌───┬───┬───┐
│ 0 │ 1 │ 2 │
├───┼───┼───┤
│ 7 │ 4 │ 3 │
├───┼───┼───┤
│ 6 │ 5 │ 8 │
└───┴───┴───┘
```

位置 4 为抽奖按钮，其余 8 个位置为奖品格。

## 构建部署

```bash
# 构建 H5 页面
cd h5 && npm run build

# 构建后台管理页面
cd admin && npm run build
```

构建产物在 `dist/` 目录下，可部署到静态服务器。
