"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface OrderItem {
	id: string;
	productName: string;
	productDescription?: string | null;
	productImage?: string | null;
	digitalAssetUrl?: string | null;
	quantity: number;
	price: number;
}

interface OrderItemsDialogProps {
	items: OrderItem[];
}

export function OrderItemsDialog({ items }: OrderItemsDialogProps) {
	const [open, setOpen] = React.useState(false);

	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2">
				<ShoppingBag className="h-4 w-4" />
				<span>
					{totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
				</span>
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Order Items</DialogTitle>
					</DialogHeader>

					<ScrollArea className="max-h-[60vh]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead className="text-right">Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<div className="relative h-16 w-16 rounded overflow-hidden">
													<Image
														src={item.productImage || "/placeholder.svg"}
														alt={item.productName}
														layout="fill"
														objectFit="cover"
													/>
												</div>
												<div>
													<div className="font-medium">{item.productName}</div>
													{item.productDescription && (
														<div className="text-sm text-muted-foreground">{item.productDescription}</div>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell>{item.quantity}</TableCell>
										<TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>

					<div className="mt-4 flex justify-between items-center">
						<div className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</div>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</div>

					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="absolute right-4 top-4">
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
				</DialogContent>
			</Dialog>
		</>
	);
}
