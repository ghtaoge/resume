(function () {
  "use strict";

  /* ---------- 主题切换（记忆偏好） ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  // 初始：本地存储 > 系统偏好
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("dark");
    }
  })();

  themeToggle.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------- 移动端菜单 ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.querySelector(".nav-links");
  menuToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 导航滚动状态 ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动入场动画 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          // 同一批元素按顺序轻微延迟
          var delay = en.target.dataset.delay || 0;
          setTimeout(function () { en.target.classList.add("visible"); }, delay);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el, i) {
      el.dataset.delay = (i % 3) * 80;
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 复制邮箱 ---------- */
  var copyBtn = document.getElementById("copyEmail");
  var emailLink = document.getElementById("emailLink");
  copyBtn.addEventListener("click", function () {
    var email = emailLink.textContent.trim();
    var done = function () {
      copyBtn.textContent = "已复制";
      copyBtn.classList.add("copied");
      setTimeout(function () {
        copyBtn.textContent = "复制";
        copyBtn.classList.remove("copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });

  /* ---------- 留言表单（前端校验 + mailto） ---------- */
  var form = document.getElementById("contactForm");
  var tip = document.getElementById("formTip");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    tip.className = "form-tip";
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      tip.textContent = "请填写完整：姓名、邮箱、留言内容均为必填项。";
      tip.classList.add("err");
      return;
    }
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      tip.textContent = "邮箱格式好像不太对，再检查一下？";
      tip.classList.add("err");
      return;
    }

    // 前端演示：通过 mailto 唤起邮件客户端
    var to = document.getElementById("emailLink").textContent.trim();
    var subject = encodeURIComponent("来自「" + name + "」的网站留言");
    var body = encodeURIComponent(message + "\n\n—— " + name + "（" + email + "）");
    window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;

    tip.textContent = "已为你唤起邮件客户端，感谢留言！我会尽快回复。";
    tip.classList.add("ok");
    form.reset();
  });

  /* ---------- 锚点平滑滚动（兼容旧浏览器） ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      // 跳过空锚点与项目详情路由（由 hashchange 路由处理）
      if (id === "#" || id.length < 2 || id.indexOf("#project/") === 0) return;
      e.preventDefault();
      showHome(); // 从详情页点导航时确保首页区块可见
      var target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      }
    });
  });

  /* ---------- 项目详情：数据 + hash 路由 ---------- */
  var PROJECTS = [
    {
      mark: "SC", title: "SCRM 微服务系统",
      tags: [".NET 5", "CAP / RabbitMQ", "Consul", "Ocelot", "SqlSugar", "Autofac"],
      desc: "基于 .NET 5 的 SCRM（社交客户关系管理）微服务系统，采用独立解决方案模式——每个微服务拥有自己的 .sln 文件，共 14 个解决方案：System、Customer、Ordering、AfterSale、Community、Open、Report、Schedule、Social、Sync、BackGround、WebSocket、Gateway、Infrastructure。服务间通过 CAP 事件总线（RabbitMQ 传输）异步通信，Consul 实现服务注册与发现，Ocelot API 网关统一对外。每个业务微服务内部遵循统一的六层架构（Api / Consumer / Service / IRepository / Repository / Model），使用 Autofac 替代默认 DI 容器支持属性注入，Apollo 配置中心集中管理配置，SqlSugar ORM 访问 MySQL。",
      stack: [
        [".NET 5", "微服务运行时与统一框架基础"],
        ["CAP + RabbitMQ", "事件总线异步通信，消息持久化于 MySQL"],
        ["Consul", "服务注册与发现，网关动态路由"],
        ["Ocelot", "API 网关，路由 / 负载 / 聚合"],
        ["SqlSugar + MySQL", "ORM 多库切换与数据访问"],
        ["Autofac", "IoC 容器，属性注入与约定注册"]
      ],
      links: [{ label: "内部项目", url: "#" }]
    },
    {
      mark: "JW", title: "Juse.WeChat 风控系统",
      tags: [".NET Core 3.1", "SqlSugar", "MongoDB", "RabbitMQ", "Redis", "Vue2"],
      desc: "企业微信消息接入与风控系统，对接单聊 / 客户群 / 内部群 / 内部私聊多类型消息。完整链路：识别 → 推 MQ → Consumer 幂等 upsert → Redis 缓存降频 → MongoDB 原文归档 → PostgreSQL 关联业务数据 → Kibana 全链路日志追踪。前端 Vue2 + Element UI 提供会话列表与纯聊天详情查看器，支持员工筛选与消息内容搜索。",
      stack: [
        [".NET Core 3.1", "后端服务宿主与业务逻辑"],
        ["SqlSugar", "结构化数据访问（MySQL / PostgreSQL）"],
        ["MongoDB", "消息原文归档与非结构化附件、全文检索"],
        ["RabbitMQ", "消息异步传输与解耦"],
        ["Redis", "会话上下文缓存、分布式锁、消息去重"],
        ["Vue2 + Element UI", "列表与纯聊天详情前端"]
      ],
      links: [{ label: "内部项目", url: "#" }]
    },
    {
      mark: "AI", title: "企微内部私聊消息接入 · AI 辅助开发试点",
      tags: ["Claude Code", "Superpowers", "MCP", "PostgreSQL", "MongoDB", "Redis"],
      desc: "用 Claude Code + Superpowers Skills + MCP 工具链从零开发企微内部私聊功能。识别逻辑：from/to 都不以 wm/wo/wb 开头且无 roomId；同一企业下 A↔B 去重为一条会话（chat_key 按排序生成保证命中）；列表按首条消息方向固定展示字段；Consumer 幂等 upsert 入 PostgreSQL，Redis 缓存降频，MongoDB 双向查询详情。后端新增/改动 13 处文件编译 0 错误，PostgreSQL / MongoDB / Redis / Kibana 四类 MCP 实际联调，人工修正 6 处（业务 1 / 安全 2 / 编译 2 / 健壮性 1）。",
      stack: [
        ["Claude Code", "AI Agent 编码执行主体"],
        ["Superpowers Skills", "brainstorming / writing-plans / subagent / worktree 串联"],
        ["MCP", "直连 PG / Mongo / Redis / Kibana 联调验证"],
        ["PostgreSQL", "会话表幂等 upsert 与 A↔B 去重"],
        ["MongoDB", "消息原文归档与双向详情查询"],
        ["Redis", "会话上下文缓存与消息去重"]
      ],
      links: [{ label: "内部项目", url: "#" }]
    },
    {
      mark: "RC", title: "风控系统优化改造",
      tags: ["批处理幂等", "Regex.Escape", "escapeHtml", "布隆过滤器", "冷热 TTL"],
      desc: "针对已上线的内部私聊功能进行三项改造：① 补历史数据——分批扫 MongoDB（≤1000 条/批）复用识别逻辑幂等 upsert，first_msg_time 取真实消息时间，已存在会话只更新 lately_time；② 搜索增强——Mongo 查询用 Regex.Escape 防正则注入，前端先 escapeHtml 再高亮防 XSS，链接校验 http(s) 协议白名单；③ 缓存策略——热会话 TTL 1h 主动刷新、冷会话 7d 被动命中，布隆过滤器防穿透并同步补历史新建的会话。改造后第 2 周 6 类问题全部归零，仅新增 2 处改造特有的坑。",
      stack: [
        ["批处理幂等", "分批 ≤1000 条，幂等可重跑"],
        ["Regex.Escape", "Mongo 搜索防正则注入"],
        ["escapeHtml + 协议白名单", "前端防 XSS，链接校验 http(s)"],
        ["布隆过滤器", "防缓存穿透，同步新建会话"],
        ["冷热 TTL", "热 1h 主动刷新 / 冷 7d 被动命中"]
      ],
      links: [{ label: "内部项目", url: "#" }]
    },
    {
      mark: "SOP", title: "AI Agent 辅助开发工作流 SOP",
      tags: ["五步流程", "Custom Rules", "自检清单", "校验点", "MCP 联调"],
      desc: "把三周实践沉淀成可复用工作流，五步流程每步固定产出物：① 拆需求（brainstorming 多轮提问确认业务规则，产出需求清单）→ ② 定计划（writing-plans 出分步 checkbox，每项加回归验证）→ ③ 写代码（worktree 隔离 + 子代理逐任务执行，生成前先加载自检清单）→ ④ 联调验证（MCP 直连开发环境跑全链路，改完再验现有链路没坏）→ ⑤ 查质量（Code Review + 校验点清单兜底）。配套上下文注入模板、Custom Rules、自检清单（8 处修正固化）、校验点清单（安全 / 业务 / 回归三类）与 MCP 多存储联调组合，可迁移给团队。",
      stack: [
        ["五步流程", "拆需求 → 定计划 → 写代码 → 联调 → 查质量"],
        ["Custom Rules", "分层 / 编码 / 命名 / MCP 红线硬约束"],
        ["自检清单", "8 处修正固化，生成前前置拦截"],
        ["校验点清单", "安全 / 业务 / 回归三类人工兜底"],
        ["MCP 联调组合", "PG / Mongo / Redis / Kibana 多存储验证"]
      ],
      links: [{ label: "内部方法论", url: "#" }]
    },
    {
      mark: "JI", title: "juse.infrastructure 基础设施层",
      tags: ["Juse.SqlSugar", "Juse.Cap", "Juse.Redis", "Juse.Consul", "Juse.Apollo", "Juse.Log"],
      desc: "共享基础设施组件库，以 Juse.* 命名空间独立打包，各微服务通过 NuGet 按需引用。涵盖 SqlSugar 多库封装（自动配置主从库）、CAP 事件总线（RabbitMQ 传输 + MySQL 存储）、FreeRedis 分布式缓存、Consul 服务注册与发现、Apollo 配置中心、SkyWalking APM 链路追踪、NLog 日志封装、AutoMapper、Swagger 等，各微服务在 Startup 中通过 services.AddXxx() 扩展方法按需启用。",
      stack: [
        ["Juse.SqlSugar", "ORM 多库封装与主从配置"],
        ["Juse.Cap", "事件总线（RabbitMQ 传输 + MySQL 存储）"],
        ["Juse.Redis", "FreeRedis 分布式缓存封装"],
        ["Juse.Consul", "服务注册与发现"],
        ["Juse.Apollo", "配置中心集成"],
        ["Juse.SkyWalking / Juse.Log", "链路追踪与 NLog 日志"]
      ],
      links: [{ label: "内部组件库", url: "#" }]
    }
  ];

  var HOME_IDS = ["hero", "skills", "about", "projects", "contact"];
  var detailSec = document.getElementById("projectDetail");
  var detailContainer = document.getElementById("detailContainer");

  // 转义，防 XSS
  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function showHome(forceVisible) {
    HOME_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = false;
    });
    if (detailSec) detailSec.hidden = true;
    // 从详情返回时强制显示首页动画元素（避免仍处于 opacity:0）
    if (forceVisible) {
      document.querySelectorAll("#hero .reveal, #skills .reveal, #about .reveal, #projects .reveal, #contact .reveal")
        .forEach(function (el) { el.classList.add("visible"); });
    }
  }

  function showDetail(idx) {
    var p = PROJECTS[idx - 1];
    if (!p) { showHome(true); return; }
    detailContainer.innerHTML = renderDetail(p);

    HOME_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    detailSec.hidden = false;
    window.scrollTo(0, 0);

    // 绑定返回按钮
    detailContainer.querySelectorAll(".js-back").forEach(function (btn) {
      btn.addEventListener("click", goHome);
    });
  }

  function goHome() {
    if (location.hash) {
      history.pushState(null, "", location.pathname + location.search);
    }
    showHome(true);
    var projects = document.getElementById("projects");
    if (projects) projects.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderDetail(p) {
    var tags = p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    var stack = p.stack.map(function (s) {
      return '<div class="stack-item"><span class="stack-name">' + esc(s[0]) +
        '</span><span class="stack-desc">' + esc(s[1]) + "</span></div>";
    }).join("");
    var links = p.links.map(function (l) {
      var href = l.url && l.url !== "#" ? l.url : "#";
      var attr = href !== "#" ? ' target="_blank" rel="noopener"' : ' onclick="return false"';
      return '<a class="btn btn-ghost" href="' + esc(href) + '"' + attr + ">" + esc(l.label) + "</a>";
    }).join("");

    return (
      '<button class="detail-back js-back" type="button">← 返回项目列表</button>' +
      '<div class="detail-hero">' +
        '<div class="detail-cover"><span class="project-mark">' + esc(p.mark) + "</span></div>" +
        '<div class="detail-head">' +
          '<h1 class="detail-title">' + esc(p.title) + "</h1>" +
          '<ul class="tags">' + tags + "</ul>" +
        "</div>" +
      "</div>" +
      '<div class="detail-section"><h2 class="detail-h2">项目简介</h2><p class="detail-desc">' + esc(p.desc) + "</p></div>" +
      '<div class="detail-section"><h2 class="detail-h2">技术栈</h2><div class="stack-grid">' + stack + "</div></div>" +
      '<div class="detail-section"><h2 class="detail-h2">相关链接</h2><div class="detail-links">' + links +
        '<button class="btn btn-primary js-back" type="button">返回首页</button>' +
      "</div></div>"
    );
  }

  function router() {
    var hash = location.hash || "";
    var m = hash.match(/^#project\/(\d+)/);
    if (m) { showDetail(parseInt(m[1], 10)); return; }
    showHome();
  }

  window.addEventListener("hashchange", router);
  window.addEventListener("popstate", router);
  router();
})();
