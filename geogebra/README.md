# GeoGebra 离线部署

这是一个完整的 GeoGebra 离线部署方案，基于官方的 GeoGebra Math Apps Bundle 实现。

## 📁 文件结构

```
d:/geogebra/
├── GeoGebra/                          # GeoGebra 官方资源包
│   ├── deployggb.js                   # 引导加载脚本
│   └── HTML5/5.0/web3d/              # 核心代码库
├── geogebra-offline.html              # 主导航页面
├── index.html                         # 经典版 GeoGebra
├── graphing-calculator.html           # 图形计算器
├── geometry.html                      # 几何工具
├── 3d-calculator.html                 # 3D 计算器
├── start-server.py                    # Python 测试服务器
├── start-server.bat                   # Windows 启动脚本
└── README.md                          # 说明文档
```

## 🚀 快速开始

### 方法一：使用 Python 服务器（推荐）

1. 确保已安装 Python 3.x
2. 双击运行 `start-server.bat`（Windows）或执行 `python start-server.py`
3. 浏览器会自动打开 http://localhost:8000/geogebra-offline.html
4. 选择需要的 GeoGebra 应用类型

### 方法二：部署到 Web 服务器

1. 将整个文件夹上传到您的 Web 服务器
2. 确保 `GeoGebra` 文件夹的路径正确
3. 访问 `geogebra-offline.html` 页面

## 🎯 应用类型

| 应用 | 文件 | 描述 |
|------|------|------|
| 经典版 | `index.html` | 包含所有功能的完整版本 |
| 图形计算器 | `graphing-calculator.html` | 专门用于函数图形绘制 |
| 几何工具 | `geometry.html` | 专注于几何图形构造 |
| 3D 计算器 | `3d-calculator.html` | 用于三维图形和立体几何 |

## ✅ 离线验证

要验证应用是否真正离线运行：

1. 断开网络连接
2. 清除浏览器缓存
3. 刷新页面并启动任意应用
4. 如果应用正常加载，说明离线部署成功

## 🔧 技术要点

### 核心配置

每个 HTML 文件都包含以下关键配置：

```javascript
// 创建 GeoGebra Applet 实例
var applet = new GGBApplet(params, true);

// 设置本地代码库路径（核心步骤）
applet.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');

// 注入应用
applet.inject('ggb-element');
```

### 路径说明

- `GeoGebra/deployggb.js` - 本地引导脚本
- `GeoGebra/HTML5/5.0/web3d/` - 核心代码库路径
- 路径末尾的 `/` 是必需的

## 🌐 浏览器支持

- ✅ Chrome
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ 其他现代浏览器

## 📋 部署检查清单

- [x] 下载并解压 GeoGebra Math Apps Bundle
- [x] 上传完整的 `GeoGebra` 文件夹到服务器
- [x] 修改 HTML 中的脚本引用路径
- [x] 调用 `setHTML5Codebase()` 设置本地代码库
- [x] 测试离线环境下的运行情况

## 🔗 相关链接

- [GeoGebra Math Apps Bundle 下载](https://download.geogebra.org/package/geogebra-math-apps-bundle)
- [GeoGebra 官方文档](https://geogebra.github.io/docs/)
- [GeoGebra Apps API](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/)

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. 浏览器开发者工具的网络选项卡，查看是否有 404 错误
2. `setHTML5Codebase()` 方法的路径是否正确
3. `GeoGebra` 文件夹是否完整上传

## 🎉 部署成功标志

当您看到以下情况时，说明部署成功：

- ✅ 所有 HTML 页面都能正常打开
- ✅ GeoGebra 应用能够完全加载
- ✅ 在断网状态下应用仍能正常运行
- ✅ 清除浏览器缓存后应用仍能正常工作

---

**版本**: 1.0  
**更新时间**: 2025年10月28日  
**基于**: GeoGebra Math Apps Bundle 官方资源包
