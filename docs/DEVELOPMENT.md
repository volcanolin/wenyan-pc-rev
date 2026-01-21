# 文颜-rev 开发指南

本文档旨在帮助开发者快速搭建 **文颜-rev** (WenYan-rev) 的开发环境并开始贡献代码。

## 🛠️ 环境准备 (Windows)

由于本项目基于 Tauri v1 开发，你需要为 Windows 系统准备以下工具链：

### 1. 基础系统组件
- **Visual Studio 生成工具**：安装 [C++ 生成工具](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)。
  - 在安装程序中必须勾选 **"使用 C++ 的桌面开发"** (Desktop development with C++)。
  - 确保包含 **Windows 10/11 SDK** 和最新版的 **MSVC** 编译器。
- **WebView2 Runtime**：Tauri 依赖 Edge 浏览器的运行时。Windows 10/11 通常已预装，若系统提示缺失，请从 [Microsoft 官网](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/) 下载安装程序。

### 2. 编程运行时
- **Node.js**：建议使用 v18 或 v20 LTS 版本。
- **Rust**：访问 [rustup.rs](https://rustup.rs/) 下载并运行 `rustup-init.exe`。
  - 安装过程中选择默认设置即可，确保 `x86_64-pc-windows-msvc` 工具链已正确配置。

## 🚀 快速开始

### 1. 克隆项目
```powershell
git clone https://github.com/volcanolin/wenyan-rev.git
cd wenyan-rev
```

### 2. 安装依赖
```powershell
npm install
```

### 3. 启动开发模式
运行以下命令启动具有热重载功能的应用窗口：
```powershell
npm run tauri-dev
```
*首次运行会编译 Rust 代码，耗时较长（约 2-5 分钟），后续启动为增量编译，速度较快。*

## 🏗️ 生产构建

构建安装程序和优化后的可执行文件：
```powershell
npm run tauri
```
构建完成后，输出文件位于：
- **MSI 安装包**: `src-tauri/target/release/bundle/msi/*.msi`
- **可执行文件**: `src-tauri/target/release/wenyan-rev.exe`

## 📂 开发工作流

### 前端开发 (`src/`)
- **核心逻辑**: `src/main.js` 处理主界面逻辑和状态管理。
- **渲染逻辑**: `src/right.js` 负责 Markdown 解析、脚注处理和图例生成。
- **样式主题**: `src/themes/` 存放各平台渲染主题，`src/highlight/` 存放代码高亮样式。
- **修改生效**: 前端代码修改后，Tauri 开发窗口会自动刷新。

### 后端开发 (`src-tauri/`)
- **Rust 代码**: `src-tauri/src/main.rs` 包含自定义的 Tauri 命令（如剪贴板操作、文件读写）。
- **配置文件**: `src-tauri/tauri.conf.json` 定义了应用标识、权限、窗口参数等。
- **修改生效**: 修改 Rust 代码后，Tauri 命令行会自动重新编译并重启应用。

### 资源同步 (`scripts/`)
应用内置的“欢迎页”是根据根目录的 `README.md` 生成的。
- 如果你修改了 `README.md`，必须运行：
  ```powershell
  npm run copy-readme
  ```
  该脚本会执行 `scripts/copy-welcome.js`，将 README 内容转换并同步到 `src-tauri/resources/` 目录中。

## 📜 关键脚本说明

| 命令 | 说明 |
|:---|:---|
| `npm run tauri-dev` | 运行 `copy-readme` 并启动开发服务器和 Tauri 窗口 |
| `npm run tauri` | 运行 `copy-readme` 并执行完整的生产环境构建 |
| `npm run copy-readme` | 将根目录 `README.md` 同步至内置资源文件夹 |

## 🧪 质量与风格规范

- **状态管理**: 遵循 `AGENTS.md` 中定义的 `StateManager` 和 `ErrorHandler` 模式。
- **样式隔离**: 为所有主题样式添加 `#wenyan` 根选择器前缀。
- **Git 提交**: 请严格遵守 Angular 规范：
  - `feat`: 新功能
  - `fix`: Bug 修复
  - `docs`: 文档更新
  - `refactor`: 代码重构

## ❓ 常见问题 (Troubleshooting)

1. **编译失败：找不到 C++ 编译器**
   - 请检查 Visual Studio Build Tools 是否安装完整，且已勾选 "使用 C++ 的桌面开发"。
2. **下载 Rust 依赖过慢**
   - 建议配置 [字节跳动](https://rsproxy.cn/) 或 [中科大](https://mirrors.ustc.edu.cn/help/rust-static.html) 的 Rust 镜像源。
3. **npm install 失败**
   - 尝试使用 `npm install --legacy-peer-deps` 或清理 `node_modules` 后重试。

---
> 💡 **提示**：更深入的架构说明和代码模式，请参考项目根目录下的 **AGENTS.md**。
