# 个人博客实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 Astro 5 官方 blog 模板骨架搭建个人博客并部署到 GitHub Pages（用户站点 `2867744246.github.io`）。

**Architecture:** 静态站点：本地写 Markdown → git push → GitHub Actions 用 withastro/action 构建 → GitHub Pages 托管。单一 posts 内容集合 + zod schema 校验，UI 层全部自写 Astro 组件 + Tailwind CSS v4，暗色模式用 class 策略 + localStorage 记忆。

**Tech Stack:** Astro 5、TypeScript、Tailwind CSS v4（含 @tailwindcss/typography）、@astrojs/rss、@astrojs/sitemap、GitHub Actions、gh CLI。

**Spec:** `docs/superpowers/specs/2026-10-14-personal-blog-design.md`（验收清单见其 §9）

**环境事实：** Windows / PowerShell；Node v24.14.0、npm 11.9.0、git 2.45.1 可用；gh CLI 未安装；git 仓库已初始化（main 分支）；GitHub 用户名 `2867744246`。

---

## 目标文件结构（本计划完成后）

```
d:\Projects\blog
├── .github/workflows/deploy.yml      # Actions 构建与部署
├── astro.config.mjs                  # site 指向 https://2867744246.github.io
├── src/
│   ├── config.ts                     # 站点元信息（占位，用户自改）
│   ├── content.config.ts             # posts 集合定义（zod schema）
│   ├── content/posts/                # 文章 Markdown
│   │   ├── hello-astro.md            # 示例：技术
│   │   └── a-random-essay.md         # 示例：随笔
│   ├── components/                   # BaseHead / Header / Footer / FormattedDate /
│   │                                 # ThemeToggle / PostCard / TagList
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── [...page].astro           # 首页分页列表（/ 与 /2、/3…）
│   │   ├── posts/[...slug].astro     # 文章详情
│   │   ├── tags/index.astro          # 标签云
│   │   ├── tags/[tag].astro          # 按标签筛选
│   │   ├── archive.astro             # 按年归档
│   │   ├── about.astro               # 关于页
│   │   └── rss.xml.js                # RSS
│   └── styles/global.css             # （404.astro：模板若有则保留）
└── docs/                             # 设计文档与本计划（已有）
```

模板自带的 `src/content/blog/`、`src/pages/blog/`、`src/consts.ts` 会被删除。

---

### Task 1: 安装并登录 gh CLI（需要用户浏览器授权一次）

**Files:** 无（系统工具安装）

- [ ] **Step 1: 安装 gh CLI**

```powershell
winget install --id GitHub.cli --accept-source-agreements --accept-package-agreements
```

Expected: 安装成功。若提示找不到命令，新开终端刷新 PATH 后重试。

- [ ] **Step 2: 登录 GitHub（交互式，需要用户操作浏览器）**

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

按提示操作：选择「Login with a web browser」→ 复制终端显示的一次性代码 → 浏览器打开 https://github.com/login/device 输入代码并授权。

- [ ] **Step 3: 验证登录状态**

Run: `gh auth status`
Expected: 输出包含 `Logged in to github.com account 2867744246`

- [ ] **Step 4: 提交（无代码变更则跳过）**

无需提交。

---

### Task 2: 用官方 blog 模板脚手架初始化项目

**Files:** 由模板生成整个 Astro 项目到 `d:\Projects\blog`（保留已有的 `.git` 与 `docs/`）

- [ ] **Step 1: 生成模板到临时目录**

```powershell
npm create astro@latest blog-tmp -- --template blog --no-git --no-install --yes
```

在 `d:\Projects` 下执行。Expected: 生成 `d:\Projects\blog-tmp`。

- [ ] **Step 2: 移入当前项目目录（含隐藏文件）**

```powershell
Get-ChildItem "D:\Projects\blog-tmp" -Force | Move-Item -Destination "D:\Projects\blog" -Force
Remove-Item "D:\Projects\blog-tmp" -Recurse -Force
```

Expected: `d:\Projects\blog` 下出现 `package.json`、`astro.config.mjs`、`src/`、`public/`、`.gitignore` 等；`.git` 与 `docs/` 保持原样。

- [ ] **Step 3: 安装依赖**

Run: `npm install`（在 `d:\Projects\blog`）
Expected: 安装完成，无 error。

- [ ] **Step 4: 冒烟验证——生产构建**

Run: `npm run build`
Expected: 构建成功，`dist/` 生成。

- [ ] **Step 5: 提交**

```powershell
git add -A
git commit -m "chore: 用 Astro 官方 blog 模板初始化项目骨架"
```

---

### Task 3: 接入 Tailwind CSS v4（含 typography 与暗色变体）

**Files:**
- Modify: `src/styles/global.css`（整文件替换）
- Modify: `package.json`（依赖，由命令自动写入）

- [ ] **Step 1: 添加 Tailwind 集成**

Run: `npx astro add tailwind --yes`（在 `d:\Projects\blog`）
Expected: 自动安装 `tailwindcss` + `@tailwindcss/vite` 并改写 `astro.config.mjs`；生成/更新 `src/styles/global.css`。

- [ ] **Step 2: 安装 typography 插件**

Run: `npm install -D @tailwindcss/typography`
Expected: 安装成功。

- [ ] **Step 3: 重写 `src/styles/global.css`（整文件替换）**

```css
@import "tailwindcss";

/* 暗色模式用 class 策略：html 上有 .dark 时生效 */
@custom-variant dark (&:where(.dark, .dark *));

/* 启用 prose 排版插件（文章正文用） */
@plugin "@tailwindcss/typography";

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 4: 构建验证**

Run: `npm run build`
Expected: 构建成功。

- [ ] **Step 5: 提交**

```powershell
git add -A
git commit -m "build: 接入 Tailwind CSS v4 与 typography 插件"
```

---

### Task 4: 数据层——站点配置与 posts 内容集合

**Files:**
- Create: `src/config.ts`
- Create: `src/content.config.ts`
- Create: `src/content/posts/hello-astro.md`
- Create: `src/content/posts/a-random-essay.md`
- Modify: `src/pages/rss.xml.js`（改用 posts 集合与 SITE 配置）
- Delete: `src/content/blog/`（整个目录）
- Delete: `src/pages/blog/`（整个目录）
- Delete: `src/consts.ts`
- Delete: `src/pages/index.astro`（首页在 Task 6 重建，本任务后首页暂时 404，属预期）

- [ ] **Step 1: 删除模板遗留**

```powershell
Remove-Item -Recurse -Force "src\content\blog", "src\pages\blog", "src\consts.ts", "src\pages\index.astro"
```

- [ ] **Step 2: 创建 `src/config.ts`**

```ts
// 站点元信息（占位内容，用户可在这一处集中修改）
export const SITE = {
  title: "我的博客",
  author: "2867744246",
  description: "记录技术与生活",
  url: "https://2867744246.github.io",
  social: {
    github: "https://github.com/2867744246",
  },
  // 首页分页大小
  itemsPerPage: 10,
} as const;

// 文章类型：tech=技术文章，essay=随笔
export type PostType = "tech" | "essay";
```

- [ ] **Step 3: 创建 `src/content.config.ts`（Astro 5 内容集合定义）**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 单一 posts 集合：技术与随笔共用，用 type 字段区分
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    type: z.enum(["tech", "essay"]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
```

- [ ] **Step 4: 写两篇示例文章**

创建 `src/content/posts/hello-astro.md`：

````markdown
---
title: 你好，Astro：博客的第一篇文章
description: 用 Astro 5 + Tailwind 搭建个人博客的起点，记录建站思路与后续写作计划。
pubDate: 2026-10-14
type: tech
tags: [astro, 博客]
---

## 为什么选 Astro

内容优先、默认零 JS，Markdown 写作体验一流，还能随时嵌入 Vue 组件。

## 代码示例

```ts
export const hello = "world";
```

## 接下来写什么

- 前端工程化笔记
- 日常踩坑记录
````

创建 `src/content/posts/a-random-essay.md`：

```markdown
---
title: 随笔：开始记录
description: 关于为什么要开始写博客的一些碎碎念。
pubDate: 2026-10-14
type: essay
tags: [随笔]
---

写博客的理由有很多：整理思路、留下痕迹、认识同好。

对我来说最朴素的一条是——想的时候头头是道，写下来才知道哪里没想清楚。
```

- [ ] **Step 5: 负面测试——schema 校验生效**

创建临时文件 `src/content/posts/_bad.md`：

```markdown
---
title: 非法文章
description: 这篇的 type 字段非法。
pubDate: 2026-10-14
type: wrong
---
```

Run: `npm run build`
Expected: **构建失败**，报错信息指向 `type` 字段不符合枚举（schema 校验生效的证据）。

- [ ] **Step 6: 删除临时文件，再次构建通过**

```powershell
Remove-Item "src\content\posts\_bad.md"
```

Run: `npm run build`
Expected: 构建成功（此时页面仅剩 about / rss / 404，属预期）。

- [ ] **Step 7: 重写 `src/pages/rss.xml.js`（整文件替换）**

```js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../config";

// 生成 /rss.xml 订阅源
export async function GET(context) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 8: 构建验证 RSS**

Run: `npm run build`，然后 `Test-Path dist/rss.xml`
Expected: `True`，且文件内容包含 `hello-astro`。

- [ ] **Step 9: 提交**

```powershell
git add -A
git commit -m "feat: 站点配置与 posts 内容集合（zod 校验 + RSS + 示例文章）"
```

---

### Task 5: 基础布局与 UI 组件（含暗色模式）

**Files:**
- Modify: `src/components/BaseHead.astro`（整文件替换）
- Modify: `src/components/Header.astro`（整文件替换）
- Modify: `src/components/Footer.astro`（整文件替换）
- Modify: `src/components/FormattedDate.astro`（整文件替换）
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`
- Modify: `src/layouts/BaseLayout.astro`（整文件替换）
- Modify: `src/layouts/BlogPost.astro` → 若模板存在则整文件替换为下方「文章布局」；若不存在则跳过本文件（详情页直接在 Task 6 用 BaseLayout）

- [ ] **Step 1: 重写 `src/components/BaseHead.astro`（整文件替换）**

```astro
---
import "../styles/global.css";
import { SITE } from "../config";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!-- 公共 head：meta、favicon、RSS、防闪烁主题脚本 -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="generator" content={Astro.generator} />
<meta name="description" content={description} />
<title>{title}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate" type="application/rss+xml" title={SITE.title} href="/rss.xml" />
<script is:inline>
  // 首屏渲染前设置主题，避免暗色模式闪烁（FOUC）
  const saved = localStorage.getItem("theme");
  const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
</script>
```

- [ ] **Step 2: 重写 `src/components/Header.astro`（整文件替换）**

```astro
---
import { SITE } from "../config";
import ThemeToggle from "./ThemeToggle.astro";

// 顶部导航项
const nav = [
  { href: "/", label: "首页" },
  { href: "/archive/", label: "归档" },
  { href: "/tags/", label: "标签" },
  { href: "/about/", label: "关于" },
];
---

<header class="border-b border-zinc-200 dark:border-zinc-700">
  <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
    <a href="/" class="text-lg font-bold">{SITE.title}</a>
    <nav class="flex items-center gap-4 text-sm">
      {nav.map((item) => (
        <a href={item.href} class="hover:text-amber-600 dark:hover:text-amber-400">
          {item.label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  </div>
</header>
```

- [ ] **Step 3: 重写 `src/components/Footer.astro`（整文件替换）**

```astro
---
import { SITE } from "../config";
const year = new Date().getFullYear();
---

<footer class="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
  © {year} {SITE.author} ·
  <a href={SITE.social.github} target="_blank" rel="noopener" class="hover:text-amber-600">GitHub</a> ·
  <a href="/rss.xml" class="hover:text-amber-600">RSS</a>
</footer>
```

- [ ] **Step 4: 重写 `src/components/FormattedDate.astro`（整文件替换）**

```astro
---
interface Props {
  date: Date;
}

const { date } = Astro.props;
---

<time datetime={date.toISOString()}>
  {date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
</time>
```

- [ ] **Step 5: 创建 `src/components/ThemeToggle.astro`**

```astro
<button id="theme-toggle" aria-label="切换暗色模式"
  class="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
  <!-- 太阳：浅色模式下显示 -->
  <svg class="h-5 w-5 dark:hidden" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.3 11.3 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.3-11.3 1.4-1.4" />
  </svg>
  <!-- 月亮：暗色模式下显示 -->
  <svg class="hidden h-5 w-5 dark:block" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
</button>

<script>
  // 点击切换 html.dark 并记忆到 localStorage
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
</script>
```

- [ ] **Step 6: 创建 `src/components/TagList.astro`**

```astro
---
interface Props {
  tags: string[];
}

const { tags } = Astro.props;
---

{tags.length > 0 && (
  <div class="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <a href={`/tags/${tag}/`} class="text-xs text-amber-600 hover:underline dark:text-amber-400">
        #{tag}
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 7: 创建 `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";
import FormattedDate from "./FormattedDate.astro";
import TagList from "./TagList.astro";

interface Props {
  post: CollectionEntry<"posts">;
}

const { post } = Astro.props;
---

<article class="rounded-lg border border-zinc-200 p-5 transition hover:border-amber-500 dark:border-zinc-700 dark:hover:border-amber-500">
  <h2 class="text-xl font-semibold">
    <a href={`/posts/${post.id}/`} class="hover:text-amber-600 dark:hover:text-amber-400">
      {post.data.title}
    </a>
  </h2>
  <div class="mt-2 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
    <FormattedDate date={post.data.pubDate} />
    <span class="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
      {post.data.type === "tech" ? "技术" : "随笔"}
    </span>
  </div>
  <p class="mt-3 text-zinc-600 dark:text-zinc-400">{post.data.description}</p>
  <TagList tags={post.data.tags} />
</article>
```

- [ ] **Step 8: 重写 `src/layouts/BaseLayout.astro`（整文件替换）**

```astro
---
import BaseHead from "../components/BaseHead.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <BaseHead title={title} description={description} />
  </head>
  <body class="flex min-h-screen flex-col bg-white text-zinc-800 antialiased dark:bg-zinc-900 dark:text-zinc-200">
    <Header />
    <main class="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 9: 构建验证**

Run: `npm run build`
Expected: 构建成功（模板残留的 about 页会用到新 BaseLayout；若 about.astro 引用了已删除的 consts.ts 导致报错，把其中的引用改为 `import { SITE } from "../config"` 并用 `SITE.title` 代替）。

- [ ] **Step 10: 提交**

```powershell
git add -A
git commit -m "feat: 自写基础布局与 UI 组件（暗色模式 + 文章卡片 + 标签）"
```

---

### Task 6: 首页分页列表与文章详情页

**Files:**
- Create: `src/pages/[...page].astro`（首页 `/`、`/2`、`/3`…）
- Create: `src/pages/posts/[...slug].astro`（文章详情）

- [ ] **Step 1: 创建 `src/pages/[...page].astro`**

```astro
---
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "../config";
import BaseLayout from "../layouts/BaseLayout.astro";
import PostCard from "../components/PostCard.astro";

// 首页分页：按发布日期倒序，/ 为第一页，/2、/3 为后续页
export async function getStaticPaths({ paginate }: { paginate: any }) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return paginate(posts, { pageSize: SITE.itemsPerPage });
}

interface PageProp {
  data: CollectionEntry<"posts">[];
  currentPage: number;
  lastPage: number;
  url: { prev: string | undefined; next: string | undefined };
}

interface Props {
  page: PageProp;
}

const { page } = Astro.props;
---

<BaseLayout title={SITE.title} description={SITE.description}>
  <h1 class="mb-6 text-2xl font-bold">最新文章</h1>
  <div class="flex flex-col gap-5">
    {page.data.map((post) => <PostCard post={post} />)}
  </div>
  <nav class="mt-8 flex items-center justify-between text-sm">
    {page.url.prev
      ? <a href={page.url.prev} class="hover:text-amber-600">← 上一页</a>
      : <span />}
    <span class="text-zinc-500 dark:text-zinc-400">第 {page.currentPage} / {page.lastPage} 页</span>
    {page.url.next
      ? <a href={page.url.next} class="hover:text-amber-600">下一页 →</a>
      : <span />}
  </nav>
</BaseLayout>
```

- [ ] **Step 2: 创建 `src/pages/posts/[...slug].astro`**

```astro
---
import { getCollection, render } from "astro:content";
import { SITE } from "../../config";
import BaseLayout from "../../layouts/BaseLayout.astro";
import FormattedDate from "../../components/FormattedDate.astro";
import TagList from "../../components/TagList.astro";

// 每篇文章生成一个静态页，slug 即文件名
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={`${post.data.title} · ${SITE.title}`} description={post.data.description}>
  <article>
    <header class="mb-8">
      <h1 class="text-3xl font-bold">{post.data.title}</h1>
      <div class="mt-3 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <FormattedDate date={post.data.pubDate} />
        <span class="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
          {post.data.type === "tech" ? "技术" : "随笔"}
        </span>
      </div>
      <div class="mt-3">
        <TagList tags={post.data.tags} />
      </div>
    </header>
    <div class="prose prose-zinc dark:prose-invert max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: 构建验证产物**

Run:

```powershell
npm run build
Test-Path dist/index.html                # True
Test-Path dist/posts/hello-astro/index.html   # True
Test-Path dist/posts/a-random-essay/index.html # True
```

- [ ] **Step 4: 本地预览（可选，供用户过目）**

Run: `npm run dev`，打开 http://localhost:4321/ 检查首页列表与文章页；顺带点击右上角按钮验证暗色切换。完成后 Ctrl+C 退出。

- [ ] **Step 5: 提交**

```powershell
git add -A
git commit -m "feat: 首页分页列表与文章详情页"
```

---

### Task 7: 标签页、归档页、关于页

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/archive.astro`
- Modify: `src/pages/about.astro`（整文件替换为占位关于页）

- [ ] **Step 1: 创建 `src/pages/tags/index.astro`（标签云）**

```astro
---
import { getCollection } from "astro:content";
import { SITE } from "../../config";
import BaseLayout from "../../layouts/BaseLayout.astro";

// 统计每个标签下的文章数并按数量降序
const posts = await getCollection("posts");
const counts = new Map<string, number>();
for (const post of posts) {
  for (const tag of post.data.tags) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
}
const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]);
---

<BaseLayout title={`标签 · ${SITE.title}`} description="全部标签">
  <h1 class="mb-6 text-2xl font-bold">标签</h1>
  <div class="flex flex-wrap gap-3">
    {tags.map(([tag, count]) => (
      <a href={`/tags/${tag}/`}
        class="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:border-amber-500 dark:border-zinc-600">
        {tag} <span class="text-zinc-400">({count})</span>
      </a>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 2: 创建 `src/pages/tags/[tag].astro`（按标签筛选）**

```astro
---
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "../../config";
import BaseLayout from "../../layouts/BaseLayout.astro";
import PostCard from "../../components/PostCard.astro";

// 为每个出现过的标签生成一个筛选页
export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter((post) => post.data.tags.includes(tag))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    },
  }));
}

interface Props {
  tag: string;
  posts: CollectionEntry<"posts">[];
}

const { tag, posts } = Astro.props;
---

<BaseLayout title={`标签：${tag} · ${SITE.title}`} description={`标签 ${tag} 下的所有文章`}>
  <h1 class="mb-6 text-2xl font-bold">
    标签：<span class="text-amber-600 dark:text-amber-400">{tag}</span>
  </h1>
  <div class="flex flex-col gap-5">
    {posts.map((post) => <PostCard post={post} />)}
  </div>
</BaseLayout>
```

- [ ] **Step 3: 创建 `src/pages/archive.astro`（按年归档）**

```astro
---
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "../config";
import BaseLayout from "../layouts/BaseLayout.astro";
import FormattedDate from "../components/FormattedDate.astro";

// 全部文章按日期倒序，再按年份分组
const posts = (await getCollection("posts")).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const byYear = new Map<number, CollectionEntry<"posts">[]>();
for (const post of posts) {
  const year = post.data.pubDate.getFullYear();
  if (!byYear.has(year)) byYear.set(year, []);
  byYear.get(year)!.push(post);
}
---

<BaseLayout title={`归档 · ${SITE.title}`} description="全部文章归档">
  <h1 class="mb-6 text-2xl font-bold">归档</h1>
  {[...byYear.entries()].map(([year, list]) => (
    <section class="mb-8">
      <h2 class="mb-3 text-xl font-semibold text-amber-600 dark:text-amber-400">{year}</h2>
      <ul class="space-y-2">
        {list.map((post) => (
          <li class="flex items-baseline gap-4 text-sm">
            <FormattedDate date={post.data.pubDate} />
            <a href={`/posts/${post.id}/`} class="hover:text-amber-600 dark:hover:text-amber-400">
              {post.data.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  ))}
</BaseLayout>
```

- [ ] **Step 4: 重写 `src/pages/about.astro`（整文件替换，占位内容）**

```astro
---
import { SITE } from "../config";
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title={`关于 · ${SITE.title}`} description={SITE.description}>
  <h1 class="mb-6 text-2xl font-bold">关于</h1>
  <div class="prose prose-zinc dark:prose-invert max-w-none">
    <p>
      你好，我是 {SITE.author}。这里是 {SITE.title}，记录技术与生活。
    </p>
    <p>
      这段是占位内容——打开 <code>src/pages/about.astro</code>，换成你自己的介绍。
    </p>
    <p>
      GitHub：<a href={SITE.social.github}>{SITE.social.github}</a>
    </p>
  </div>
</BaseLayout>
```

- [ ] **Step 5: 构建验证产物**

Run:

```powershell
npm run build
Test-Path dist/tags/index.html          # True
Test-Path dist/tags/astro/index.html    # True
Test-Path dist/tags/随笔/index.html     # True（中文标签目录）
Test-Path dist/archive/index.html       # True
Test-Path dist/about/index.html         # True
```

- [ ] **Step 6: 提交**

```powershell
git add -A
git commit -m "feat: 标签云、标签筛选、按年归档与关于页"
```

---

### Task 8: 质量门禁——类型检查与全站构建

**Files:** 无新增（发现问题就地修复）

- [ ] **Step 1: 安装类型检查依赖**

Run: `npm install -D @astrojs/check typescript`
Expected: 安装成功。

- [ ] **Step 2: 运行 astro check**

Run: `npx astro check`
Expected: `0 errors`。若报错，修复后重跑直至通过。

- [ ] **Step 3: 全站构建**

Run: `npm run build`
Expected: 构建成功，无警告级别的路由冲突（首页 `[...page].astro` 与静态路由 /about、/tags、/archive 共存是 Astro 支持的优先级规则：静态路由优先）。

- [ ] **Step 4: 提交**

```powershell
git add -A
git commit -m "chore: 接入 astro check 类型检查并通过全站构建"
```

---

### Task 9: 部署上线（GitHub Actions → Pages）

**Files:**
- Modify: `astro.config.mjs`（设置 site）
- Create: `.github/workflows/deploy.yml`
- 远程：创建仓库 `2867744246.github.io` 并启用 Pages

- [ ] **Step 1: `astro.config.mjs` 设置 site（在 defineConfig 对象中加入）**

```js
export default defineConfig({
  site: "https://2867744246.github.io",
  // ...模板原有的 integrations（mdx、sitemap、tailwind vite 插件）保持不变
});
```

注意：只新增 `site` 一行，模板已有的 integrations 与 vite 配置一律保留。

- [ ] **Step 2: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install, build, and upload site
        uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: 本地最后一次构建验证**

Run: `npm run build`
Expected: 构建成功。

- [ ] **Step 4: 创建远程仓库（不立即推送）**

```powershell
gh repo create 2867744246.github.io --public --source=. --remote=origin
```

Expected: 远程仓库创建成功，本地已配置 origin。

- [ ] **Step 5: 启用 GitHub Pages（构建源 = GitHub Actions）**

```powershell
gh api -X POST repos/2867744246/2867744246.github.io/pages -f "build_type=workflow"
```

若报 409（已存在），改用：`gh api -X PUT repos/2867744246/2867744246.github.io/pages -f "build_type=workflow"`

- [ ] **Step 6: 推送并跟踪构建**

```powershell
git push -u origin main
gh run watch --repo 2867744246/2867744246.github.io
```

Expected: build 与 deploy 两个 job 均成功。

- [ ] **Step 7: 线上验收（对照设计文档 §9）**

```powershell
(Invoke-WebRequest -Uri "https://2867744246.github.io/" -UseBasicParsing).StatusCode   # 200
(Invoke-WebRequest -Uri "https://2867744246.github.io/posts/hello-astro/" -UseBasicParsing).StatusCode  # 200
(Invoke-WebRequest -Uri "https://2867744246.github.io/rss.xml" -UseBasicParsing).StatusCode  # 200
```

再由用户在浏览器逐项确认：

- [ ] 首页文章列表正常
- [ ] 文章详情正常（代码高亮、排版）
- [ ] 标签云与标签筛选可用
- [ ] 归档按年分组
- [ ] 关于页正常
- [ ] RSS 可被阅读器订阅
- [ ] 暗色模式：切换生效、刷新记忆、跟随系统初始值
- [ ] 分页可用（当前 2 篇文章只有 1 页，属正常）

- [ ] **Step 8: 提交部署配置**

```powershell
git add -A
git commit -m "ci: GitHub Actions 构建并部署到 GitHub Pages"
git push
```

---

## 完成定义

- https://2867744246.github.io/ 可公开访问，验收清单全绿
- 本地写 `.md` → `git push` → 约 1 分钟后线上自动更新
- 之后的写作流程与新增功能（评论/搜索/CMS）见设计文档 §10
