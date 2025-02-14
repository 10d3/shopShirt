import { getBlogPosts } from "@/lib/actions/post";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getBlogPosts();
	return posts.map((post) => {
		const publishedDate = new Date(post.metadata.publishedAt);

		// Format the date to ISO 8601 string
		const lastModified = publishedDate.toISOString();
		return {
			url: `https://fortetfier.com/blog/${post.slug}`,
			lastModified,
		};
	});
}
