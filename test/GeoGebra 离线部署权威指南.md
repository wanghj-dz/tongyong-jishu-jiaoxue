# GeoGebra 离线部署权威指南

## 概述

本指南详细介绍了如何在网页中实现 GeoGebra 应用的完全离线部署，使其能够在没有互联网连接的环境下稳定运行。通过本指南，您将学会如何下载、配置和部署 GeoGebra Math Apps Bundle，彻底解决因网络问题导致的 GeoGebra 应用显示空白的问题。

---

## 一、核心概念：为何需要离线部署包？

要理解离线部署，首先需要明白一个关键点：我们常见的 `deployggb.js` 文件，其本身只是一个**"引导加载程序"（bootstrap loader）**。当您在网页中引入这个脚本时，它会默认从 GeoGebra 的官方服务器（`www.geogebra.org`）上下载和加载 GeoGebra 应用的完整核心文件（即"代码库"或"codebase"）。

### 为什么仅下载 `deployggb.js` 不够？

这就是为什么仅仅将 `deployggb.js` 下载到本地是无法实现真正离线运行的。一旦断开网络，这个引导脚本就无法获取到核心文件，从而导致应用显示为空白。

根据 MoodleBox 社区的实践经验，浏览器缓存可能会造成离线可用的假象。当用户首次访问时，浏览器会缓存从官方服务器下载的核心文件，因此即使断网后，应用似乎仍能正常工作。但一旦清除浏览器缓存，问题就会立即暴露——GeoGebra 应用将无法加载，页面显示为空白 [1]。

> **重要结论**：要实现真正的离线部署，您必须将 GeoGebra 应用的全部文件都托管在您自己的服务器上，而不仅仅是 `deployggb.js` 文件。

---

## 二、解决方案：GeoGebra Math Apps Bundle

GeoGebra 官方为自托管需求提供了完美的解决方案：**GeoGebra Math Apps Bundle**。这是一个专门用于自托管（Self-Hosted）的完整资源包，其中包含了运行 GeoGebra 所需的所有脚本、资源和核心代码库。

### 资源包的内容

下载并解压后，您会得到一个 `GeoGebra` 主文件夹，其典型结构如下：

```
GeoGebra/
├── deployggb.js          # 引导加载脚本
├── HTML5/
│   └── 5.0/
│       └── web3d/        # 核心代码库文件夹
│           ├── web.nocache.js
│           ├── sworker-locked.js
│           └── ... (其他核心文件)
└── ... (其他资源文件)
```

这个完整的文件夹包含了 GeoGebra 应用运行所需的一切资源，包括 JavaScript 库、图形渲染引擎、数学计算核心等。

---

## 三、部署步骤

以下是详细的四步部署流程。请严格按照顺序执行，确保每一步都正确完成。

### 第一步：下载并解压资源包

首先，您需要从以下官方地址下载完整的资源包：

**官方下载链接**：  
[https://download.geogebra.org/package/geogebra-math-apps-bundle](https://download.geogebra.org/package/geogebra-math-apps-bundle)

下载完成后，您会得到一个 ZIP 压缩文件。请将其解压到您的本地计算机。解压后，您会看到一个名为 `GeoGebra` 的主文件夹，里面包含了 `deployggb.js` 以及 `HTML5` 等子文件夹。

**注意**：请保持文件夹的完整结构，不要随意移动或删除其中的文件，否则可能导致部署失败。

---

### 第二步：将文件部署到您的服务器

将解压后得到的整个 `GeoGebra` 文件夹上传到您网站的服务器上。您可以将其放置在网站的根目录，或者任何您希望的位置。

**部署示例**：

假设您的网站域名是 `www.example.com`，您将 `GeoGebra` 文件夹上传到了网站根目录下，那么您应该可以通过以下 URL 访问到 `deployggb.js` 文件：

```
https://www.example.com/GeoGebra/deployggb.js
```

如果您将 `GeoGebra` 文件夹放在了其他位置（例如 `assets` 子目录下），则相应的 URL 应该是：

```
https://www.example.com/assets/GeoGebra/deployggb.js
```

请确保您能够通过浏览器直接访问到这个 URL，以验证文件已成功上传。

---

### 第三步：修改 HTML 文件中的脚本引用

在您的 HTML 文件中，将原来引用 GeoGebra 官方服务器的 `<script>` 标签，修改为指向您自己服务器上的 `deployggb.js` 文件。路径应根据您在第二步中放置的位置进行调整。

#### 修改前（在线版本）：

```html
<script src="https://www.geogebra.org/apps/deployggb.js"></script>
```

#### 修改后（离线版本）：

假设 `GeoGebra` 文件夹与您的 HTML 文件在同一目录下，使用相对路径：

```html
<script src="GeoGebra/deployggb.js"></script>
```

或者，如果您希望使用绝对路径：

```html
<script src="https://www.example.com/GeoGebra/deployggb.js"></script>
```

**路径说明**：
- **相对路径**：适用于 HTML 文件和 `GeoGebra` 文件夹在同一服务器上的情况，路径更简洁。
- **绝对路径**：适用于跨域或需要明确指定完整 URL 的场景。

---

### 第四步：设置本地代码库路径（Codebase）

这是整个离线部署中**最关键**的一步。您需要在创建 `GGBApplet` 对象后，调用 `inject()` 方法之前，使用 `setHTML5Codebase()` 方法明确告知 `deployggb.js` 去哪里加载核心文件 [2]。

#### 为什么需要这一步？

即使您已经将 `deployggb.js` 文件放在了本地服务器上，该脚本默认仍然会尝试从 GeoGebra 官方服务器加载核心代码库。`setHTML5Codebase()` 方法的作用就是**覆盖这个默认行为**，让脚本从您指定的本地路径加载核心文件。

#### 代码库路径

根据官方文档和资源包的结构，这个路径通常是：

```
GeoGebra/HTML5/5.0/web3d/
```

**注意**：路径末尾的 `/` 是必需的。

#### 代码示例

在您的 JavaScript 代码中，添加以下调用：

```javascript
var applet = new GGBApplet(params, true);

// 设置本地代码库的路径
applet.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');

// 注入应用
window.addEventListener("load", function() { 
    applet.inject('ggb-element');
});
```

**路径调整**：如果您的 `GeoGebra` 文件夹不在 HTML 文件的同级目录，请相应调整路径。例如，如果 `GeoGebra` 在上一级目录，则路径应为 `../GeoGebra/HTML5/5.0/web3d/`。

---

## 四、完整代码示例

下面是一个完整的离线部署 HTML 文件示例。您可以直接使用这个模板，只需确保 `GeoGebra` 文件夹与此 HTML 文件位于正确的相对路径即可。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeoGebra 离线部署示例</title>
    
    <!-- 步骤 3: 引用本地的 deployggb.js -->
    <script src="GeoGebra/deployggb.js"></script>
</head>
<body>

    <h1>我的离线 GeoGebra 应用</h1>
    <p>这是一个完全离线运行的 GeoGebra 应用示例。</p>
    
    <!-- GeoGebra 应用的容器 -->
    <div id="ggb-element"></div>

    <script>
        // 配置 GeoGebra 应用的参数
        var params = {
            "appName": "classic",        // 应用类型：classic, graphing, geometry, 3d, cas 等
            "width": 800,                // 宽度（像素）
            "height": 600,               // 高度（像素）
            "showToolBar": true,         // 显示工具栏
            "showAlgebraInput": true,    // 显示代数输入框
            "showMenuBar": true,         // 显示菜单栏
            
            // 可选：加载一个本地的 .ggb 文件
            // "filename": "path/to/your/file.ggb"
            
            // 可选：加载一个在线的 GeoGebra 材料（需要网络连接）
            // "material_id": "RHYH3UQ8"
        };

        // 创建 GeoGebra Applet 实例
        var applet = new GGBApplet(params, true);

        // 步骤 4: 设置本地代码库的路径（核心步骤）
        // 这个路径是相对于您的 HTML 文件的，请确保它正确指向您服务器上的代码库文件夹
        applet.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');

        // 在页面加载完成后，将应用注入到指定的容器中
        window.addEventListener("load", function() { 
            applet.inject('ggb-element');
        });
    </script>

</body>
</html>
```

### 代码说明

1. **`appName` 参数**：指定要加载的 GeoGebra 应用类型。常用选项包括：
   - `classic`：经典版（包含所有功能）
   - `graphing`：图形计算器
   - `geometry`：几何工具
   - `3d`：3D 图形计算器
   - `cas`：计算机代数系统

2. **`filename` 参数**：如果您有自己制作的 `.ggb` 文件，可以通过此参数加载。文件路径可以是相对路径或绝对路径。

3. **`setHTML5Codebase()` 方法**：这是实现离线部署的核心。务必确保路径正确，且在调用 `inject()` 之前执行。

---

## 五、版本固定与 CDN 使用（可选）

如果您不需要完全离线，只是希望**固定使用某个特定版本**的 GeoGebra（避免官方自动更新导致的兼容性问题），您可以使用 GeoGebra 的 CDN，并通过 `setHTML5Codebase()` 指定版本号。

### 使用 CDN 固定版本

```javascript
// 固定使用 5.0.498.0 版本
applet.setHTML5Codebase("https://www.geogebra.org/apps/5.0.498.0/web3d");
```

**注意**：根据官方文档，从版本 804 开始，需要将 `5.0` 改为 `5.2`：

```javascript
// 固定使用 5.2.804.0 及以后的版本
applet.setHTML5Codebase("https://www.geogebra.org/apps/5.2.804.0/web3d");
```

这种方式仍然需要网络连接，但可以确保版本稳定，不会因官方更新而影响您的应用。

---

## 六、性能优化：使用 Service Worker（高级）

如果您希望进一步提升离线应用的加载速度，可以使用 **Service Worker** 技术来缓存 GeoGebra 的核心文件。这样，用户在首次访问后，后续访问将直接从浏览器缓存中加载资源，大幅减少加载时间。

### Service Worker 的位置

在 GeoGebra Math Apps Bundle 中，Service Worker 文件名为 `sworker-locked.js`，位于以下路径：

```
GeoGebra/HTML5/5.0/web3d/sworker-locked.js
```

### 部署 Service Worker

1. **将 `sworker-locked.js` 文件放在您的域名根目录下**（或您希望启用缓存的目录下）。

2. **在您的 HTML 页面中添加以下 JavaScript 代码**，用于注册 Service Worker：

```javascript
var serviceWorkerPath = '/sworker-locked.js';  // Service Worker 文件的路径
var appletLocation = '/';                      // 启用缓存的目录范围

function isServiceWorkerSupported() {
    return 'serviceWorker' in navigator && location.protocol === "https:";
}

function installServiceWorker() {
    if (navigator.serviceWorker.controller) {
        console.log("Service worker is already controlling the page.");
    } else {
        navigator.serviceWorker.register(serviceWorkerPath, {
            scope: appletLocation
        });
    }
}

if (isServiceWorkerSupported()) {
    window.addEventListener('load', function() {
        installServiceWorker();
    });
} else {
    console.log("Service workers are not supported.");
}
```

### 注意事项

- **HTTPS 要求**：Service Worker 只能在 HTTPS 协议下工作（本地开发时 `localhost` 除外）。
- **版本固定**：使用 Service Worker 时，建议通过 `setHTML5Codebase()` 固定 GeoGebra 版本，以确保缓存的一致性。

---

## 七、常见问题与排查

### 问题 1：页面显示空白，控制台没有错误

**可能原因**：
- `setHTML5Codebase()` 方法未调用，或路径不正确。
- `GeoGebra` 文件夹上传不完整，缺少核心文件。

**解决方法**：
1. 检查浏览器的开发者工具（F12）中的"网络"（Network）选项卡，查看是否有文件加载失败（404 错误）。
2. 确认 `setHTML5Codebase()` 方法的路径与实际文件夹结构一致。
3. 重新下载并上传完整的 GeoGebra Math Apps Bundle。

---

### 问题 2：在本地测试时可以运行，但上传到服务器后不工作

**可能原因**：
- 路径使用了绝对路径，但服务器的目录结构与本地不同。
- 服务器的文件权限设置不正确，导致文件无法访问。

**解决方法**：
1. 优先使用相对路径，确保路径在不同环境下都能正确解析。
2. 检查服务器上 `GeoGebra` 文件夹的访问权限，确保所有文件可读。
3. 在浏览器中直接访问 `deployggb.js` 的 URL，确认文件可以正常下载。

---

### 问题 3：GeoGebra 应用加载缓慢

**可能原因**：
- 服务器带宽不足，或文件传输速度慢。
- 未启用 Service Worker 缓存。

**解决方法**：
1. 启用 Service Worker（参见第六节），让浏览器缓存核心文件。
2. 考虑使用 CDN 或更高性能的服务器托管 `GeoGebra` 文件夹。
3. 压缩和优化服务器配置（如启用 Gzip 压缩）。

---

## 八、总结与核对清单

以下是完整的部署核对清单，请在部署时逐项确认：

| 步骤 | 关键操作 | 目的 | 常见错误 |
| :--- | :--- | :--- | :--- |
| **1** | 下载并解压 `geogebra-math-apps-bundle` | 获取所有必需的离线文件 | 文件不全或解压后目录结构被破坏 |
| **2** | 上传 `GeoGebra` 文件夹到服务器 | 使离线文件可通过 URL 访问 | 文件夹上传位置错误，导致 URL 不正确 |
| **3** | 修改 `<script src="...">` 引用路径 | 确保加载的是本地的引导脚本 | 路径错误（相对或绝对路径不正确） |
| **4** | 调用 `applet.setHTML5Codebase()` | **核心步骤**：指定核心文件的加载位置 | 路径错误，或忘记调用此方法 |
| **5** | 测试离线环境下的运行情况 | 验证部署是否成功 | 仅在有缓存的情况下测试，未清除缓存 |

### 验证部署成功的方法

1. **断开网络连接**（或在浏览器中启用"离线模式"）。
2. **清除浏览器缓存**。
3. **刷新页面**，查看 GeoGebra 应用是否仍能正常加载和运行。

如果以上三步都能顺利通过，说明您的离线部署已经成功！

---

## 九、参考资料

1. MoodleBox Community. (2023). *Offline Geogebra Discussion*. Retrieved from [https://discuss.moodlebox.net/d/361-offline-geogebra](https://discuss.moodlebox.net/d/361-offline-geogebra)

2. GeoGebra. (n.d.). *GeoGebra Apps Embedding*. GitHub Pages. Retrieved from [https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/)

3. GeoGebra. (n.d.). *GeoGebra Documentation*. Retrieved from [https://www.geogebra.org/m/vuyvwvxw](https://www.geogebra.org/m/vuyvwvxw)

4. GeoGebra. (n.d.). *GeoGebra Integration Examples*. GitHub. Retrieved from [https://github.com/geogebra/integration](https://github.com/geogebra/integration)

---

## 附录：其他资源

### 官方文档链接

- **GeoGebra Apps API 文档**：[https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/)
- **GeoGebra 应用参数文档**：[https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/)
- **GeoGebra 安装指南**：[https://geogebra.github.io/docs/reference/en/GeoGebra_Installation/](https://geogebra.github.io/docs/reference/en/GeoGebra_Installation/)

### 在线示例

- **GeoGebra 集成示例（在线演示）**：[https://geogebra.github.io/integration/](https://geogebra.github.io/integration/)

### 下载链接

- **GeoGebra Math Apps Bundle**：[https://download.geogebra.org/package/geogebra-math-apps-bundle](https://download.geogebra.org/package/geogebra-math-apps-bundle)
- **GeoGebra Classic 5 Portable (Windows)**：[https://download.geogebra.org/package/win-port](https://download.geogebra.org/package/win-port)

---

**文档版本**：1.0  
**最后更新**：2025年10月28日  
**作者**：Manus AI

---

希望这份指南能帮助您成功实现 GeoGebra 的离线部署！如果您在部署过程中遇到任何问题，欢迎随时咨询。
