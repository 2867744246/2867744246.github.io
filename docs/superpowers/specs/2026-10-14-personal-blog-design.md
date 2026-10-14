# 个人博客设计文档

- 日期：2026-10-14
- 状态：已经用户确认
- 工作目录：`d:\Projects\blog`

## 1. 背景与目标

搭建一个个人博客，目标是「快速上线 + 深度定制空间」：用成熟框架的骨架，UI 层自己写。作者有 Vue 技术背景，博客内容为技术文章与随笔混合。

## 2. 决策记录（经澄清与拷问确认）

| 决策点 | 结论 | 理由 |
|---|---|---|
| 总体方向 | 成熟框架 + 深度定制 | 兼顾上线速度与开发空间 |
| 框架 | Astro 5 | 官方深度支持 Vue 背景开发者；内容集合/分页/RSS/sitemap 开箱即用 |
| 主题起点 | 官方 blog 模板做骨架，UI 层全部自写 | 避免被社区主题代码结构绑架 |
| 部署 | GitHub Pages 用户站点，免费子域名 | 零成本、免运维、无需服务器 |
| 仓库 | `2867744246.github.io`，public | 免费账号 Pages 仅支持 public 仓库 |
| 功能范围 | 标准版（见 §4） | 评论/搜索/统计/CMS 明确排除在本期外 |
| 内容组织 | 单一 posts 集合 + `type` 字段区分 | 归档、RSS、分页天然统一，前端按需过滤 |
| URL 结构 | `/posts/<slug>/` 纯英文 slug | URL 短且稳定，年份信息由归档页承担 |
| 发布流程 | 纯 git：写 md → push → Actions 自动构建 | 无在线后台；后续可纯增量接入 CMS |
| 站点元信息 | 先用占位内容，集中在 `src/config.ts` | 用户后续 5 分钟内可自行修改 |

## 3. 技术选型

- **Astro 5** + **TypeScript**：骨架来自官方 blog 模板（内容集合、分页、RSS、sitemap）。
- **Tailwind CSS v4**：自写 UI 用工具类快速搭建。
- UI 层（布局、文章卡片、标签、暗色模式切换等）全部为自写 Astro 组件；如需交互组件可直接嵌入 Vue。
- 环境事实：Node v24.14.0、npm 11.9.0、git 2.45.1 均可用；**gh CLI 未安装**，实施时先 `winget install GitHub.cli` 并浏览器授权登录。

## 4. 页面与功能（标准版）

| 路由 | 说明 |
|---|---|
| `/` | 首页文章列表，分页 |
| `/posts/<slug>/` | 文章详情，代码高亮 |
| `/tags/` | 标签云，列出全部标签 |
| `/tags/[tag]/` | 按标签筛选的文章列表 |
| `/archive/` | 归档页，文章按年份分组 |
| `/about/` | 关于页（占位内容，用户自改） |
| `/rss.xml` | RSS 订阅源 |

暗色模式：跟随系统 + 手动切换按钮，偏好存 localStorage；页面内联脚本先行设置主题，避免闪烁（FOUC）。

## 5. 内容模型

单一 posts 内容集合，frontmatter 经 zod schema 校验：

```yaml
title: string          # 必填
description: string    # 必填，列表页摘要
pubDate: date          # 必填，发布日期
type: tech | essay     # 必填，技术文章 / 随笔
tags: string[]         # 可选，默认 []
```

- 文章存放：`src/content/posts/*.md`
- 文章 URL：`/posts/<slug>/`，slug 为英文
- 示例文章 2 篇（技术 + 随笔各一）用于验证 `type` 字段与归档/标签逻辑

## 6. 站点配置

集中一个文件 `src/config.ts`：

```ts
// 站点元信息（占位，用户自行修改）
export const SITE = {
  title: "我的博客",
  author: "2867744246",
  description: "记录技术与生活",
  url: "https://2867744246.github.io",
  social: { github: "https://github.com/2867744246" },
  itemsPerPage: 10,
};
```

## 7. 部署

- 远程仓库：`2867744246.github.io`（public），由 gh CLI 创建。
- CI：官方 `withastro/action` 构建，GitHub Pages 部署源设为 GitHub Actions。
- 本地目录名 `blog` 不影响部署，push 时映射到远程仓库名即可。
- 上线地址：`https://2867744246.github.io/`。

## 8. 发布流程

```mermaid
flowchart LR
    A[本地写 Markdown] -->|git push| B[GitHub 仓库]
    B -->|自动触发| C[GitHub Actions 构建]
    C -->|静态产物| D[GitHub Pages 托管]
    D --> E[读者访问]
```

无服务器、无数据库、无月费。

## 9. 校验与验收

- frontmatter 由内容集合 schema 在构建时校验，格式错误即构建失败并报错。
- 实施中运行 `astro check`（类型检查）与 `astro build`（构建）确保通过。
- 本地 `npm run dev` 逐页预览。
- 线上验收清单：首页列表、文章详情、标签筛选、归档分组、关于页、`/rss.xml` 可订阅、暗色模式切换并记忆、分页可用。

## 10. 范围外（后续纯增量）

评论（giscus）、全文搜索、访问统计、在线 CMS（Decap/Sveltia）、自定义域名、动态功能。
