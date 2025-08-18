# 底部导航栏图标

这个目录用于存放底部导航栏的图标文件。

## 所需图标

- `home.png` - 首页图标（未激活状态）
- `home-active.png` - 首页图标（激活状态）
- `accounting.png` - 记账图标（未激活状态）
- `accounting-active.png` - 记账图标（激活状态）
- `period.png` - 周期图标（未激活状态）
- `period-active.png` - 周期图标（激活状态）
- `more.png` - 更多图标（未激活状态）
- `more-active.png` - 更多图标（激活状态）

## 图标规范

- 尺寸：81px × 81px
- 格式：PNG
- 背景：透明
- 颜色：未激活状态使用 #999999，激活状态使用 #667eea

## 注意

目前为了避免启动错误，已在 app.json 中暂时移除了图标配置。
如需添加图标，请将图标文件放置在此目录下，然后在 app.json 的 tabBar 配置中添加 iconPath 和 selectedIconPath 字段。
