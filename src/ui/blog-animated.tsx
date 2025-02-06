import { getBlogPosts } from "@/lib/actions/post";
import { Gallery6 } from "@/ui/gallery6";
import React from "react";

export default async function BlogTestimonial() {
	const allBlogPosts = await getBlogPosts();
	const arrangedPosts = allBlogPosts.map((post, index) => ({
		id: index.toString(),
		summary: post.metadata.summary,
		title: post.metadata.title,
		image: post.metadata.image,
		// designation: post.metadata.author,
		url: `/blog/${post.slug}`,
	}));

	const demoData = {
		heading: "Derniers articles",
		// demoUrl: "https://www.shadcnblocks.com",
		items: arrangedPosts,
	};
	return (
		<div>
			<Gallery6 {...demoData} />
		</div>
	);
}
