// app/dashboard/_components/product-list.tsx
"use client";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/product";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function ProductList({
	products,
}: {
	products: Array<{
		id: string;
		name: string;
		prices: Array<{ unit_amount: number }>;
	}>;
}) {
	const [state, formAction] = useActionState(deleteProduct, null);
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Products</h1>
				<Link href="/dashboard?step=products&id=new">
					<Button>
						<Plus className="mr-2 h-4 w-4" /> New Product
					</Button>
				</Link>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<div key={product.id} className="border p-4 rounded-lg relative">
						<h3 className="font-medium">{product.name}</h3>
						<p className="text-muted-foreground">${product.prices?.[0]?.unit_amount ?? 0 / 100}</p>

						<div className="absolute top-2 right-2 flex gap-2">
							<Link href={`/dashboard?step=products&id=${product.id}`}>
								<Button variant="ghost" size="sm">
									<Edit className="h-4 w-4" />
								</Button>
							</Link>
							<form action={formAction}>
								<input type="hidden" name="id" value={product.id} />
								<Button variant="destructive" size="sm">
									Delete
								</Button>
							</form>
							{state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
