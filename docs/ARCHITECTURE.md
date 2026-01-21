# 文颜-rev 架构概览 (Architecture)

本文档采用 Runbook 风格，总结了 **文颜-rev** 的核心架构设计、模块分工及交互协议。

## 1. 核心文件布局 (Key Files)

- **`src/index.html`**: 应用主入口。承载所有的 `<iframe>` 容器和侧边栏 UI。
- **`src/main.js`**: **核心大脑**。负责跨 iframe 通信、主题管理、本地存储同步及 SQLite 数据库交互。
- **`src/right.js`**: **预览引擎**。负责 Markdown 解析（Marked.js）、数学公式渲染（MathJax）、代码高亮以及针对不同平台的导出后处理。

## 2. 页面与组件 (Pages & Iframes)

应用采用多 iframe 架构以隔离编辑与渲染：

- **`markdown_editor.html`**: 基于 CodeMirror 的 Markdown 编辑器。
- **`markdown_preview.html`**: 实时预览区，由 `right.js` 驱动。
- **`css_editor.html`**: 自定义主题的 CSS 编辑器。
- **`css_preview.html`**: 自定义主题的实时预览模版。

---

## 3. 消息通讯协议 (Message Protocol)

各组件通过 `window.postMessage` 进行双向通讯。

### 3.1 编辑器 -> 主窗口 (Editor to Main)
- **`onReady`**: 编辑器加载完成。
- **`onChange`**: 内容发生变化。`{ value: string }`
- **`leftScroll`**: 编辑器滚动。`{ value: { y0: ratio } }`
- **`clicked`**: 鼠标点击（用于关闭主窗口弹窗）。

### 3.2 预览区 -> 主窗口 (Preview to Main)
- **`onRightReady`**: 预览区加载完成。
- **`rightScroll`**: 预览区滚动。`{ value: { y0: ratio } }`
- **`clicked`**: 鼠标点击。

### 3.3 主窗口 -> 预览区 (Main to Preview)
- **`onUpdate`**: 全量更新内容/主题。`{ content, highlightCss, themeValue, isCaptionEnabled, isFootnotesEnabled }`
- **`onContentChange`**: 仅更新文本。`{ content, isCaptionEnabled }`
- **`onPeviewModeChange`**: 切换手机/电脑预览模式。`{ previewMode }`
- **`onFootnoteChange`**: 切换脚注开关。`{ isFootnotesEnabled }`
- **`onCaptionChange`**: 切换图例开关。`{ isCaptionEnabled, content }`
- **`updateFont`**: 更新预览字体。`{ fontFamily }`

### 3.4 主窗口 <-> CSS 编辑器
- **`onReadyCss`**: CSS 编辑器就绪。
- **`onChangeCss`**: CSS 发生变化。`{ value: string }`

---

## 4. 数据持久化 (Persistence)

### 4.1 LocalStorage (应用配置)
| 键名 | 说明 |
| :--- | :--- |
| `lastArticle` | 最后一次编辑的 Markdown 内容 |
| `gzhTheme` | 当前选中的公众号主题 ID |
| `highlight-theme` | 代码高亮样式 ID |
| `preferred-font` | 用户选择的字体模式 (`theme`/`sans`/`serif`) |
| `footnotesEnabled` | 脚注功能是否开启 (UI 状态) |
| `captionEnabled` | 图例功能是否开启 |
| `wenyan_footnotes_enabled` | 预览区脚注持久化状态 (逻辑状态) |

### 4.2 SQLite 数据库 (自定义主题)
通过 `tauri-plugin-sql` 管理，数据库名 `data.db`。

**Table: `CustomTheme`**
```sql
CREATE TABLE CustomTheme (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,         -- 主题显示名称
    content TEXT NOT NULL,      -- CSS 样式内容
    createdAt TEXT NOT NULL     -- 创建时间 ISO 字符串
);
```

---

## 5. 开发速查 (Action-Oriented Guide)

- **想修改 Markdown 解析逻辑？** -> 修改 `src/right.js` 中的 `marked.use()` 配置。
- **想增加新的消息类型？** -> 在 `src/main.js` 的 `message` 监听器和 `src/right.js` 的 `EventHandler` 中注册。
- **想调整编辑器样式？** -> 修改 `src/markdown_editor.html` 或引入新的 CodeMirror 主题。
- **想修改导出到微信的格式？** -> 修改 `src/right.js` 中的 `getContentForGzh()`。
- **想修改数据库操作？** -> 查看 `src/main.js` 中 `load()` 及其后续的 `invoke('plugin:sql|...')` 调用。
