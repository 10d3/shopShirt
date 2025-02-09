// import { getPost } from "@/data/blog";
// import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
// import "../../../styles/mdx.css";
import "../../../mdx.css";
// import Link from "next/link";
// import { useTheme } from "next-themes";
import { getPost } from "@/lib/actions/post";
import { Button } from "@/ui/shadcn/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export async function generateMetadata(props: {
	params: Promise<{
		slug: string;
	}>;
}): Promise<Metadata | undefined> {
	const params = await props.params;
	let post = await getPost(params.slug);

	let { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
	let ogImage = image ? `${image}` : `https://fortetfier.com/og?title=${title}`;

	return {
		title,
		description,
		keywords: post.metadata.keywords,
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime,
			url: `https://fortetfier.com/blog/${post.slug}`,
			images: [
				{
					url: post.metadata.image ? `${post.metadata.image}` : `${post.metadata.image}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function Blog(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;
	let post = await getPost(params.slug);

	if (!post) {
		notFound();
	}

	console.log(post);

	return (
		<section
			id="blog"
			className="flex min-h-screen md:max-w-4xl mx-auto md:pt-6 px-2 flex-col gap-6 pb-6 md:px-0"
		>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `${post.metadata.image}`
							: `https://fortetfier.com/og?title=${post.metadata.title}`,
						url: `https://fortetfier.com/blog/${post.slug}`,
						author: {
							"@type": "Person",
							name: post.metadata.authors[0],
						},
					}),
				}}
			/>
			<h1 className="title font-medium text-4xl tracking-tighter max-w-full">{post.metadata.title}</h1>
			<div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
				<Suspense fallback={<p className="h-5" />}>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						{formatDate(post.metadata.publishedAt)}
					</p>
				</Suspense>
			</div>
			<div>
				<Image
					src={post.metadata.image || "/placeholder.svg"}
					className="w-full"
					alt="Article image"
					width={1000}
					height={1000}
				/>
				{post.metadata.image === "/fortetfierfortliberteai.png" && (
					<span className=" text-sm text-muted-foreground/90">
						Image créée par intelligence artificielle à titre illustratif.
					</span>
				)}
			</div>
			<article
				className="mdx-component mdx-content text-justify prose dark:prose-invert"
				dangerouslySetInnerHTML={{ __html: post.source }}
			></article>
			<div className="mt-4 flex justify-center space-x-4">
				<Button variant="outline" size="icon" asChild>
					<a
						href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://fortetfier.com/blog/${post.slug}`)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Facebook className="h-4 w-4" />
					</a>
				</Button>
				<Button variant="outline" size="icon" asChild>
					<a
						href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://fortetfier.com/blog/${post.slug}`)}&text=${encodeURIComponent(post.metadata.title)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Twitter className="h-4 w-4" />
					</a>
				</Button>
				<Button variant="outline" size="icon" asChild>
					<a
						href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://fortetfier.com/blog/${post.slug}`)}&title=${encodeURIComponent(post.metadata.title)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Linkedin className="h-4 w-4" />
					</a>
				</Button>
			</div>
		</section>
	);
}
