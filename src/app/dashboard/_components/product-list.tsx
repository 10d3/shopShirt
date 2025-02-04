"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProduct } from "@/lib/actions/product";
import type { StripeProduct } from "@/lib/types";
import { Archive, ArchiveRestore, DollarSign, Edit, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

export default function ProductList({
	products,
}: {
	products: StripeProduct[];
}) {
	const [state, formAction] = useActionState(deleteProduct, null);

	const activeProducts = products.filter((product) => product.active);
	const archivedProducts = products.filter((product) => !product.active);

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Products</h1>
				<Link href="/dashboard?step=products&id=new">
					<Button size="lg">
						<Plus className="mr-2 h-5 w-5" /> New Product
					</Button>
				</Link>
			</div>

			<Tabs defaultValue="active" className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
					<TabsTrigger value="archived">Archived ({archivedProducts.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="active">
					<ProductGrid products={activeProducts} formAction={formAction} state={state} isArchived={false} />
				</TabsContent>

				<TabsContent value="archived">
					<ProductGrid products={archivedProducts} formAction={formAction} state={state} isArchived={true} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ProductGrid({
	products,
	formAction,
	state,
	isArchived,
}: {
	products: StripeProduct[];
	formAction: (payload: FormData) => void;
	state: { error?: string | undefined } | null;
	isArchived: boolean;
}) {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<Card key={product.id} className="overflow-hidden">
					<CardHeader className="p-0">
						<div className="relative h-48 w-full">
							<Image
								src={product.images[0] || "/placeholder.svg"}
								alt={product.name}
								layout="fill"
								objectFit="cover"
							/>
							<Badge className="absolute top-2 right-2" variant={isArchived ? "secondary" : "default"}>
								{isArchived ? "Archived" : "Active"}
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="p-4">
						<CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
						<p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
						<div className="flex items-center text-lg font-bold text-primary">
							<DollarSign className="h-5 w-5 mr-1" />
							{((product.prices?.[0]?.unit_amount ?? 0) / 100).toFixed(2)}
						</div>
					</CardContent>
					<CardFooter className="bg-muted p-4 flex justify-between">
						<Link href={`/dashboard?step=products&id=${product.id}`}>
							<Button variant="outline" size="sm">
								<Edit className="h-4 w-4 mr-2" /> Edit
							</Button>
						</Link>
						<form action={formAction}>
							<input type="hidden" name="id" value={product.id} />
							<Button
								variant="ghost"
								size="sm"
								type="submit"
								className={
									isArchived
										? "text-green-600 hover:text-green-700"
										: "text-destructive hover:text-destructive"
								}
							>
								{isArchived ? (
									<>
										<ArchiveRestore className="h-4 w-4 mr-2" /> Restore
									</>
								) : (
									<>
										<Archive className="h-4 w-4 mr-2" /> Archive
									</>
								)}
							</Button>
						</form>
					</CardFooter>
				</Card>
			))}

			{products.length === 0 && (
				<Card className="col-span-full p-8">
					<CardContent className="text-center text-muted-foreground">
						<p className="text-lg mb-4">No {isArchived ? "archived" : "active"} products found</p>
						{!isArchived && (
							<Link href="/dashboard?step=products&id=new">
								<Button>
									<Plus className="mr-2 h-4 w-4" /> Add New Product
								</Button>
							</Link>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
