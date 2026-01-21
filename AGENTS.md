# AGENTS.md - 文颜-rev AI 开发指南

## 项目概述

**文颜-rev** - 基于 Tauri 的多平台 Markdown 写作发布工具
- **前端**: 原生 JavaScript/HTML/CSS（无框架）
- **后端**: Tauri (Rust)
- **数据库**: SQLite（tauri-plugin-sql）
- **应用标识**: `com.github.volcanolin.wenyan-rev`

## 开发命令

```bash
npm run tauri-dev  # 开发模式（热重载）
npm run tauri      # 生产构建 → src-tauri/target/release/bundle/
```

### 版本发布

同步更新 `package.json` 和 `src-tauri/Cargo.toml` 版本号后：
```bash
npm run tauri && git add . && git commit -m "feat: release vX.X.X" && git tag vX.X.X && git push origin main --tags
```

## 项目结构

```
src/
├── main.js          # 主逻辑、主题管理
├── right.js         # Markdown 处理与渲染
├── themes/          # 平台主题 CSS
└── highlight/styles # 代码高亮主题
src-tauri/
├── src/main.rs      # Tauri 命令
└── tauri.conf.json  # 配置
```

## 代码风格

### JavaScript

```javascript
// 文件头部版权声明（必需）
/* Copyright 2024 Lei Cao - Apache License 2.0 */

// 状态管理对象模式
const StateManager = {
    STORAGE_KEY: 'state_key',
    isEnabled() { return localStorage.getItem(this.STORAGE_KEY) === 'true'; },
    setEnabled(val) { localStorage.setItem(this.STORAGE_KEY, val.toString()); }
};

// 错误处理包装器
const ErrorHandler = {
    safeExecute(fn, errorMessage, defaultValue = null) {
        try { return fn(); }
        catch (error) { console.error(`${errorMessage}:`, error); return defaultValue; }
    }
};

// 函数命名：动词开头，camelCase
function addFootnotes() { }
function refreshContentWithFont(content) { }
```

### CSS

```css
#wenyan p { }  /* 使用 #wenyan 作为根选择器 */
#wenyan a.footnote-link {
    font-weight: bold;
    text-decoration: underline;  /* 或 border-bottom，二选一 */
    color: [主题颜色];
}
```

### Rust

```rust
#[tauri::command]
fn write_html_to_clipboard(app: tauri::AppHandle, text: String) {
    let clipboard = app.state::<tauri_plugin_clipboard::ClipboardManager>();
    clipboard.write_html(text).unwrap();
}
```

## 架构模式

### iframe 通信

```javascript
iframe.contentWindow.postMessage({ type: 'onUpdate', value: content }, '*');
window.parent.postMessage({ type: 'onChange', value: newContent }, '*');
// 消息类型：onReady, onChange, onUpdate, onContentChange, onFootnoteChange
```

### 状态持久化键名

- `lastArticle` / `gzhTheme` / `highlight-theme` / `preferred-font`
- `wenyan_footnotes_enabled` / `wenyan_caption_enabled`

### 功能状态原则

- **轻量级**: 脚注用 DOM 操作
- **重量级**: 图例用 `refreshContentWithFont()` 重新渲染

## Git 提交规范 (Angular)

```
<type>(<scope>): <subject>

<body>  # 使用中文

Fixes #42
```

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档 |
| refactor | 重构 |
| chore | 构建/依赖 |

**禁止**: 添加 "Generated with Claude" 后缀、非标准格式

## 开发注意事项

### 脚注系统

- 使用 `footnote-link` CSS 类
- 检测现有脚注防重复（防序号叠加）
- 主题切换调用 `resetFootnoteStylesForNewTheme()`

### 微信公众号兼容

- CSS 伪元素转实际 HTML
- 脚注用 span 包装保留样式

### 主题开发

新主题必须包含 `#wenyan a.footnote-link` 样式

## 质量标准

- 错误处理：所有操作需有反馈
- 性能：DOM 批量操作
- 状态同步：UI 与功能实时同步
- 向后兼容：不破坏用户设置

## 进一步阅读

| 文档 | 内容 |
|------|------|
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | 开发环境搭建与运行 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构速览、消息协议 |
| [docs/STYLE.md](docs/STYLE.md) | 代码规范详解 |
| [docs/TESTING.md](docs/TESTING.md) | 手动回归测试清单 |
| [docs/RELEASE.md](docs/RELEASE.md) | 版本发布流程 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 详细指南 |
