import "server-only";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

// Define custom MDX components
const mdxComponents = {
	// Custom styling for links using Next.js Link
	a: (props: React.ComponentProps<typeof Link>) => (
		<Link {...props} className="text-blue-500 hover:underline" />
	),
	// Headings with improved styling
	h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1 className="mt-8 mb-4 text-4xl font-bold text-center text-gray-900" {...props} />
	),
	h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2 className="mt-6 mb-3 text-3xl font-semibold text-gray-800" {...props} />
	),
	h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3 className="mt-5 mb-2 text-2xl font-medium text-gray-700" {...props} />
	),
	// Paragraphs with proper spacing
	p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p className="mb-4 text-gray-600 leading-relaxed" {...props} />
	),
	// Lists with better spacing
	ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className="list-disc list-inside space-y-2" {...props} />
	),
	ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className="list-decimal list-inside space-y-2" {...props} />
	),
	li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="ml-4 text-gray-600" {...props} />,
	// Line breaks for better text formatting
	br: () => <br className="my-2" />,
};

export const Markdown = async ({ source }: { source: string }) => {
	return <MDXRemote source={source} components={mdxComponents} />;
};
