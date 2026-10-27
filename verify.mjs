import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.dirname(siteDir);
const feishuUrl = "https://v11enp9ok1h.feishuapp.com/app/app_17g2mxyqr88";
const unintendedFeishuUrl = "app_17g5m4fh1nf";
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const articlePages = walk(path.join(siteDir, "articles")).filter((file) => file.endsWith(".html"));
if (articlePages.length !== 124) {
  failures.push(`Expected 124 article pages, found ${articlePages.length}.`);
}

for (const article of articlePages) {
  const html = fs.readFileSync(article, "utf8");
  if (!html.includes(`href="${feishuUrl}"`)) {
    failures.push(`Missing course link: ${path.relative(siteDir, article)}`);
  }
  if (!html.includes("data-article-feishu")) {
    failures.push(`Missing course endcap: ${path.relative(siteDir, article)}`);
  }
  if (!html.includes("｜AI产品经理面试题</title>")) {
    failures.push(`Missing AI PM interview title: ${path.relative(siteDir, article)}`);
  }
  if (!html.includes('type="application/ld+json"') || !html.includes('"@type":"TechArticle"')) {
    failures.push(`Missing TechArticle schema: ${path.relative(siteDir, article)}`);
  }
  if (!html.includes('class="pm-lens-card"')) {
    failures.push(`Missing product-manager answer lens: ${path.relative(siteDir, article)}`);
  }
}

const allHtml = walk(siteDir).filter((file) => file.endsWith(".html"));
if (allHtml.length !== 133) {
  failures.push(`Expected 133 HTML pages, found ${allHtml.length}.`);
}

const titles = new Set();
const canonicals = new Set();
for (const file of allHtml) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(siteDir, file);
  if (html.includes("[object Object]")) {
    failures.push(`Rendered object placeholder: ${relative}`);
  }
  if (!/<h1(?:\s|>)/i.test(html)) {
    failures.push(`Missing H1: ${relative}`);
  }
  if (html.includes(unintendedFeishuUrl)) {
    failures.push(`Unintended course URL found: ${relative}`);
  }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) {
    failures.push(`Missing title: ${relative}`);
  } else if (titles.has(title)) {
    failures.push(`Duplicate title: ${relative}`);
  } else {
    titles.add(title);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical) {
    failures.push(`Missing canonical: ${relative}`);
  } else if (canonicals.has(canonical)) {
    failures.push(`Duplicate canonical: ${relative}`);
  } else {
    canonicals.add(canonical);
  }
  if (!file.endsWith("404.html") && !html.includes('name="description"')) {
    failures.push(`Missing meta description: ${relative}`);
  }
  if (!html.includes('property="og:image"') || !html.includes('name="twitter:card"')) {
    failures.push(`Missing social metadata: ${relative}`);
  }
  for (const match of html.matchAll(/(?<![-\w])(?:href|src)="([^"]+)"/g)) {
    const raw = match[1]
      .replaceAll("&amp;", "&")
      .replaceAll("&#39;", "'")
      .replaceAll("&quot;", '"');
    if (
      raw.startsWith("#") ||
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("mailto:") ||
      raw.startsWith("data:") ||
      raw.startsWith("javascript:")
    ) {
      continue;
    }
    const pathname = decodeURIComponent(raw.split(/[?#]/)[0]);
    if (!pathname) continue;
    const resolved = path.resolve(path.dirname(file), pathname);
    if (!resolved.startsWith(siteDir)) {
      failures.push(`Reference escapes site root: ${path.relative(siteDir, file)} -> ${raw}`);
      continue;
    }
    if (!fs.existsSync(resolved)) {
      failures.push(`Missing local reference: ${path.relative(siteDir, file)} -> ${raw}`);
    }
  }
}

const imageDir = path.join(siteDir, "assets", "images-redrawn");
const images = fs.existsSync(imageDir)
  ? fs
      .readdirSync(imageDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".webp"))
  : [];
if (images.length !== 814) {
  failures.push(`Expected 814 WebP images, found ${images.length}.`);
}

const searchBundle = fs.readFileSync(path.join(siteDir, "assets", "search-index.js"), "utf8");
const searchItems = (searchBundle.match(/"href":/g) || []).length;
if (searchItems !== 124) {
  failures.push(`Expected 124 search-index items, found ${searchItems}.`);
}

const packagedValidationPath = path.join(siteDir, "content", "redraw-validation.json");
const validationPath = fs.existsSync(packagedValidationPath)
  ? packagedValidationPath
  : path.join(workspaceDir, "大模型面试题_Markdown", "redraw-validation.json");
const imageValidation = JSON.parse(fs.readFileSync(validationPath, "utf8"));
if (
  imageValidation.status !== "passed" ||
  imageValidation.non_white_backgrounds !== 0 ||
  imageValidation.output_count !== 814
) {
  failures.push("The source redraw validation does not pass the white-background policy.");
}

for (const requiredFile of [
  "guide.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "assets/og-cover.png",
  "assets/site.webmanifest",
]) {
  if (!fs.existsSync(path.join(siteDir, requiredFile))) {
    failures.push(`Missing SEO/deployment file: ${requiredFile}`);
  }
}

const homeHtml = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
if (!homeHtml.includes("<h1>AI产品经理面试题")) {
  failures.push("Homepage H1 does not include the primary topic.");
}
if (!homeHtml.includes('"@type":"WebSite"') || !homeHtml.includes('"@type":"SearchAction"')) {
  failures.push("Homepage is missing WebSite/SearchAction schema.");
}
if (!homeHtml.includes("<h2>AI产品经理面试题，<br>真正考的是判断。</h2>")) {
  failures.push("Homepage is missing the AI PM answer framework.");
}

const guideHtml = fs.readFileSync(path.join(siteDir, "guide.html"), "utf8");
if (!guideHtml.includes("<h1>AI产品经理面试怎么准备？</h1>")) {
  failures.push("Guide page is missing its primary H1.");
}

const notFoundHtml = fs.readFileSync(path.join(siteDir, "404.html"), "utf8");
if (!notFoundHtml.includes('name="robots" content="noindex, follow"')) {
  failures.push("404 page must be noindex, follow.");
}

const sitemap = fs.readFileSync(path.join(siteDir, "sitemap.xml"), "utf8");
const sitemapUrls = (sitemap.match(/<loc>/g) || []).length;
if (sitemapUrls !== 132) {
  failures.push(`Expected 132 sitemap URLs, found ${sitemapUrls}.`);
}

const robots = fs.readFileSync(path.join(siteDir, "robots.txt"), "utf8");
if (!robots.includes("Sitemap: https://")) {
  failures.push("robots.txt is missing an absolute sitemap URL.");
}

if (failures.length) {
  console.error(`Verification failed with ${failures.length} issue(s):`);
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 50) console.error(`- ...and ${failures.length - 50} more.`);
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${articlePages.length} article pages, ${allHtml.length} HTML pages, 814 WebP images, ${sitemapUrls} sitemap URLs, unique SEO metadata and the original article-end Feishu link.`,
  );
}
