// import { Separator } from "@/components/ui/separator";
import { BlogPostCard } from "@/app/(store)/blog/_components/BlogCard";
import { CategoryList } from "@/app/(store)/blog/_components/CategoryList";
import { HeroSection } from "@/app/(store)/blog/_components/HeroSection";
import { PaginationControls } from "@/app/(store)/blog/_components/Pagination";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/actions/post";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const POSTS_PER_PAGE = 6;

export const metadata = {
	title: "Chroniques",
	description:
		"Bienvenue dans Chroniques, l’espace où Fort-Liberté s’exprime à travers des récits, des réflexions et des prises de position. Ici, nous partageons des histoires, des souvenirs et des perspectives sur notre ville natale, son héritage et son évolution.",
	keywords: [
		"Fort-Liberté",
		"histoire de Fort-Liberté",
		"visiter Fort-Liberté",
		"événements à Fort-Liberté",
		"faits insolites Fort-Liberté",
		"lieux à visiter Fort-Liberté",
		"culture de Fort-Liberté",
		"tourisme à Fort-Liberté",
		"attractions Fort-Liberté",
		"gastronomie Fort-Liberté",
		"patrimoine Fort-Liberté",
		"activités à Fort-Liberté",
		"conseils de voyage Fort-Liberté",
		"monuments historiques Fort-Liberté",
		"nature à Fort-Liberté",
		"plages de Fort-Liberté",
		"traditions de Fort-Liberté",
		"visites guidées Fort-Liberté",
		"hôtels à Fort-Liberté",
		"transport à Fort-Liberté",
	],
	openGraph: {
		title: "Chroniques",
		description:
			"Bienvenue dans Chroniques, l’espace où Fort-Liberté s’exprime à travers des récits, des réflexions et des prises de position. Ici, nous partageons des histoires, des souvenirs et des perspectives sur notre ville natale, son héritage et son évolution.",
		url: "https://fortetfier.com/", // Replace with your website URL
		siteName: "Fort&Fier",
		images: [
			{
				url: "https://fortetfier.com/fl.jpg", // Replace with your OpenGraph image URL
				width: 1200,
				height: 630,
				alt: "Chroniques",
			},
		],
		locale: "fr_FR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Chroniques",
		description:
			"Bienvenue dans Chroniques, l’espace où Fort-Liberté s’exprime à travers des récits, des réflexions et des prises de position. Ici, nous partageons des histoires, des souvenirs et des perspectives sur notre ville natale, son héritage et son évolution.",
		creator: "@Robeatns", // Replace with your Twitter handle
		site: "@Robeatns", // Replace with your Twitter handle
		images: [
			{
				url: "https://fortetfier.com/fl.jpg", // Replace with the same OpenGraph image
				alt: "Chroniques",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function BlogPage(props: {
	searchParams: Promise<{ page?: string; category?: string }>;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const category = searchParams.category;
	const posts = await getBlogPosts();

	let filteredPosts = posts;
	if (category) {
		filteredPosts = posts.filter((post) => post.metadata.category === category);
	}

	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
	const displayedPosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

	const sortedPosts = displayedPosts.sort(
		(a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
	);

	const categoryList: string[] = posts
		.map((post) => post.metadata.category)
		.filter((category, index, categories) => categories.indexOf(category) === index);

	const postALaUne = posts[posts.length - 1];

	return (
		<div className="min-h-screen bg-background">
			<HeroSection />

			<main className="container mx-auto py-12 px-4">
				<CategoryList categories={categoryList} />

				<section id="featured" className="mb-16">
					<h2 className="text-3xl font-bold mb-8">Article à la une</h2>
					{posts.length > 0 && (
						<Link href={`/blog/${postALaUne?.slug}`}>
							<BlogPostCard
								post={
									posts[posts.length - 1] as {
										metadata: { [key: string]: string };
										source: string;
										slug: string;
									}
								}
								featured={true}
							/>
						</Link>
					)}
				</section>

				<Separator className="my-12" />

				<section>
					<h2 className="text-3xl font-bold mb-8">Derniers articles</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{sortedPosts.map((post) => (
							<div key={post.slug} className="flex flex-col">
								<Link
									href={`/blog/${post.slug}`}
									className="transform hover:scale-105 transition-transform duration-300 flex-grow"
								>
									<BlogPostCard post={post} />
								</Link>
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
							</div>
						))}
					</div>
				</section>

				{filteredPosts.length > POSTS_PER_PAGE && (
					<PaginationControls currentPage={page} totalPages={totalPages} />
				)}

				{filteredPosts.length === 0 && (
					<div className="text-center py-12">
						<h2 className="text-2xl font-semibold mb-4">Aucun article trouvé</h2>
						<p className="text-muted-foreground mb-8">
							Nos écrivains travaillent actuellement sur de nouveaux articles passionnants. Revenez bientôt !
						</p>
						<Button asChild>
							<Link href="/contribuer">Contribuer un Article</Link>
						</Button>
					</div>
				)}
			</main>
		</div>
	);
}
