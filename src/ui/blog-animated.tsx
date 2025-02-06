import { getBlogPosts } from "@/lib/actions/post";
import { AnimatedTestimonials } from "@/ui/shadcn/animated-testimonials";
import React from "react";

/**
 * A React functional component that renders a div containing the text "blog-animated".
 */

export default async function BlogTestimonial() {
	const allBlogPosts = await getBlogPosts();
	const arrangedPosts = allBlogPosts.map((post) => ({
		quote: post.metadata.summary,
		name: post.metadata.title,
		src: post.metadata.image,
		designation: post.metadata.author,
		link: `/blog/${post.slug}`,
	}));
	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Derniers articles</h2>
			<AnimatedTestimonials autoplay testimonials={arrangedPosts} />
		</div>
	);
}
