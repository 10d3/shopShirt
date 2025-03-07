"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/lib/actions/order";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export function OrderActions({
	order,
}: {
	order: {
		id: string;
		status: string;
		pointOfSales: string | null;
		// Add other required properties here
	};
}) {
	// console.log("order.pointOfSales", order.pointOfSales);
	const [isPending, startTransition] = useTransition();

	const handleStatusUpdate = (newStatus: string, pointOfSales?: string) => {
		// console.log(newStatus, pointOfSales);
		startTransition(async () => {
			await updateOrderStatus(order.id, newStatus, pointOfSales);
			window.location.reload();
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link href={`/admin/orders/${order.id}`}>View Details</Link>
				</DropdownMenuItem>
				{(order.status === "received" || order.status === "idle") && (
					<DropdownMenuItem disabled={isPending} onSelect={() => handleStatusUpdate("preparing")}>
						Start Preparing
					</DropdownMenuItem>
				)}
				{order.status === "preparing" && (
					<DropdownMenuItem
						onSelect={() => handleStatusUpdate("ready_for_pickup", order.pointOfSales as string)}
					>
						Mark as Ready for Pickup
					</DropdownMenuItem>
				)}
				{order.status === "ready_for_pickup" && (
					<DropdownMenuItem onSelect={() => handleStatusUpdate("picked_up")}>Confirm Pickup</DropdownMenuItem>
				)}
				<DropdownMenuItem className="text-red-600" onSelect={() => handleStatusUpdate("canceled")}>
					Cancel Order
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
