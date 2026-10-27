# AI 产品经理面试图谱

一个面向 AI 产品经理的静态面试题库，主题聚焦「AI产品经理面试题」。站点包含 124 道 Agent、RAG、工具调用、大模型工程、LangChain 与 AI 编程题，每篇文章都补充了产品经理视角的作答提示。

## 站点内容

- 124 个可独立索引的文章页
- 6 个专题落地页和 1 个备考指南页
- 全站搜索、专题筛选、继续加载、随机抽题
- 文章目录、阅读进度、上一篇/下一篇
- 814 张优化后的 WebP 架构配图
- 教学化面试追问，不冒充真实公司面经

## SEO 配置

- 首页、专题页、文章页均有唯一 title、description、canonical、Open Graph 和 Twitter Card
- 首页输出 WebSite、CollectionPage 和 ItemList 结构化数据
- 专题与文章输出 CollectionPage、TechArticle 和 BreadcrumbList
- 自动生成 `robots.txt`、`sitemap.xml` 和 `assets/og-cover.png`
- 静态 HTML 正文不依赖客户端渲染，适合搜索引擎抓取

## 本地构建

```powershell
npm install
python scripts/build_og_image.py
npm run optimize-images
npm run build
npm run verify
npm run serve
```

浏览器打开 `http://127.0.0.1:8123/`。

`assets/images-redrawn/*.png` 是本地高分辨率原图，不提交到 GitHub；构建时自动优先引用同名 `.webp`。原始图片约 958 MB，优化后约 101 MB。

## GitHub Pages

仓库根目录就是静态站点根目录，不需要服务端。发布到 `main` 分支后，在 GitHub 仓库的 `Settings → Pages` 中选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`。

默认站点地址：

```text
https://yy3413230124-cell.github.io/ai-pm-interview/
```

如果使用自定义域名，重新构建时传入站点根地址：

```powershell
$env:SITE_URL = "https://your-domain.example"
npm run build
```

## 目录

- `build.mjs`：生成文章、专题、SEO 元信息和结构化数据
- `content/`：Markdown 源文档
- `verify.mjs`：检查文章、资源、SEO 和站点地图
- `styles.css` / `app.js`：视觉样式与交互
- `scripts/optimize_images.py`：PNG 转 WebP
- `scripts/build_og_image.py`：生成 1200×630 社交分享图

## 内容说明

本站用于技术学习和面试练习。文章中的面试对话属于教学化模拟，不代表任何真实公司、候选人、面试结果或业务效果。题目和答案需要结合具体岗位、业务阶段和最新平台能力独立验证。
