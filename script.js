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
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      }
    });
  });
})();
