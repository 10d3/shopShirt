"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const announcements = [
	"Fête Saint Joseph : Offres Spéciales !",
	"Profitez de -14% sur nos maillots, -20% sur nos tasses et -33% sur nos tableaux. Offre limitée !",
	"Célébrez Fort-Liberté en Grand !",
	"Maillots à -14%, tasses à -20%, tableaux à -33% : des promos exclusives pour la fête Saint Joseph !",
	"Promo Fête Saint Joseph",
	"Saisissez l'occasion : -14% sur les maillots, -20% sur les tasses et -33% sur les tableaux",
];

export function AnnouncementBanner() {
	const [currentIndex, setCurrentIndex] = React.useState(0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex === announcements.length - 1 ? 0 : prevIndex + 1));
		}, 3000); // Change message every 3 seconds

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="relative bg-black text-white overflow-hidden h-12 md:h-8">
			<div className="flex items-center justify-center w-full h-full">
				{announcements.map((announcement, index) => (
					<div
						key={index}
						className={cn(
							"absolute w-full text-center text-sm transition-all duration-500 ease-in-out",
							index === currentIndex
								? "opacity-100 transform translate-y-0"
								: "opacity-0 transform -translate-y-full",
						)}
						aria-hidden={index !== currentIndex}
					>
						{announcement}
					</div>
				))}
			</div>
		</div>
	);
}
