# 薄荷生活 - 智能生活助手小程序

一款专为女性设计的智能生活助手小程序，提供记账、经期管理等功能，让生活更精致。

## 功能特性

### 🏠 首页
- 欢迎区域展示
- 本月收支概览
- 经期信息卡片
- 快捷记账操作
- 最近交易记录

### 💰 智能记账
- 收入/支出记录
- 多种分类选择
- 时间筛选（今日/本月/本年）
- 图表统计分析
- 交易记录管理

### 🌸 健康周期
- 日历视图展示
- 经期记录和预测
- 排卵期计算
- 症状记录
- 健康统计分析

### ⚙️ 更多功能
- 用户资料管理
- 数据统计查看
- 设置选项
- 意见反馈

## 技术架构

### 前端框架
- 微信小程序原生开发
- TypeScript 类型支持
- 模块化组件设计

### 数据存储
- 本地存储（wx.storage）
- 数据持久化
- 导入导出功能

### 工具库
- 日期时间处理
- 数据格式化
- 经期计算算法
- 存储管理

## 项目结构

```
miniprogram/
├── app.json                # 小程序配置
├── app.ts                  # 小程序入口
├── app.wxss               # 全局样式
├── sitemap.json           # 站点地图
├── pages/                 # 页面目录
│   ├── home/              # 首页
│   ├── accounting/        # 记账页面
│   ├── period/            # 经期页面
│   └── more/              # 更多页面
├── utils/                 # 工具库
│   ├── util.ts            # 通用工具函数
│   ├── storage.ts         # 存储管理
│   └── period.ts          # 经期计算
├── images/                # 图片资源
└── README.md              # 项目说明
```

## 页面说明

### 首页 (pages/home/)
- **home.wxml**: 页面结构，包含欢迎区域、统计卡片、快捷操作
- **home.wxss**: 页面样式，渐变背景、卡片设计
- **home.ts**: 页面逻辑，数据加载、交易记录、弹窗管理
- **home.json**: 页面配置

### 记账页面 (pages/accounting/)
- **accounting.wxml**: 记账界面，筛选标签、图表、交易列表
- **accounting.wxss**: 记账样式，图表设计、列表布局
- **accounting.ts**: 记账逻辑，数据统计、分类管理、表单处理
- **accounting.json**: 页面配置

### 经期页面 (pages/period/)
- **period.wxml**: 经期界面，日历组件、统计信息、记录表单
- **period.wxss**: 经期样式，日历布局、状态标识
- **period.ts**: 经期逻辑，日历生成、预测计算、记录管理
- **period.json**: 页面配置

### 更多页面 (pages/more/)
- **more.wxml**: 功能中心，用户信息、模块展示、设置选项
- **more.wxss**: 更多样式，模块卡片、设置列表
- **more.ts**: 更多逻辑，用户管理、数据统计、设置功能
- **more.json**: 页面配置

## 数据模型

### 用户信息 (UserInfo)
```typescript
interface UserInfo {
  nickName: string        // 昵称
  avatarUrl: string      // 头像URL
  birthday: string       // 生日
  signature: string      // 个性签名
  updatedAt: string      // 更新时间
}
```

### 交易记录 (Transaction)
```typescript
interface Transaction {
  id: string | number     // 唯一标识
  type: 'income' | 'expense'  // 类型：收入/支出
  amount: number         // 金额
  category: string       // 分类
  categoryName: string   // 分类名称
  icon: string          // 图标
  note: string          // 备注
  date: string          // 日期
  createdAt: string     // 创建时间
}
```

### 经期记录 (PeriodRecord)
```typescript
interface PeriodRecord {
  id: string | number     // 唯一标识
  startDate: string      // 开始日期
  endDate: string        // 结束日期
  flow: string          // 流量等级
  note: string          // 备注
  createdAt: string     // 创建时间
}
```

## 核心功能实现

### 经期预测算法
- 基于历史数据计算平均周期长度
- 预测下次经期开始时间
- 计算排卵期和易孕期
- 智能学习用户周期规律

### 数据统计分析
- 收支分类统计
- 月度/年度趋势分析
- 经期规律分析
- 健康指标计算

### 本地数据管理
- 数据持久化存储
- 增量更新机制
- 数据导入导出
- 隐私保护

## 设计特色

### 视觉设计
- 渐变色彩搭配
- 圆角卡片设计
- 柔和阴影效果
- 响应式布局

### 交互体验
- 流畅的页面切换
- 直观的操作反馈
- 友好的错误提示
- 便捷的快捷操作

### 用户体验
- 简洁的界面设计
- 清晰的信息层级
- 智能的数据预测
- 贴心的功能提醒

## 开发说明

### 环境要求
- 微信开发者工具
- Node.js 环境
- TypeScript 支持

### 运行步骤
1. 使用微信开发者工具打开项目
2. 配置小程序 AppID
3. 编译运行项目
4. 在模拟器或真机上测试

### 注意事项
- 确保所有页面路径在 app.json 中正确配置
- 图片资源需要放置在 images 目录下
- 本地存储数据在开发工具中可能会被清除

## 版本信息

- **版本**: v1.0.0
- **更新时间**: 2024年1月
- **开发团队**: 薄荷生活团队

## 联系我们

如有任何问题或建议，请通过以下方式联系我们：
- 邮箱：feedback@minlife.com
- 微信：MinLifeApp

---

© 2024 薄荷生活团队 保留所有权利
