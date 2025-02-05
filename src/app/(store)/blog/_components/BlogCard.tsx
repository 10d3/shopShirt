import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface BlogPost {
	metadata: {
		// title: string;
		// publishedAt: string;
		// summary: string;
		// keywords: string[];
		// image: string;
		// authors: string[];
		// readingTime?: string;
		[key: string]: string; // This allows for additional properties
	};
	slug: string;
	source: string;
}

export function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
	return (
		<Card
			className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${featured ? "lg:flex" : ""}`}
		>
			<div className={`relative ${featured ? "lg:w-1/2" : "h-48"}`}>
				<Image
					src={post.metadata.image || "/placeholder.svg"}
					alt={post.metadata.title || "Article image"}
					layout="fill"
					objectFit="cover"
				/>
			</div>
			<div className={`flex flex-col ${featured ? "lg:w-1/2" : ""}`}>
				<CardHeader>
					<h2 className={`font-bold ${featured ? "text-2xl" : "text-xl"}`}>
						{post.metadata.title || "Sans titre"}
					</h2>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm mb-4 line-clamp-3">
						{post.metadata.summary || "Aucun résumé disponible."}
					</p>
					{/* <div className="flex flex-wrap gap-2 mb-4">
						{post.metadata.keywords?.slice(0, 3).map((keyword: string, index: number) => (
							<Badge key={index} variant="secondary">
								{keyword}
							</Badge>
						))}
					</div> */}
				</CardContent>
				<CardFooter className="mt-auto bg-muted p-4 flex flex-wrap justify-between items-center text-sm">
					<div className="flex items-center mr-4 mb-2 sm:mb-0">
						<CalendarIcon className="h-4 w-4 mr-2" />
						{new Date(post.metadata.publishedAt || Date.now()).toLocaleDateString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>
					<div className="flex items-center mr-4 mb-2 sm:mb-0">
						<UserIcon className="h-4 w-4 mr-2" />
						{Array.isArray(post.metadata.authors) ? post.metadata.authors.join(", ") : "Auteur inconnu"}
					</div>
					{post.metadata.readingTime && (
						<div className="flex items-center">
							<ClockIcon className="h-4 w-4 mr-2" />
							{post.metadata.readingTime} de lecture
						</div>
					)}
				</CardFooter>
			</div>
		</Card>
	);
}
