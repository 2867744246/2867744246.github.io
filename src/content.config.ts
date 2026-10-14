import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 单一 posts 集合：技术文章与随笔共用，用 type 字段区分
const posts = defineCollection({
	// 加载 src/content/posts/ 目录下的 Markdown 文件
	loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
	// 使用 zod schema 校验 frontmatter
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// 字符串自动转换为 Date 对象
		pubDate: z.coerce.date(),
		// 文章类型：tech=技术文章，essay=随笔
		type: z.enum(['tech', 'essay']),
		// 标签列表，默认为空数组
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { posts };
