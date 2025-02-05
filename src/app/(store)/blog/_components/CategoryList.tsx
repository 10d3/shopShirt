"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type Category = {
	name: string;
	slug: string;
};

export function CategoryList({ categories }: { categories: string[] }) {
	// console.log(props.categories);
	const router = useRouter();

	return (
		<div className="flex flex-wrap gap-2 mb-8">
			{categories.map((category, idx) => (
				<Button
					key={idx}
					variant="outline"
					onClick={() => router.push(`/blog?category=${encodeURIComponent(category)}`)}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</Button>
			))}
			<Button variant="outline" onClick={() => router.push("/blog")}>
				Tout
			</Button>
		</div>
	);
}
