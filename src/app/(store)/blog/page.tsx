// import { Separator } from "@/components/ui/separator";
import { BlogPostCard } from "@/app/(store)/blog/_components/BlogCard";
import { HeroSection } from "@/app/(store)/blog/_components/HeroSection";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/actions/post";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
				url: "https://amherley.dev/blog.png", // Replace with your OpenGraph image URL
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
				url: "https://amherley.dev/blog.png", // Replace with the same OpenGraph image
				alt: "Chroniques",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function BlogPage(props: { searchParams: { page?: string } }) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const posts = await getBlogPosts();

	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const displayedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

	return (
		<div className="min-h-screen bg-background">
			<HeroSection />

			<main className="container mx-auto py-12 px-4">
				{/* <section id="featured" className="mb-16">
					<h2 className="text-3xl font-bold mb-8">Article à la une</h2>
					{posts.length > 0 && <BlogPostCard post={posts[0]} featured={true} />}
				</section>

				<Separator className="my-12" /> */}

				<section>
					<h2 className="text-3xl font-bold mb-8">Derniers articles</h2>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{displayedPosts.map((post) => (
							<Link
								href={`/blog/${post.slug}`}
								key={post.slug}
								className="transform hover:scale-105 transition-transform duration-300"
							>
								<BlogPostCard post={post} />
							</Link>
						))}
					</div>
				</section>

				{posts.length > POSTS_PER_PAGE && (
					<div className="flex justify-center items-center space-x-4 mt-12">
						<Button
							variant="outline"
							disabled={page === 1}
							onClick={() => {
								// Handle previous page
							}}
						>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Précédent
						</Button>
						<span>
							Page {page} sur {totalPages}
						</span>
						<Button
							variant="outline"
							disabled={page === totalPages}
							onClick={() => {
								// Handle next page
							}}
						>
							Suivant
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</div>
				)}

				{posts.length === 0 && (
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
