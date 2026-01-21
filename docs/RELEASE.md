# 文颜-rev 版本发布指南 (Runbook)

本指南为 **文颜-rev** 项目的维护者提供详细的版本发布流程。请严格按照以下步骤操作，以确保每个发布的版本都经过正确的构建、验证和标记。

## 1. 发布前置检查 (Pre-release Checks)

在开始发布流程前，请确保：
- [ ] 所有计划中的功能已完成合并到 `main` 分支。
- [ ] 本地代码库已更新到最新状态 (`git pull origin main`)。
- [ ] 本地测试已通过，没有严重的回归问题。
- [ ] 确保 `npm install` 已安装所有最新依赖。

## 2. 更新版本号 (Version Bumping)

文颜-rev 的版本号需要在多个地方保持同步。请将 `X.X.X` 替换为目标版本号。

1.  **`package.json`**:
    - 修改 `"version": "X.X.X"`。这是前端和 npm 脚本使用的基准版本。
2.  **`src-tauri/Cargo.toml`**:
    - 修改 `[package]` 下的 `version = "X.X.X"`。这是 Rust 后端和 Tauri 构建器使用的版本。
3.  **`README.md`**:
    - 更新 `## 🌟 版本特色` 下的 `当前版本：X.X.X`。
    - 在 `## 📈 版本演进` 列表顶部添加新版本的简短摘要。
4.  **`CHANGELOG.md`**:
    - 在文件顶部添加新版本的详细变更日志，包括：`Features`, `Bug Fixes`, `Improvements` 等。

## 3. 执行生产构建 (Production Build)

构建过程必须在 Windows 环境下进行，以生成 `.msi` 安装程序。

在 PowerShell 或 CMD 中运行：

```powershell
# 执行构建。此脚本会自动触发 npm run copy-readme
npm run tauri
```

### 自动化逻辑说明
项目配置了自动化钩子：
- `npm run tauri` 会先执行 `node scripts/copy-welcome.js`。
- 该脚本会将最新的 `README.md` 复制到 `src-tauri/resources/README.md`。
- 打包后的应用在首次运行时，会读取该资源文件并作为默认内容展示。

## 4. 验证构建产物 (Verification)

构建产物默认生成在 `src-tauri/target/release/bundle/` 目录下。

### 检查文件路径
- **MSI 安装包**: `src-tauri/target/release/bundle/msi/wenyan-rev_X.X.X_x64_zh-CN.msi`
- **EXE 可执行文件**: `src-tauri/target/release/bundle/exe/wenyan-rev_X.X.X_x64_zh-CN.exe`

### 运行验证测试
1.  **安装测试**: 运行 `.msi` 文件，确认安装程序能正确识别应用名称和版本。
2.  **启动测试**: 启动已安装的应用，检查应用标题栏或关于对话框（如果有）显示的版本号。
3.  **内容检查**: 确认编辑器默认加载的内容是否为你在 `README.md` 中最新修改的内容。
4.  **功能检查**: 快速测试核心功能（如主题切换、复制到剪贴板、图例功能）。

## 5. Git 提交流程

提交信息必须遵循 Angular 规范，以便于后续自动化生成日志或识别发布节点。

```powershell
# 暂存更改
git add .

# 创建提交 (必须使用 feat(release) 或 chore(release) 类别)
git commit -m "feat(release): vX.X.X"

# 创建版本标签 (必须以 v 开头)
git tag vX.X.X

# 推送代码和标签到 GitHub
git push origin main --tags
```

## 6. GitHub Release 手动发布步骤

1.  访问项目 GitHub 仓库的 **Releases** 页面。
2.  点击 **Draft a new release**。
3.  **Choose a tag**: 选择刚才推送的 `vX.X.X`。
4.  **Release title**: 填写 `vX.X.X`。
5.  **Description**:
    - 复制 `CHANGELOG.md` 中该版本的更新内容。
    - 也可以点击 "Generate release notes" 自动生成后再进行微调。
6.  **Assets**:
    - 上传 `src-tauri/target/release/bundle/msi/` 中的 `.msi` 文件。
    - 上传 `src-tauri/target/release/bundle/exe/` 中的 `.exe` 文件。
    - *可选*: 上传对应的 `.msi.zip` 或 `.sig` 文件（如果有）。
7.  **Publish**: 确认无误后，点击 **Publish release**。

## 7. 常见问题处理 (Troubleshooting)

- **构建失败**: 
  - 检查 Rust 环境 (`rustc --version`)。
  - 确保安装了 `Wix Toolset`（Tauri 1.x 构建 MSI 必需）。
  - 运行 `npm run tauri info` 诊断环境问题。
- **README 未更新**:
  - 手动运行 `npm run copy-readme`，然后重新构建。
- **版本冲突**:
  - 如果构建出的文件名版本号不对，请检查 `src-tauri/tauri.conf.json` 中的 `package > version` 是否设置为 `"../package.json"` 或手动同步了。

---
*最后更新日期: 2026-01-21*

