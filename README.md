# DongWeitao.dev — 个人作品集

> 董伟涛（DongWeitao）的单页个人作品集站点 —— 后端开发工程师 · 技术组长，展示 SCRM 微服务架构、WeChat 风控系统、AI Agent 辅助开发等实践项目。

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-gray)

纯 `HTML · CSS · JS` 构建，零依赖、零框架、零构建步骤，打开即用。

## ✨ 特性

- **单页结构**：导航 → Hero → 技能栈 → 关于（自我介绍 + 实践经历）→ 精选项目 → 联系方式 → 页脚
- **6 个精选项目**：SCRM 微服务系统 · WeChat 风控 · 微信内聊 AI 试点 · 风控优化 · AI Agent SOP 工作流 · juse.infrastructure 基础设施层
- **Hash 路由详情页**：`#project/1` ~ `#project/6` 客户端渲染，XSS 安全转义
- **明暗主题**：一键切换 + localStorage 偏好记忆 + 系统配色跟随
- **响应式布局**：桌面 3 列 / 平板 2 列 / 手机单列，折叠菜单
- **滚动动画**：IntersectionObserver 渐入 + stagger 延迟，尊重 `prefers-reduced-motion`
- **一键复制邮箱**：Clipboard API + execCommand 兜底，"已复制" 提示 1.6s
- **留言表单**：前端校验（姓名 / 邮箱 / 内容） + mailto 唤起邮件客户端
- **SVG 图标**：favicon 为渐变圆角矩形 + "涛" 字，每项目卡片内嵌独立配色 SVG 插画

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 结构 | HTML5（语义化标签：nav / section / article / footer） |
| 样式 | CSS3（自定义属性 · Grid · Flexbox · `color-mix()` · backdrop-filter） |
| 交互 | 原生 JavaScript（IntersectionObserver · Clipboard API · hash 路由） |
| 主题 | CSS 变量 + `[data-theme="dark"]` 覆盖 |
| 部署 | GitHub Pages（GitHub Actions 自动部署） |

## 📁 项目结构

```
resume/
├── index.html          # 页面结构（全部内容集中于此）
├── styles.css          # 完整样式（CSS 变量 + 明暗主题 + 响应式 + 动画）
├── script.js           # 交互逻辑（主题 / 菜单 / 动画 / 路由 / 表单）
├── favicon.svg         # 站点图标（渐变 + "涛"）
├── .github/
│   └── workflows/
│       └── netlify.yml # GitHub Pages 自动部署工作流
├── .netlify/
│   ├── netlify.toml    # Netlify 配置
│   └── state.json      # Netlify 站点绑定
└── README.md
```

## 🚀 本地预览

直接用浏览器打开 `index.html` 即可；或启动一个静态服务器：

```bash
# Python
python -m http.server 5173

# Node (npx)
npx serve .
```

然后访问 http://localhost:5173

## 📝 内容定制

所有内容直接写在 `index.html` 中，按需修改：

| 区块 | HTML 选择器 | 内容 |
|------|------------|------|
| 个人介绍 | `#hero` | 姓名、角色、简介 |
| 技能栈 | `#skills` `.skills-grid` | 四张技能卡片（后端 / 数据库 / AI / 前端） |
| 个人信息 | `#about` `.info-table` | 性别、年龄、学历、经验 |
| 实践经历 | `#about` `.experience` | 工作经历时间线 |
| 项目卡片 | `#projects` `.project-grid` | 6 张项目卡片 + SVG 插画 |
| 项目详情 | `script.js` `PROJECTS[]` | 项目描述、技术栈、链接 |
| 联系方式 | `#contact` | 邮箱 / GitHub / Gitee 链接 |

> ⚠️ 联系方式中的邮箱与 GitHub/Gitee 链接当前为占位符，部署前请替换为真实账号信息。

## 🎨 主题系统

CSS 变量定义在 `styles.css` 顶部，明暗主题一键切换：

- **浅色**：`--bg: #f8fafc` · `--text: #1e293b` · `--brand: #4f46e5`
- **深色**：`--bg: #0f172a` · `--text: #e2e8f0` · `--brand: #818cf8`

切换按钮位于导航栏右侧，或使用 `script.js` 中的主题逻辑自动跟随系统偏好。

## 🌐 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages：

- **触发条件**：push 到 `main` 分支
- **部署流程**：checkout → configure-pages → upload-pages-artifact → deploy-pages
- **站点地址**：`https://{username}.github.io/resume/`

> ℹ️ 项目同时包含 Netlify 配置（`.netlify/`），可作为备用部署方案。

## 📜 License

MIT
