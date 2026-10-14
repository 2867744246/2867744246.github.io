# 我的博客

基于 [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) 的个人博客，部署于 GitHub Pages：<https://2867744246.github.io/>

## 写作与发布

1. 在 `src/content/posts/` 新建 `英文slug.md`，frontmatter 格式：

   ```yaml
   ---
   title: 文章标题
   description: 一句话摘要
   pubDate: 2026-10-14
   type: tech   # tech=技术文章 / essay=随笔
   tags: [标签1, 标签2]
   ---
   ```

2. `git push` 后 GitHub Actions 自动构建，约 1 分钟后线上生效

## 站点配置

站点标题、作者、简介、社交链接等集中在 `src/config.ts`（当前为占位内容，可直接修改）。

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 本地预览 http://localhost:4321
npm run build   # 生产构建到 dist/
npx astro check # 类型检查
```
