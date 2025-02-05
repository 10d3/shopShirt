// app/(store)/blog/_components/PaginationControls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function PaginationControls({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleNavigation = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push(`/blog?${params.toString()}`);
	};

	return (
		<div className="flex justify-center items-center space-x-4 mt-12">
			<Button
				variant="outline"
				disabled={currentPage === 1}
				onClick={() => handleNavigation(currentPage - 1)}
			>
				<ChevronLeft className="h-4 w-4 mr-2" />
				Précédent
			</Button>
			<span>
				Page {currentPage} sur {totalPages}
			</span>
			<Button
				variant="outline"
				disabled={currentPage === totalPages}
				onClick={() => handleNavigation(currentPage + 1)}
			>
				Suivant
				<ChevronRight className="h-4 w-4 ml-2" />
			</Button>
		</div>
	);
}
