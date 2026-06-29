# 个人作品集

仿 [shaun.asia](https://www.shaun.asia/) 风格的单页个人作品集站点，内容基于 AI 应用实践文档（SCRM 微服务系统 / Juse.WeChat 风控系统 / AI Agent 辅助开发工作流）填充。

纯 `HTML · CSS · JS` 构建，零依赖、零框架，打开即用。

## 功能特性

- **单页结构**：导航 → Hero 自我介绍 → 关于（自我介绍 + 实践经历 + 技术栈）→ 精选项目 → 联系（联系方式 + 留言表单）→ 页脚
- **明暗主题切换**：一键切换，自动记忆偏好，跟随系统配色
- **响应式布局**：桌面 / 平板 / 手机自适应，移动端折叠菜单
- **滚动入场动画**：IntersectionObserver 实现的渐入效果，尊重 `prefers-reduced-motion`
- **留言表单**：前端校验 + `mailto` 唤起邮件客户端
- **一键复制邮箱**：Clipboard API + 兼容兜底

## 目录结构

```
portfolio/
├── index.html      # 页面结构
├── styles.css      # 样式（CSS 变量 + 明暗主题）
├── script.js       # 交互逻辑
├── favicon.svg     # 站点图标
└── README.md
```

## 本地预览

直接用浏览器打开 `index.html` 即可；或启动一个静态服务器：

```bash
# Python
python -m http.server 5173
# Node (npx)
npx serve .
```

然后访问 http://localhost:5173

## 内容定制

所有内容直接写在 `index.html` 中，按需修改：

- **个人信息 / 介绍**：`#hero`、`#about` 区块
- **实践经历**：`.experience` 中的 `.exp-item`
- **技术栈**：`.skills-grid` 中的 `.tags`
- **项目卡片**：`.project-grid` 中的 `.project-card`
- **联系方式**：`#contact` 中的邮箱 / GitHub / Gitee 链接（当前为占位，请替换为真实信息）

> 联系方式中的邮箱与 GitHub/Gitee 为占位符，部署前请替换为真实账号。

## 技术栈

HTML5 · CSS3（自定义属性、Grid、Flexbox、`color-mix`） · 原生 JavaScript（IntersectionObserver、Clipboard API）

## License

MIT