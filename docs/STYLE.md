# 代码风格与开发规范

本文档定义了 **文颜-rev** 项目的代码风格、命名规范及开发最佳实践。

## 文件规范

### 编码格式
- 所有文本文件必须使用 **UTF-8** 编码。

### 缩进标准
- JavaScript/CSS/HTML: **4 个空格**。
- Rust: **4 个空格**（遵循 cargo fmt 标准）。

## JavaScript 规范

### 版权声明
所有 JS 文件头部必须包含版权声明：
```javascript
/* Copyright 2024 Lei Cao - Apache License 2.0 */
```

### 状态管理
使用基于对象的单例模式管理功能状态，避免全局变量污染：
```javascript
const FootnoteState = {
    STORAGE_KEY: 'state_key',
    isEnabled() { return localStorage.getItem(this.STORAGE_KEY) === 'true'; },
    setEnabled(val) { localStorage.setItem(this.STORAGE_KEY, val.toString()); }
};
```

### 错误处理
使用 `ErrorHandler.safeExecute` 包装器处理不稳定的操作，尤其是 DOM 或第三方库调用：
```javascript
ErrorHandler.safeExecute(() => {
    // 逻辑代码
}, "错误描述信息", defaultValue);
```

### 渲染原则
- **批量操作**: 尽可能通过一次性 DOM 插入完成渲染，减少重排。
- **避免重绘**: 除非必要，否则不要触发完整渲染。
- **强制刷新**: 如需保持字体等状态的重新渲染，调用 `refreshContentWithFont(content)`。

### 样式处理
- 严禁滥用内联样式（Inline Styles）。
- 优先使用 CSS 类（如 `.footnote-link`）。
- 仅在动态计算且无法通过类实现时使用 `element.style`。

## CSS 规范

### 根选择器
所有主题样式必须以 `#wenyan` 作为根选择器，以实现样式隔离：
```css
#wenyan p { ... }
```

### 脚注样式
新主题必须定义脚注链接样式，且需确保在不同平台（尤其是微信公众号）的兼容性：
```css
#wenyan a.footnote-link {
    /* 样式代码 */
}
```
**注意**: 避免使用会导致双下划线的样式组合（如同时设置 `text-decoration` 和 `border-bottom`）。

### 代码高亮
代码高亮主题文件存放于 `src/highlight/styles/` 目录下。

## HTML 与通信

### iframe 通信
编辑器与预览区域之间通过 `postMessage` 进行双向通信：
- 渲染更新：`postMessage({ type: 'onUpdate', value: content }, '*')`
- 状态同步：消息类型包括 `onReady`, `onChange`, `onFootnoteChange` 等。

## Rust 规范

### Tauri 命令
定义 Tauri 命令时使用 `#[tauri::command]` 宏。

### 异常处理
- 谨慎使用 `.unwrap()`，优先使用 `?` 或 `expect()` 提供错误上下文。
- 确保所有暴露给前端的命令都有完善的错误捕获。

## Git 提交规范

项目遵循 **Angular 提交规范**：

### 格式
```
<type>(<scope>): <subject>

<body>
```

### 类型 (Type)
- `feat`: 新功能
- `fix`: 修补 bug
- `docs`: 文档变更
- `refactor`: 代码重构
- `style`: 代码格式优化（不影响代码运行）
- `chore`: 构建过程或辅助工具的变动

### 要求
- **语言**: 提交信息的 `body` 部分必须使用 **中文**。
- **禁忌**: 严禁在提交信息中添加 "Generated with Claude" 等 AI 生成后缀。

## 开发注意事项

- **兼容性**: 针对微信公众号平台，需将 CSS 伪元素转换为实际 HTML 标签（脚本处理）。
- **持久化**: 用户偏好设置（如 `gzhTheme`, `preferred-font`）需存入 `localStorage`。
