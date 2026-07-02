# 贡献指南

感谢你对 **DongWeitao.dev 个人作品集** 的关注！欢迎通过以下方式参与贡献。

## 贡献方式

### 🎨 修改内容或样式

本项目所有内容集中在三个文件中：

- `index.html` — 页面结构与内容
- `styles.css` — 样式与主题
- `script.js` — 交互逻辑

修改步骤：

1. Fork 本仓库
2. 直接编辑 HTML / CSS / JS 文件
3. 本地用浏览器或 `npx serve .` 预览验证
4. 提交 Pull Request

### 🐛 报告 Bug

在 [Issues](../../issues) 页面提交 Bug 报告，请包含：

- 问题描述与复现步骤
- 浏览器 / 设备 / 屏幕尺寸信息
- 截图（如有）

### 💡 提出新功能建议

在 [Issues](../../issues) 页面提交 Feature Request。

## 开发流程

```bash
# 1. Fork & Clone
git clone https://github.com/{your-username}/resume.git

# 2. 本地预览
npx serve .
# 或直接用浏览器打开 index.html

# 3. 提交 PR
```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>: <description>

type:
  docs     — 文档 / README 更新
  feat     — 新功能（新区块 / 新动画）
  fix      — Bug 修复
  style    — CSS 样式调整
  refactor — 结构重构
  chore    — 配置 / 工具变更
```

## 许可证

本项目采用 [MIT License](LICENSE)，贡献内容同样受 MIT 许可证约束。
