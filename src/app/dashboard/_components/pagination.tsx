"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
	currentPage,
	totalItems,
	itemsPerPage,
}: {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
}) {
	const searchParams = useSearchParams();
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const createPageURL = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		return `?${params.toString()}`;
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxVisiblePages = 5;

		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<Link key={i} href={createPageURL(i)}>
					<Button variant={i === currentPage ? "default" : "outline"} size="sm" className="w-10">
						{i}
					</Button>
				</Link>,
			);
		}

		return pageNumbers;
	};

	return (
		<nav className="flex items-center justify-between mt-8" aria-label="Pagination">
			<div className="text-sm text-muted-foreground">
				Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
				<span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
				<span className="font-medium">{totalItems}</span> results
			</div>
			<div className="flex items-center space-x-2">
				<Link href={createPageURL(currentPage - 1)}>
					<Button variant="outline" size="sm" disabled={currentPage <= 1} aria-label="Previous page">
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div className="flex space-x-1">{renderPageNumbers()}</div>
				<Link href={createPageURL(currentPage + 1)}>
					<Button variant="outline" size="sm" disabled={currentPage >= totalPages} aria-label="Next page">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>
		</nav>
	);
}
