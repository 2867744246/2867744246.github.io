// 站点元信息（占位内容，用户可在这一处集中修改）
export const SITE = {
	title: '我的博客',
	author: '2867744246',
	description: '记录技术与生活',
	// 注意：需与 astro.config.mjs 的 site 保持一致；RSS/sitemap/canonical 实际读取的是后者
	url: 'https://2867744246.github.io',
	social: {
		github: 'https://github.com/2867744246',
	},
	// 首页分页大小
	itemsPerPage: 10,
} as const;
