# 图片资源目录

这个目录用于存放小程序的图片资源。

## 目录结构

```
images/
├── tab/                    # 底部导航栏图标
│   ├── home.png           # 首页图标
│   ├── home-active.png    # 首页激活图标
│   ├── accounting.png     # 记账图标
│   ├── accounting-active.png # 记账激活图标
│   ├── period.png         # 经期图标
│   ├── period-active.png  # 经期激活图标
│   ├── more.png           # 更多图标
│   └── more-active.png    # 更多激活图标
├── icons/                 # 功能图标
├── avatars/              # 头像图片
└── default-avatar.png    # 默认头像
```

## 图标规范

### 底部导航栏图标
- 尺寸：81px × 81px
- 格式：PNG
- 背景：透明
- 颜色：未激活状态使用灰色，激活状态使用主题色

### 功能图标
- 尺寸：根据使用场景调整
- 格式：PNG/SVG
- 背景：透明

## 注意事项

1. 所有图片资源都应该进行压缩优化
2. 支持多倍图，建议提供 @2x 和 @3x 版本
3. 图片命名使用小写字母和连字符
4. 避免使用中文文件名
