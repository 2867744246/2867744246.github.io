// 站点元信息（占位内容，用户可在这一处集中修改）
export const SITE = {
	title: '我的博客',
	author: '2867744246',
	description: '记录技术与生活',
	url: 'https://2867744246.github.io',
	social: {
		github: 'https://github.com/2867744246',
	},
	// 首页分页大小
	itemsPerPage: 10,
} as const;

// 文章类型：tech=技术文章，essay=随笔
export type PostType = 'tech' | 'essay';
