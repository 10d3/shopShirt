"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface GalleryItem {
	id: string;
	title: string;
	summary: string;
	url: string;
	image: string;
}

interface Gallery6Props {
	heading?: string;
	demoUrl?: string;
	items?: GalleryItem[];
}

const Gallery6 = ({
	heading = "Gallery",
	demoUrl = "https://www.shadcnblocks.com",
	items = [
		{
			id: "item-1",
			title: "Build Modern UIs",
			summary: "Create stunning user interfaces with our comprehensive design system.",
			url: "#",
			image: "/images/block/placeholder-dark-1.svg",
		},
		{
			id: "item-2",
			title: "Computer Vision Technology",
			summary: "Powerful image recognition and processing capabilities for AI systems.",
			url: "#",
			image: "/images/block/placeholder-dark-1.svg",
		},
		{
			id: "item-3",
			title: "Machine Learning Automation",
			summary: "Self-improving algorithms that learn from data patterns to automate complex tasks.",
			url: "#",
			image: "/images/block/placeholder-dark-1.svg",
		},
		{
			id: "item-4",
			title: "Predictive Analytics",
			summary: "Advanced forecasting capabilities to predict future trends and outcomes.",
			url: "#",
			image: "/images/block/placeholder-dark-1.svg",
		},
		{
			id: "item-5",
			title: "Neural Network Architecture",
			summary: "Sophisticated AI models inspired by human brain structure for complex problem-solving.",
			url: "#",
			image: "/images/block/placeholder-dark-1.svg",
		},
	],
}: Gallery6Props) => {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!carouselApi) {
			return;
		}
		const updateSelection = () => {
			setCanScrollPrev(carouselApi.canScrollPrev());
			setCanScrollNext(carouselApi.canScrollNext());
		};
		updateSelection();
		carouselApi.on("select", updateSelection);
		return () => {
			carouselApi.off("select", updateSelection);
		};
	}, [carouselApi]);

	return (
		<section className="py-6">
			<div className="mb-6 flex flex-col justify-between md:mb-8 md:flex-row md:items-end">
				<div>
					<h2 className="mb-2 text-2xl font-semibold md:mb-3 md:text-3xl">{heading}</h2>
				</div>
				<div className="mt-4 flex shrink-0 items-center justify-start gap-2 md:mt-0">
					<Button
						size="icon"
						variant="outline"
						onClick={() => {
							carouselApi?.scrollPrev();
						}}
						disabled={!canScrollPrev}
						className="disabled:pointer-events-auto"
					>
						<ArrowLeft className="size-4" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={() => {
							carouselApi?.scrollNext();
						}}
						disabled={!canScrollNext}
						className="disabled:pointer-events-auto"
					>
						<ArrowRight className="size-4" />
					</Button>
				</div>
			</div>
			<div className="w-full overflow-hidden">
				<Carousel
					setApi={setCarouselApi}
					opts={{
						align: "start",
						loop: true,
					}}
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{items.map((item) => (
							<CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
								<a href={item.url} className="group flex flex-col justify-between">
									<div>
										<div className="flex aspect-[3/2] overflow-clip rounded-lg">
											<div className="flex-1">
												<div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
													<img
														src={item.image || "/placeholder.svg"}
														alt={item.title}
														className="h-full w-full object-cover object-center"
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="mb-1 line-clamp-2 break-words pt-3 text-base font-medium md:mb-2 md:text-lg">
										{item.title}
									</div>
									<div className="mb-4 line-clamp-2 text-xs text-muted-foreground md:mb-6 md:text-sm">
										{item.summary}
									</div>
									<div className="flex items-center text-xs md:text-sm">
										Lire la suite{" "}
										<ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
									</div>
								</a>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>
		</section>
	);
};

export { Gallery6 };
