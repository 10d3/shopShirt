import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
	return (
		<div className="relative py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto text-center">
				<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
					Chroniques de Fort-Liberté
				</h1>
				<p className="mt-6 text-xl max-w-2xl mx-auto">
					Explorez l'histoire, la culture et l'évolution de notre ville à travers des récits captivants et des
					réflexions profondes.
				</p>
				<div className="mt-10">
					<Button asChild size="lg">
						<Link href="#featured">Découvrir nos articles</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
