import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const SITE_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_DIR = path.dirname(SITE_DIR);
const PACKAGED_CONTENT_DIR = path.join(SITE_DIR, "content");
const CONTENT_DIR = fs.existsSync(path.join(PACKAGED_CONTENT_DIR, "index.md"))
  ? PACKAGED_CONTENT_DIR
  : path.join(WORKSPACE_DIR, "大模型面试题_Markdown");
const FEISHU_URL = "https://v11enp9ok1h.feishuapp.com/app/app_17g2mxyqr88";
const SITE_NAME = "AI 产品经理面试图谱";
const SITE_TAGLINE = "用业务判断、技术取舍和评测指标，拆解 AI 产品经理面试追问";
const SITE_URL = (process.env.SITE_URL || "https://yy3413230124-cell.github.io/ai-pm-interview").replace(/\/+$/, "");
const SITE_START_PATH = new URL(SITE_URL).pathname.replace(/\/?$/, "/");
const SITE_UPDATED = "2026-10-27";
const SITE_DESCRIPTION =
  "面向 AI 产品经理的面试题库，覆盖 Agent、RAG、工具调用、大模型工程、LangChain 与 AI 编程。每道题包含追问演练、原理拆解和产品经理作答提示。";

const CATEGORY_ORDER = ["agent", "rag", "tools", "llm", "langchain", "coding"];
const CATEGORIES = {
  agent: {
    name: "Agent",
    fullName: "Agent 面试专题",
    index: "01",
    color: "#4687f2",
    soft: "#eaf2ff",
    acid: "#d9ff69",
    tagline: "从自主闭环、ReAct 到多 Agent 治理",
    description:
      "覆盖 Agent 概念、设计范式、记忆、上下文、评测、稳定性与多 Agent 协作，把工程追问一条线讲透。",
  },
  rag: {
    name: "RAG",
    fullName: "RAG 面试专题",
    index: "02",
    color: "#f08a24",
    soft: "#fff0dd",
    acid: "#ffe56b",
    tagline: "从索引构建、召回优化到生产落地",
    description:
      "从 Chunking、Embedding、向量检索到 Query Rewrite、知识冲突和效果评估，覆盖完整 RAG 链路。",
  },
  tools: {
    name: "工具调用",
    fullName: "工具调用面试专题",
    index: "03",
    color: "#11a879",
    soft: "#e2fbf1",
    acid: "#bfffd8",
    tagline: "Function Calling、MCP、Skill 与 A2A",
    description:
      "厘清工具调用体系的分层关系，覆盖 MCP 架构、通信协议、路由、容错、沙箱与 Skill 加载。",
  },
  llm: {
    name: "大模型工程",
    fullName: "大模型工程面试专题",
    index: "04",
    color: "#7a5af8",
    soft: "#efeaff",
    acid: "#d9ccff",
    tagline: "从 Transformer、训练到推理与部署",
    description:
      "从底层架构、Post-Training、推理生成到量化、MoE、部署与模型选型，建立完整的大模型工程视角。",
  },
  langchain: {
    name: "LangChain",
    fullName: "LangChain 框架面试专题",
    index: "05",
    color: "#1598c8",
    soft: "#e5f7ff",
    acid: "#9aefee",
    tagline: "从 Chain、Runnable 到 LangGraph",
    description:
      "理解 LangChain、LangGraph、LlamaIndex 与 LangChain4j 的定位，掌握 Agent 编排和记忆工程。",
  },
  coding: {
    name: "AI 编程",
    fullName: "AI 编程面试专题",
    index: "06",
    color: "#e94f72",
    soft: "#ffe8ee",
    acid: "#ffb7c8",
    tagline: "需求、上下文、代码审查与任务接续",
    description:
      "从需求表达、代码定位、生成质量、调试、审查到跨会话接续，覆盖 AI 编程的真实工程边界。",
  },
};

const PM_LENS = {
  agent:
    "先说明业务目标与任务边界，再判断是否需要自主闭环、哪些动作必须审批，最后用成功率、任务完成时长、人工接管率和 Trace 证明有效。",
  rag:
    "先拆清知识来源、用户问题与更新频率，再解释召回、生成和引用的取舍，最后用命中率、答案正确率、引用覆盖率和延迟定义上线标准。",
  tools:
    "先说清模型负责决策、代码负责执行，再划分工具权限、参数校验、失败重试和人工确认，最后用工具成功率、误调用率与成本验证方案。",
  llm:
    "不要只背架构名词。先说明业务约束，再讲模型能力、延迟、成本与可控性的权衡，最后给出离线评测和线上灰度指标。",
  langchain:
    "先判断团队需要的是快速验证还是长期可控编排，再讨论框架抽象与运行时可观测性，避免只回答“用过某个 Chain”。",
  coding:
    "把 AI 编程当成交付流程设计：需求与验收标准是否清楚、上下文是否充分、结果如何验证、出错后怎样回滚和接续。",
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath, content) {
  const destination = path.join(SITE_DIR, relativePath);
  ensureDir(path.dirname(destination));
  fs.writeFileSync(destination, content, "utf8");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function stripMarkdown(value = "") {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/^[#>*+\-\d.\s|:]+/gm, " ")
    .replace(/[\\*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearch(value = "") {
  return stripMarkdown(value)
    .toLocaleLowerCase("zh-CN")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function slugifyHeading(value, seen) {
  const base =
    value
      .toLocaleLowerCase("zh-CN")
      .replace(/<[^>]+>/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function naturalCompare(a, b) {
  return a.localeCompare(b, "zh-CN", { numeric: true, sensitivity: "base" });
}

function getFirstHeading(markdown) {
  const line = markdown.split(/\r?\n/).find((entry) => /^#\s+/.test(entry));
  return line ? line.replace(/^#\s+/, "").trim() : "未命名面试题";
}

function removeFirstHeading(markdown) {
  return markdown.replace(/^#\s+[^\r\n]+(?:\r?\n)+/m, "").trim();
}

function extractSummary(markdown) {
  const headingMatch = markdown.match(/^##\s+.*简要回答.*$/m);
  let section = "";
  if (headingMatch?.index !== undefined) {
    const afterHeading = markdown.slice(headingMatch.index + headingMatch[0].length);
    const nextH2 = afterHeading.search(/^##\s+/m);
    section = nextH2 >= 0 ? afterHeading.slice(0, nextH2) : afterHeading;
  } else {
    section = removeFirstHeading(markdown);
  }
  const paragraph = section
    .split(/\r?\n\s*\r?\n/)
    .map((entry) => entry.trim())
    .find(
      (entry) =>
        entry &&
        !entry.startsWith("#") &&
        !entry.startsWith("```") &&
        !entry.startsWith("|") &&
        !entry.startsWith("!["),
    );
  const summary = stripMarkdown(paragraph || section);
  return summary.length > 138 ? `${summary.slice(0, 138).trim()}…` : summary;
}

function getIndexOrder() {
  const indexPath = path.join(CONTENT_DIR, "index.md");
  if (!fs.existsSync(indexPath)) return new Map();
  const indexText = fs.readFileSync(indexPath, "utf8");
  const order = new Map();
  for (const match of indexText.matchAll(/\]\(((?:agent|rag|tools|llm|langchain|coding)\/[^)]+\.md)\)/g)) {
    const key = match[1].replace(/\.md$/, "");
    if (!order.has(key)) order.set(key, order.size);
  }
  return order;
}

function getCategoryIntro(category) {
  const infoPath = path.join(CONTENT_DIR, category, `${category}_info.md`);
  if (!fs.existsSync(infoPath)) return CATEGORIES[category].description;
  const markdown = fs.readFileSync(infoPath, "utf8");
  const body = removeFirstHeading(markdown);
  const intro = body
    .split(/\r?\n\s*\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry && !entry.startsWith("#") && !entry.startsWith("大家好"));
  return stripMarkdown(intro || CATEGORIES[category].description);
}

const indexOrder = getIndexOrder();
const articleRegistry = new Map();
const articles = [];

for (const category of CATEGORY_ORDER) {
  const categoryDir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(categoryDir)) continue;
  const files = fs
    .readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .filter((entry) => !entry.name.endsWith("_info.md"))
    .map((entry) => entry.name);

  for (const filename of files) {
    const markdown = fs.readFileSync(path.join(categoryDir, filename), "utf8");
    const title = getFirstHeading(markdown);
    const numberMatch = title.match(/^(\d+)[.、]\s*/);
    const base = filename.replace(/\.md$/i, "");
    const registryKey = `${category}/${base}`;
    const href = `articles/${category}/${base}.html`;
    const headings = [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => ({
      level: match[1].length,
      text: stripMarkdown(match[2]),
    }));
    const plain = stripMarkdown(removeFirstHeading(markdown));
    const titleWithoutNumber = title.replace(/^\d+[.、]\s*/, "").trim();
    const summary = extractSummary(markdown) || CATEGORIES[category].description;
    const article = {
      category,
      filename,
      base,
      registryKey,
      href,
      title,
      displayTitle: titleWithoutNumber || title,
      number: numberMatch ? Number(numberMatch[1]) : null,
      summary,
      charCount: plain.replace(/\s/g, "").length,
      readingMinutes: Math.max(3, Math.ceil(plain.replace(/\s/g, "").length / 420)),
      headings,
      cardSearchText: [title, summary, ...headings.map((heading) => heading.text)].join(" "),
      searchText: [title, summary, ...headings.map((heading) => heading.text), plain.slice(0, 1800)]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    };
    articleRegistry.set(registryKey, article);
    articles.push(article);
  }
}

for (const category of CATEGORY_ORDER) {
  const categoryArticles = articles.filter((article) => article.category === category);
  categoryArticles.sort((a, b) => {
    const aOrder = indexOrder.get(a.registryKey);
    const bOrder = indexOrder.get(b.registryKey);
    if (aOrder !== undefined || bOrder !== undefined) {
      return (aOrder ?? Number.MAX_SAFE_INTEGER) - (bOrder ?? Number.MAX_SAFE_INTEGER);
    }
    return naturalCompare(a.filename, b.filename);
  });
  categoryArticles.forEach((article, index) => {
    article.categoryIndex = index + 1;
  });
}

articles.sort(
  (a, b) =>
    CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
    a.categoryIndex - b.categoryIndex,
);

const markdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,
});

markdownIt.core.ruler.after("inline", "atlas-heading-anchors", (state) => {
  const seen = new Map();
  state.env.headings = [];
  for (let index = 0; index < state.tokens.length; index += 1) {
    const token = state.tokens[index];
    if (token.type !== "heading_open" || !["h2", "h3"].includes(token.tag)) continue;
    const inline = state.tokens[index + 1];
    if (!inline || inline.type !== "inline") continue;
    const plainHeading = stripMarkdown(inline.content);
    const id = slugifyHeading(plainHeading, seen);
    token.attrSet("id", id);
    state.env.headings.push({
      level: Number(token.tag.slice(1)),
      text: plainHeading,
      id,
    });
  }
});

markdownIt.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = (token.info || "").trim().split(/\s+/)[0] || "code";
  const label = escapeHtml(language.toUpperCase());
  return `<div class="code-shell"><div class="code-toolbar"><span>${label}</span><button class="copy-code" type="button" aria-label="复制代码">复制</button></div><pre><code class="language-${escapeAttr(language)}">${escapeHtml(token.content)}</code></pre></div>`;
};

markdownIt.renderer.rules.table_open = () => '<div class="table-shell"><table>';
markdownIt.renderer.rules.table_close = () => "</table></div>";

markdownIt.renderer.rules.image = (tokens, index, options, env) => {
  const token = tokens[index];
  let src = token.attrGet("src") || "";
  if (src.startsWith("../assets/")) src = `../../${src.slice(3)}`;
  if (src.startsWith("assets/")) src = `../../${src}`;
  if (/\/images-redrawn\/[^"]+\.png$/i.test(src)) {
    const webpSource = src.replace(/\.png$/i, ".webp");
    const webpPath = path.join(SITE_DIR, webpSource.replace(/^(\.\.\/)+/, ""));
    if (fs.existsSync(webpPath)) src = webpSource;
  }
  const genericAlt = !token.content || /^(正文配图|文章配图)$/i.test(token.content);
  const alt = genericAlt
    ? `${env.currentArticle?.displayTitle || "AI产品经理面试题"}的知识结构配图`
    : token.content;
  const caption =
    !genericAlt && alt
      ? `<span class="article-caption">${escapeHtml(alt)}</span>`
      : "";
  return `<span class="article-figure"><button class="image-zoom" type="button" aria-label="放大查看配图"><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async"></button>${caption}</span>`;
};

const defaultLinkOpen =
  markdownIt.renderer.rules.link_open ||
  ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));

markdownIt.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const href = token.attrGet("href") || "";
  if (/^https?:\/\//i.test(href)) {
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noreferrer noopener");
  } else if (href.endsWith(".md") && env.currentArticle) {
    const currentDir = env.currentArticle.category;
    const resolved = path.posix.normalize(path.posix.join(currentDir, href)).replace(/\.md$/i, "");
    const target = articleRegistry.get(resolved);
    if (target) {
      token.attrSet("href", path.posix.relative(path.posix.dirname(env.currentArticle.href), target.href));
    }
  }
  return defaultLinkOpen(tokens, index, options, env, self);
};

function icon(name, className = "") {
  const icons = {
    search:
      '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
    arrow:
      '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    shuffle:
      '<path d="M16 3h5v5"></path><path d="M4 20 21 3"></path><path d="M21 16v5h-5"></path><path d="m15 15 6 6"></path><path d="M4 4l5 5"></path>',
    external:
      '<path d="M14 4h6v6"></path><path d="m20 4-9 9"></path><path d="M18 13v7H4V6h7"></path>',
    book:
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h8M8 11h6"></path>',
    top: '<path d="m5 14 7-7 7 7"></path><path d="M12 7v13"></path>',
    clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    spark:
      '<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"></path>',
    copy:
      '<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"></path>',
  };
  return `<svg class="icon ${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ""}</svg>`;
}

function rootPath(root, relative) {
  return `${root}${relative}`;
}

function navMarkup(root, page = "home") {
  const active = (name) => (page === name ? ' class="is-active"' : "");
  return `
    <header class="site-header" data-header>
      <div class="nav-shell">
        <a class="brand" href="${rootPath(root, "index.html")}" aria-label="${SITE_NAME} 首页">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="brand-copy"><strong>${SITE_NAME}</strong><small>AI PM INTERVIEW ATLAS</small></span>
        </a>
        <nav class="desktop-nav" aria-label="主导航">
          <a${active("home")} href="${rootPath(root, "index.html")}">首页</a>
          <a${active("library")} href="${rootPath(root, "index.html")}#library">面试题库</a>
          <a${active("topics")} href="${rootPath(root, "index.html")}#topics">知识专题</a>
          <a${active("guide")} href="${rootPath(root, "guide.html")}">备考指南</a>
        </nav>
        <div class="nav-actions">
          <button class="icon-button search-trigger" type="button" aria-label="搜索题目" data-search-open>${icon("search")}</button>
          <button class="button button-small random-trigger" type="button" data-random>${icon("shuffle")}<span>随机抽题</span></button>
          <a class="button button-small button-accent nav-feishu" href="${FEISHU_URL}" target="_blank" rel="noreferrer noopener">${icon("external")}<span>飞书应用</span></a>
          <button class="icon-button menu-trigger" type="button" aria-label="打开菜单" data-menu-open>${icon("menu")}</button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer" data-mobile-drawer hidden>
      <button class="drawer-backdrop" type="button" aria-label="关闭菜单" data-menu-close></button>
      <aside class="drawer-panel">
        <div class="drawer-head">
          <span class="eyebrow">QUICK NAV</span>
          <button class="icon-button" type="button" aria-label="关闭菜单" data-menu-close>${icon("close")}</button>
        </div>
        <nav>
          <a href="${rootPath(root, "index.html")}">首页 <span>01</span></a>
          <a href="${rootPath(root, "index.html")}#library">全部面试题 <span>02</span></a>
          <a href="${rootPath(root, "index.html")}#topics">六类专题 <span>03</span></a>
          <a href="${rootPath(root, "guide.html")}">备考指南 <span>04</span></a>
        </nav>
        <div class="drawer-topics">
          ${CATEGORY_ORDER.map(
            (category) =>
              `<a href="${rootPath(root, `category/${category}.html`)}"><i style="--cat:${CATEGORIES[category].color}"></i>${CATEGORIES[category].name}</a>`,
          ).join("")}
        </div>
        <a class="button drawer-feishu" href="${FEISHU_URL}" target="_blank" rel="noreferrer noopener">打开飞书学习应用 ${icon("arrow")}</a>
      </aside>
    </div>
    <dialog class="search-dialog" aria-label="搜索全部面试题" data-search-dialog>
      <div class="search-shell">
        <div class="search-head">
          <span class="search-icon">${icon("search")}</span>
          <input type="search" placeholder="搜索 Agent、RAG、MCP、LoRA…" autocomplete="off" data-search-input>
          <kbd>Esc</kbd>
          <button class="icon-button" type="button" aria-label="关闭搜索" data-search-close>${icon("close")}</button>
        </div>
        <div class="search-hint">输入关键词，从 124 道题中快速定位。</div>
        <div class="search-results" data-search-results></div>
      </div>
    </dialog>
    <dialog class="lightbox" data-lightbox>
      <button class="lightbox-close icon-button" type="button" aria-label="关闭图片预览" data-lightbox-close>${icon("close")}</button>
      <img alt="" data-lightbox-image>
    </dialog>`;
}

function footerMarkup(root) {
  return `
    <footer class="site-footer">
      <div class="footer-shell">
        <div class="footer-brand">
          <a class="brand brand-inverse" href="${rootPath(root, "index.html")}">
            <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="brand-copy"><strong>${SITE_NAME}</strong><small>AI PM INTERVIEW ATLAS</small></span>
          </a>
          <p>${SITE_TAGLINE}。</p>
        </div>
        <div class="footer-links">
          <div>
            <h4>开始学习</h4>
            <a href="${rootPath(root, "index.html")}#library">全部面试题</a>
            <a href="${rootPath(root, "index.html")}#topics">六类专题</a>
            <a href="${rootPath(root, "guide.html")}">备考指南</a>
          </div>
          <div>
            <h4>热门专题</h4>
            <a href="${rootPath(root, "category/agent.html")}">Agent</a>
            <a href="${rootPath(root, "category/rag.html")}">RAG</a>
            <a href="${rootPath(root, "category/tools.html")}">工具调用</a>
          </div>
          <div>
            <h4>继续互动</h4>
            <a href="${FEISHU_URL}" target="_blank" rel="noreferrer noopener">飞书学习应用 ↗</a>
            <a href="${rootPath(root, "index.html")}#method">答题框架</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ${SITE_NAME}</span>
        <span>面试情境为教学化模拟，不代表真实公司、候选人、面试结果或业务效果。</span>
      </div>
    </footer>
    <nav class="mobile-bottom-nav" aria-label="移动端快捷导航">
      <a href="${rootPath(root, "index.html")}">${icon("book")}<span>首页</span></a>
      <a href="${rootPath(root, "index.html")}#library">${icon("search")}<span>题库</span></a>
      <button type="button" data-random>${icon("shuffle")}<span>随机</span></button>
      <a href="${FEISHU_URL}" target="_blank" rel="noreferrer noopener">${icon("external")}<span>飞书</span></a>
    </nav>
    <button class="back-to-top" type="button" aria-label="返回顶部" data-back-top>${icon("top")}</button>`;
}

function scriptMarkup(root) {
  return `<script src="${rootPath(root, "assets/search-index.js")}"></script><script src="${rootPath(root, "app.js")}" defer></script>`;
}

function pageShell({
  root,
  page,
  title,
  description,
  canonicalPath,
  bodyClass = "",
  main,
  bodyAttrs = "",
  pageType = "website",
  keywords = "AI产品经理面试题,AI产品经理,Agent面试题,RAG面试题",
  schema = null,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
}) {
  const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const socialImageUrl = `${SITE_URL}/assets/og-cover.png`;
  const schemaMarkup = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`
    : "";
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f6f7">
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="keywords" content="${escapeAttr(keywords)}">
  <meta name="robots" content="${escapeAttr(robots)}">
  <meta name="format-detection" content="telephone=no">
  <link rel="canonical" href="${escapeAttr(canonicalUrl)}">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${rootPath(root, "assets/favicon.svg")}" type="image/svg+xml">
  <link rel="manifest" href="${rootPath(root, "assets/site.webmanifest")}">
  <link rel="stylesheet" href="${rootPath(root, "styles/fonts.css")}">
  <link rel="stylesheet" href="${rootPath(root, "styles.css")}">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:type" content="${escapeAttr(pageType)}">
  <meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${escapeAttr(canonicalUrl)}">
  <meta property="og:image" content="${escapeAttr(socialImageUrl)}">
  <meta property="og:image:alt" content="AI产品经理面试图谱：Agent、RAG 与技术面试题">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${escapeAttr(socialImageUrl)}">
  ${schemaMarkup}
</head>
<body class="${escapeAttr(bodyClass)}" data-root="${escapeAttr(root)}" ${bodyAttrs}>
  <a class="skip-link" href="#main-content">跳到正文</a>
  ${navMarkup(root, page)}
  <main id="main-content">${main}</main>
  ${footerMarkup(root)}
  ${scriptMarkup(root)}
</body>
</html>`;
}

function articleCard(article, root, hidden = false) {
  const category = CATEGORIES[article.category];
  const number = String(article.number ?? article.categoryIndex).padStart(2, "0");
  return `
    <article class="question-card" data-question-card data-category="${article.category}" data-search="${escapeAttr(normalizeSearch(article.cardSearchText))}" data-href="${escapeAttr(article.href)}"${hidden ? " hidden" : ""}>
      <a class="card-cover" href="${rootPath(root, article.href)}" style="--cat:${category.color};--soft:${category.soft};--acid:${category.acid}" aria-label="阅读：${escapeAttr(article.displayTitle)}">
        <span class="cover-kicker">${category.index} / ${category.name.toUpperCase()}</span>
        <span class="cover-index">${number}</span>
        <span class="cover-mark">AI<br>Q&amp;A</span>
        <span class="cover-orbit orbit-one"></span>
        <span class="cover-orbit orbit-two"></span>
        <span class="cover-dot"></span>
      </a>
      <div class="card-body">
        <div class="card-meta">
          <span class="topic-label" style="--cat:${category.color};--soft:${category.soft}">${category.name}</span>
          <span class="reading-time">${icon("clock")} ${article.readingMinutes} 分钟</span>
        </div>
        <h3><a href="${rootPath(root, article.href)}">${escapeHtml(article.displayTitle)}</a></h3>
        <p>${escapeHtml(article.summary)}</p>
        <div class="card-footer">
          <span>QUESTION ${number}</span>
          <a href="${rootPath(root, article.href)}">阅读全文 ${icon("arrow")}</a>
        </div>
      </div>
    </article>`;
}

function homeMarkup(root) {
  const totalMinutes = articles.reduce((sum, article) => sum + article.readingMinutes, 0);
  const totalHours = Math.ceil(totalMinutes / 60);
  const cards = articles
    .map((article, index) => articleCard(article, root, index >= 16))
    .join("");
  return `
    <section class="home-hero-wrap">
      <div class="home-hero reveal">
        <div class="hero-copy">
          <span class="eyebrow"><i></i> AI PRODUCT MANAGER INTERVIEW ATLAS · 2026</span>
          <h1>AI产品经理面试题<br><span>从会答到会判断。</span></h1>
          <p class="hero-lead">不只背模型概念。用业务目标、技术取舍、失败兜底和评测指标，系统准备 Agent、RAG、工具调用与工程追问。</p>
          <div class="hero-actions">
            <a class="button button-primary button-large" href="#library">开始练面试题 ${icon("arrow")}</a>
            <button class="button button-large button-ghost" type="button" data-random>${icon("shuffle")} 随机抽一题</button>
          </div>
          <div class="hero-stats" aria-label="题库统计">
            <div><strong>${articles.length}</strong><span>道技术面试题</span></div>
            <div><strong>${CATEGORY_ORDER.length}</strong><span>个知识专题</span></div>
            <div><strong>${totalHours}h</strong><span>完整复习时长</span></div>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="art-grid"></div>
          <div class="art-card art-card-main">
            <span class="art-label">PM QUESTION / 01</span>
            <strong>如何定义<br>Agent 的任务边界？</strong>
            <div class="art-answer"><i></i><i></i><i></i><span>业务闭环</span></div>
            <div class="art-tags"><span>场景</span><span>取舍</span><span>评测</span></div>
          </div>
          <div class="art-card art-card-small"><span>PM LENS</span><strong>先业务，后技术</strong><i></i></div>
          <div class="art-node art-node-one">?</div>
          <div class="art-node art-node-two">✓</div>
          <div class="art-note">从“知道名词”<br>到“讲清取舍”</div>
          <svg class="art-line" viewBox="0 0 520 480" fill="none"><path d="M48 410C113 310 151 350 225 275S361 187 472 72" stroke="currentColor" stroke-width="2" stroke-dasharray="7 8"/></svg>
        </div>
      </div>
      <div class="trust-strip reveal">
        <span>面试化连续追问</span><i></i><span>技术与产品双视角</span><i></i><span>失败与评测框架</span><i></i><span>移动端随时复习</span>
      </div>
    </section>

    <section class="section pm-method-section" id="method">
      <div class="pm-method-intro reveal">
        <span class="section-kicker">HOW AI PMs ANSWER</span>
        <h2>AI产品经理面试题，<br>真正考的是判断。</h2>
        <p>同一个技术词，产品经理需要多回答一层：为什么做、为什么现在做、为什么不用更简单的方案，以及怎样证明上线后有效。</p>
        <a class="button" href="${rootPath(root, "guide.html")}">查看完整备考指南 ${icon("arrow")}</a>
      </div>
      <ol class="pm-method-grid">
        <li class="reveal"><span>01</span><strong>业务目标</strong><p>先定义用户任务、价值与不做什么，避免一上来堆技术名词。</p></li>
        <li class="reveal"><span>02</span><strong>方案取舍</strong><p>比较 Workflow、Agent、RAG 或微调的边界、成本与可控性。</p></li>
        <li class="reveal"><span>03</span><strong>失败兜底</strong><p>说清什么时候重试、回滚、转人工，以及哪些动作必须审批。</p></li>
        <li class="reveal"><span>04</span><strong>评测迭代</strong><p>用离线评测、线上指标、Trace 和灰度计划证明产品价值。</p></li>
      </ol>
    </section>

    <section class="section topics-section" id="topics">
      <div class="section-heading reveal">
        <div>
          <span class="section-kicker">TOPIC MAP</span>
          <h2>六个高频技术专题</h2>
        </div>
        <p>从一项能力切入，沿 AI 产品经理常见的工程追问逐层展开。</p>
      </div>
      <div class="topic-grid">
        ${CATEGORY_ORDER.map((category) => {
          const meta = CATEGORIES[category];
          const count = articles.filter((article) => article.category === category).length;
          return `
            <a class="topic-card reveal" href="${rootPath(root, `category/${category}.html`)}" style="--cat:${meta.color};--soft:${meta.soft};--acid:${meta.acid}">
              <span class="topic-number">${meta.index}</span>
              <span class="topic-arrow">${icon("arrow")}</span>
              <strong>${meta.fullName}</strong>
              <p>${meta.tagline}</p>
              <span class="topic-count">${count} QUESTIONS</span>
            </a>`;
        }).join("")}
      </div>
    </section>

    <section class="section library-section" id="library">
      <div class="section-heading reveal">
        <div>
          <span class="section-kicker">QUESTION LIBRARY</span>
          <h2>全部面试题</h2>
        </div>
        <p class="library-total"><strong data-result-count>${articles.length}</strong> / ${articles.length} 道题</p>
      </div>
      <div class="library-toolbar reveal">
        <div class="filter-chips" role="group" aria-label="按专题筛选">
          <button class="filter-chip is-active" type="button" data-filter="all">全部 <span>${articles.length}</span></button>
          ${CATEGORY_ORDER.map((category) => {
            const count = articles.filter((article) => article.category === category).length;
            return `<button class="filter-chip" type="button" data-filter="${category}"><i style="--cat:${CATEGORIES[category].color}"></i>${CATEGORIES[category].name} <span>${count}</span></button>`;
          }).join("")}
        </div>
        <label class="inline-search">
          ${icon("search")}
          <input type="search" placeholder="筛选标题、知识点…" data-library-search>
          <kbd>/</kbd>
        </label>
      </div>
      <div class="question-grid" data-question-grid>
        ${cards}
      </div>
      <div class="library-empty" data-library-empty hidden>
        <span>?</span>
        <h3>没有找到匹配题目</h3>
        <p>换个关键词，或者按专题重新筛选。</p>
        <button class="button" type="button" data-reset-filter>清空筛选</button>
      </div>
      <div class="load-more-wrap">
        <button class="load-more" type="button" data-load-more><span>继续加载</span><strong data-load-more-count>${Math.max(0, articles.length - 16)}</strong> 道</button>
      </div>
    </section>

    <section class="guide-section" id="guide">
      <div class="guide-card reveal">
        <div class="guide-intro">
          <span class="section-kicker">HOW TO USE</span>
          <h2>三轮复习，<br>把题真正吃透。</h2>
          <p>总阅读时长约 ${totalHours} 小时。先建立地图，再攻薄弱专题，最后用连续追问模拟面试。</p>
        </div>
        <ol class="guide-steps">
          <li><span>01</span><div><strong>扫一遍专题地图</strong><p>先挑最薄弱的方向，不按题目序号硬背。</p></div></li>
          <li><span>02</span><div><strong>先读追问演练与简要回答</strong><p>先暴露盲点，再进入详细解析，带着问题阅读。</p></div></li>
          <li><span>03</span><div><strong>顺着配图和追问复述</strong><p>合上文章，用自己的话讲清架构、取舍和失败条件。</p></div></li>
        </ol>
      </div>
    </section>`;
}

function categoryMarkup(category, root) {
  const meta = CATEGORIES[category];
  const categoryArticles = articles.filter((article) => article.category === category);
  const intro = getCategoryIntro(category);
  return `
    <section class="category-hero" style="--cat:${meta.color};--soft:${meta.soft};--acid:${meta.acid}">
      <div class="category-hero-copy reveal">
        <a class="breadcrumb" href="${rootPath(root, "index.html")}">首页</a>
        <span class="category-index">${meta.index}</span>
        <span class="eyebrow">INTERVIEW TOPIC · ${meta.name.toUpperCase()}</span>
        <h1>${meta.fullName}</h1>
        <p>${escapeHtml(intro)}</p>
        <div class="category-actions">
          <a class="button button-primary" href="#question-list">查看 ${categoryArticles.length} 道题 ${icon("arrow")}</a>
          <button class="button" type="button" data-random>${icon("shuffle")} 随机抽题</button>
        </div>
      </div>
      <div class="category-art" aria-hidden="true">
        <span class="category-art-label">${meta.name}</span>
        <strong>${String(categoryArticles.length).padStart(2, "0")}</strong>
        <span>QUESTIONS</span>
        <i class="category-art-orbit"></i>
        <i class="category-art-grid"></i>
      </div>
    </section>
    <section class="section category-library" id="question-list">
      <div class="section-heading">
        <div><span class="section-kicker">ALL QUESTIONS</span><h2>${meta.name} 题目列表</h2></div>
        <p>${escapeHtml(meta.tagline)}</p>
      </div>
      <div class="question-grid">
        ${categoryArticles.map((article) => articleCard(article, root)).join("")}
      </div>
    </section>`;
}

function guideMarkup(root) {
  return `
    <section class="guide-hero">
      <div class="guide-hero-copy reveal">
        <a class="breadcrumb" href="${rootPath(root, "index.html")}">首页 / 备考指南</a>
        <span class="eyebrow"><i></i> AI PRODUCT MANAGER INTERVIEW GUIDE</span>
        <h1>AI产品经理面试怎么准备？</h1>
        <p>把技术名词翻译成产品判断：先讲用户任务和业务目标，再讲方案边界、风险兜底与上线验证。下面是一套可以直接用于复习和模拟面试的三轮方法。</p>
        <div class="category-actions">
          <a class="button button-primary" href="${rootPath(root, "index.html")}#library">进入 ${articles.length} 道面试题 ${icon("arrow")}</a>
          <a class="button" href="${rootPath(root, "index.html")}#topics">先看六类专题</a>
        </div>
      </div>
      <div class="guide-hero-method" aria-hidden="true">
        <span>ANSWER FLOW</span>
        <strong>业务<br>→ 取舍<br>→ 兜底<br>→ 评测</strong>
        <small>AI PM INTERVIEW FRAMEWORK</small>
      </div>
    </section>

    <section class="guide-content-shell">
      <article class="guide-paper">
        <p class="guide-lead">AI 产品经理面试通常不会只问“这个名词是什么”。更常见的连续追问是：为什么需要它、替代方案是什么、失败时谁来兜底、上线后如何证明有效。因此，复习时要把每个知识点还原成一个产品决策。</p>

        <h2>一、AI产品经理面试题通常考什么？</h2>
        <div class="guide-dimensions">
          <div><span>01</span><strong>任务定义</strong><p>用户是谁、要完成什么任务、成功与失败分别是什么。</p></div>
          <div><span>02</span><strong>技术边界</strong><p>Agent、RAG、Workflow、微调或普通 LLM 调用如何选。</p></div>
          <div><span>03</span><strong>风险治理</strong><p>权限、幻觉、重试、回滚、人工接管和审计如何设计。</p></div>
          <div><span>04</span><strong>效果证明</strong><p>离线评测、线上指标、Trace、灰度和迭代节奏如何落地。</p></div>
        </div>

        <h2>二、六个专题应该先复习哪一个？</h2>
        <p>Agent 与 RAG 是 AI 产品经理最常见的能力题；工具调用决定系统能否安全行动；大模型工程帮助解释成本、延迟与能力边界；LangChain 和 AI 编程更适合需要理解研发实现与交付流程的岗位。</p>
        <div class="guide-topic-links">
          ${CATEGORY_ORDER.map((category) => {
            const meta = CATEGORIES[category];
            const count = articles.filter((article) => article.category === category).length;
            return `<a href="${rootPath(root, `category/${category}.html`)}" style="--cat:${meta.color};--soft:${meta.soft}"><span>${meta.index}</span><strong>${meta.fullName}</strong><small>${count} 道题</small></a>`;
          }).join("")}
        </div>

        <h2>三、一道题怎么答出产品经理视角？</h2>
        <ol class="guide-answer-steps">
          <li><strong>先说结论。</strong>用一句话说明要不要做、解决什么问题，以及最重要的边界。</li>
          <li><strong>再讲取舍。</strong>比较更简单和更复杂的方案，解释为什么当前场景需要这个技术。</li>
          <li><strong>补充失败路径。</strong>说明误判、超时、越权、知识冲突时如何重试、回滚或转人工。</li>
          <li><strong>最后给指标。</strong>区分离线评测和线上指标，并说明灰度、止损与后续迭代。</li>
        </ol>
        <blockquote>示例开场：如果目标是让客服 Agent 处理退款，我会先限定可自动执行的动作与金额，再把查询、审核和退款拆成可观测步骤。高风险动作必须二次确认，上线前用离线任务集验证正确率，灰度阶段重点看任务完成率、人工接管率和错误退款率。</blockquote>

        <h2>四、三轮复习法</h2>
        <div class="guide-rounds">
          <div><span>ROUND 01</span><strong>建立地图</strong><p>先按专题扫标题，标出完全不会、能解释、能设计三类题目。</p></div>
          <div><span>ROUND 02</span><strong>练连续追问</strong><p>每道题先说 60 秒，再顺着失败、成本、评测和权限继续追问自己。</p></div>
          <div><span>ROUND 03</span><strong>模拟面试</strong><p>随机抽题，用“结论—取舍—风险—指标”完整回答并复盘遗漏。</p></div>
        </div>

        <h2>五、内容说明</h2>
        <p>本站文章用于技术学习和面试练习。页面中的面试对话属于教学化模拟，不代表任何真实公司、候选人、面试结果或业务效果。题目与答案应结合具体岗位、业务阶段和最新平台能力独立判断。</p>
        <div class="guide-cta">
          <div><span>READY TO PRACTICE?</span><strong>从第一道 Agent 面试题开始</strong></div>
          <a class="button button-primary" href="${rootPath(root, articles[0]?.href || "index.html")}">开始练习 ${icon("arrow")}</a>
        </div>
      </article>
    </section>`;
}

function splitArticle(markdown) {
  const body = removeFirstHeading(markdown);
  const firstH2 = body.search(/^##\s+/m);
  if (firstH2 < 0) return { opening: body, content: "" };
  return {
    opening: body.slice(0, firstH2).trim(),
    content: body.slice(firstH2).trim(),
  };
}

function articleMarkup(article, root) {
  const category = CATEGORIES[article.category];
  const pmLens = PM_LENS[article.category];
  const markdown = fs.readFileSync(path.join(CONTENT_DIR, article.category, article.filename), "utf8");
  const { opening, content } = splitArticle(markdown);
  const env = { currentArticle: article, headings: [] };
  const openingHtml = opening ? markdownIt.render(opening, env) : "";
  const contentHtml = content ? markdownIt.render(content, env) : "";
  const headings = env.headings || [];
  const categoryArticles = articles.filter((entry) => entry.category === article.category);
  const globalPosition = articles.indexOf(article);
  const previous = articles[globalPosition - 1];
  const next = articles[globalPosition + 1];
  const toc = headings
    .filter((heading) => heading.level === 2 || heading.level === 3)
    .map(
      (heading) =>
        `<a class="toc-level-${heading.level}" href="#${escapeAttr(heading.id)}">${escapeHtml(heading.text)}</a>`,
    )
    .join("");
  return `
    <div class="article-progress" data-reading-progress></div>
    <section class="article-layout">
      <aside class="article-sidebar">
        <div class="sidebar-sticky">
          <a class="sidebar-back" href="${rootPath(root, `category/${article.category}.html`)}">${icon("arrow")} ${category.fullName}</a>
          <div class="sidebar-title">
            <i style="--cat:${category.color}"></i>
            <span>${category.name}</span>
            <strong>${categoryArticles.length} 道题</strong>
          </div>
          <nav class="sidebar-list" aria-label="${category.fullName}题目列表">
            ${categoryArticles.map((entry) => {
              const active = entry === article ? " is-active" : "";
              return `<a class="${active.trim()}" href="${entry === article ? "#article-top" : `./${entry.base}.html`}"><span>${String(entry.categoryIndex).padStart(2, "0")}</span><strong>${escapeHtml(entry.displayTitle)}</strong></a>`;
            }).join("")}
          </nav>
        </div>
      </aside>

      <article class="article-paper" id="article-top">
        <header class="article-head">
          <div class="article-breadcrumb">
            <a href="${rootPath(root, "index.html")}">首页</a><span>/</span>
            <a href="${rootPath(root, `category/${article.category}.html`)}">${category.name}</a><span>/</span>
            <span>第 ${article.categoryIndex} 题</span>
          </div>
          <div class="article-meta-row">
            <span class="topic-label topic-label-large" style="--cat:${category.color};--soft:${category.soft}">${category.name}</span>
            <span>${icon("clock")} ${article.readingMinutes} 分钟阅读</span>
            <span>${article.charCount.toLocaleString("zh-CN")} 字</span>
            <time datetime="${SITE_UPDATED}">更新于 ${SITE_UPDATED}</time>
          </div>
          <h1>${escapeHtml(article.displayTitle)}</h1>
          <div class="article-deck">
            <span>题目 ${String(article.number ?? article.categoryIndex).padStart(2, "0")}</span>
            <p>${escapeHtml(article.summary)}</p>
          </div>
          <button class="copy-link" type="button" data-copy-link>${icon("copy")} 复制本文链接</button>
        </header>

        <div class="interview-opening">
          <div class="interview-heading">
            <span>${icon("spark")}</span>
            <div><strong>面试追问演练</strong><small>教学化作答情境，不代表真实公司面经</small></div>
          </div>
          <div class="interview-body">${openingHtml}</div>
        </div>

        <aside class="pm-lens-card">
          <span>AI PRODUCT MANAGER LENS</span>
          <h2>产品经理怎么答这道题？</h2>
          <p>${escapeHtml(pmLens)}</p>
          <div><strong>答题顺序</strong><span>业务目标 → 技术边界 → 风险兜底 → 评测迭代</span></div>
        </aside>

        <div class="article-content">
          ${contentHtml}
        </div>

        <section class="feishu-endcap" data-article-feishu>
          <span class="endcap-kicker">KEEP LEARNING</span>
          <h2>继续练习与交流</h2>
          <p>打开飞书学习应用，继续查看配套内容、参与互动，并把这篇题目的理解讲给同伴听。</p>
          <a href="${FEISHU_URL}" target="_blank" rel="noreferrer noopener">
            <span><small>飞书应用链接</small><strong>${FEISHU_URL}</strong></span>
            ${icon("external")}
          </a>
        </section>
      </article>

      <aside class="toc-sidebar">
        <div class="toc-sticky">
          <span class="toc-kicker">ON THIS PAGE</span>
          <nav data-toc>${toc}</nav>
          <div class="toc-progress-card">
            <span>阅读进度</span>
            <strong data-toc-progress>0%</strong>
            <i><b data-toc-progress-bar></b></i>
          </div>
        </div>
      </aside>
    </section>

    <section class="article-pagination">
      ${previous ? `<a class="pagination-card previous" href="${rootPath(root, previous.href)}"><span>上一篇 · ${CATEGORIES[previous.category].name}</span><strong>${escapeHtml(previous.displayTitle)}</strong></a>` : "<span></span>"}
      ${next ? `<a class="pagination-card next" href="${rootPath(root, next.href)}"><span>下一篇 · ${CATEGORIES[next.category].name}</span><strong>${escapeHtml(next.displayTitle)}</strong>${icon("arrow")}</a>` : "<span></span>"}
    </section>`;
}

function absoluteUrl(pathname = "/") {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function publisherSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/assets/og-cover.png`,
  };
}

function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: "AI产品经理面试题",
        description: SITE_DESCRIPTION,
        inLanguage: "zh-CN",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      publisherSchema(),
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#question-library`,
        url: `${SITE_URL}/`,
        name: "AI产品经理面试题库",
        description: SITE_DESCRIPTION,
        inLanguage: "zh-CN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: articles.length,
          itemListElement: articles.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: article.displayTitle,
            url: absoluteUrl(`/${article.href}`),
          })),
        },
      },
    ],
  };
}

function categorySchema(category) {
  const meta = CATEGORIES[category];
  const categoryArticles = articles.filter((article) => article.category === category);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/category/${category}.html#page`,
        url: absoluteUrl(`/category/${category}.html`),
        name: `${meta.fullName}｜AI产品经理面试题`,
        description: meta.description,
        inLanguage: "zh-CN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: categoryArticles.length,
          itemListElement: categoryArticles.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: article.displayTitle,
            url: absoluteUrl(`/${article.href}`),
          })),
        },
      },
      breadcrumbSchema([
        { name: "首页", path: "/" },
        { name: meta.fullName, path: `/category/${category}.html` },
      ]),
    ],
  };
}

function articleSchema(article) {
  const category = CATEGORIES[article.category];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${absoluteUrl(`/${article.href}`)}#article`,
        headline: `${article.displayTitle}｜AI产品经理面试题`,
        description: article.summary,
        articleSection: category.fullName,
        inLanguage: "zh-CN",
        dateModified: SITE_UPDATED,
        mainEntityOfPage: absoluteUrl(`/${article.href}`),
        image: `${SITE_URL}/assets/og-cover.png`,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: publisherSchema(),
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      breadcrumbSchema([
        { name: "首页", path: "/" },
        { name: category.fullName, path: `/category/${article.category}.html` },
        { name: article.displayTitle, path: `/${article.href}` },
      ]),
    ],
  };
}

function guideSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${SITE_URL}/guide.html#article`,
        headline: "AI产品经理面试怎么准备？从技术题到产品判断",
        description:
          "AI产品经理面试备考指南：梳理 Agent、RAG、工具调用等高频专题，并给出业务目标、方案取舍、失败兜底和评测迭代的答题框架。",
        inLanguage: "zh-CN",
        dateModified: SITE_UPDATED,
        mainEntityOfPage: `${SITE_URL}/guide.html`,
        image: `${SITE_URL}/assets/og-cover.png`,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: publisherSchema(),
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      breadcrumbSchema([
        { name: "首页", path: "/" },
        { name: "AI产品经理面试备考指南", path: "/guide.html" },
      ]),
    ],
  };
}

function generateFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#101114"/>
  <circle cx="32" cy="32" r="18" fill="#ffffff" stroke="#000000" stroke-width="3"/>
  <path d="M26 26c0-4 3-7 7-7 5 0 8 3 8 7 0 5-6 5-6 9v2" fill="none" stroke="#101114" stroke-width="4" stroke-linecap="round"/>
  <circle cx="35" cy="44" r="2.8" fill="#101114"/>
  <circle cx="51" cy="13" r="7" fill="#01f7f2" stroke="#000000" stroke-width="2"/>
</svg>`;
  writeFile("assets/favicon.svg", svg);
}

writeFile(
  "assets/search-index.js",
  `window.INTERVIEW_SEARCH_INDEX = ${JSON.stringify(
    articles.map((article) => ({
      title: article.displayTitle,
      summary: article.summary,
      category: CATEGORIES[article.category].name,
      href: article.href,
      search: normalizeSearch(article.searchText),
    })),
  )};\n`,
);

writeFile("styles/fonts.css", `@font-face {
  font-family: "Inter";
  src: url("../assets/fonts/fonts.gstatic.com/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7-6ab57b19c6.woff2") format("woff2");
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
}
@font-face {
  font-family: "Space Grotesk";
  src: url("../assets/fonts/fonts.gstatic.com/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw-4ecc7e89b7.woff2") format("woff2");
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}
`);

writeFile(
  "index.html",
  pageShell({
    root: "",
    page: "home",
    title: "AI产品经理面试题｜124道Agent、RAG与技术面题 - AI PM面试图谱",
    description: SITE_DESCRIPTION,
    canonicalPath: "/",
    bodyClass: "home-page",
    main: homeMarkup(""),
    schema: homeSchema(),
  }),
);

for (const category of CATEGORY_ORDER) {
  writeFile(
    `category/${category}.html`,
    pageShell({
      root: "../",
      page: "topics",
      title: `${CATEGORIES[category].fullName}｜AI产品经理面试题`,
      description: CATEGORIES[category].description,
      canonicalPath: `/category/${category}.html`,
      keywords: `AI产品经理面试题,${CATEGORIES[category].name}面试题,AI产品经理,${CATEGORIES[category].fullName}`,
      bodyClass: "category-page",
      main: categoryMarkup(category, "../"),
      schema: categorySchema(category),
    }),
  );
}

for (const article of articles) {
  writeFile(
    article.href,
    pageShell({
      root: "../../",
      page: "library",
      title: `${article.displayTitle}｜AI产品经理面试题`,
      description: article.summary,
      canonicalPath: `/${article.href}`,
      keywords: `AI产品经理面试题,${article.displayTitle},${CATEGORIES[article.category].name},AI产品经理,${CATEGORIES[article.category].fullName}`,
      bodyClass: "article-page",
      pageType: "article",
      main: articleMarkup(article, "../../"),
      schema: articleSchema(article),
    }),
  );
}

writeFile(
  "guide.html",
  pageShell({
    root: "",
    page: "guide",
    title: "AI产品经理面试怎么准备？技术题答题框架与三轮复习法",
    description:
      "AI产品经理面试备考指南：先梳理 Agent、RAG、工具调用等六个技术专题，再用业务目标、方案取舍、失败兜底和评测迭代组织回答。",
    canonicalPath: "/guide.html",
    keywords: "AI产品经理面试怎么准备,AI产品经理面试题,AI PM面试,Agent面试,RAG面试题",
    bodyClass: "guide-page",
    main: guideMarkup(""),
    schema: guideSchema(),
  }),
);

writeFile(
  "404.html",
  pageShell({
    root: "",
    page: "404",
    title: "页面未找到｜AI产品经理面试图谱",
    description: "你访问的页面不存在，可以返回 AI产品经理面试题首页继续学习。",
    canonicalPath: "/404.html",
    bodyClass: "not-found-page",
    robots: "noindex, follow",
    main: `
      <section class="not-found-shell">
        <span>404 / LOST IN CONTEXT</span>
        <h1>这道页面没找到。</h1>
        <p>链接可能已经变化，回到题库继续看 Agent、RAG 与工具调用面试题。</p>
        <a class="button button-primary" href="index.html">返回 AI产品经理面试题首页 ${icon("arrow")}</a>
      </section>`,
  }),
);

const sitemapEntries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/guide.html", priority: "0.9", changefreq: "monthly" },
  ...CATEGORY_ORDER.map((category) => ({
    path: `/category/${category}.html`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...articles.map((article) => ({
    path: `/${article.href}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
];

writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${escapeHtml(absoluteUrl(entry.path))}</loc>
    <lastmod>${SITE_UPDATED}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

writeFile(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

writeFile(
  "assets/site.webmanifest",
  `${JSON.stringify(
    {
      name: "AI产品经理面试图谱",
      short_name: "AI PM面试",
      description: SITE_DESCRIPTION,
      lang: "zh-CN",
      start_url: SITE_START_PATH,
      display: "standalone",
      background_color: "#f5f6f7",
      theme_color: "#4687f2",
      icons: [
        {
          src: "favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
      ],
    },
    null,
    2,
  )}\n`,
);

writeFile(".nojekyll", "");
generateFavicon();
console.log(
  `Built ${articles.length} article pages, ${CATEGORY_ORDER.length} category pages, guide, 404, sitemap and robots.`,
);
