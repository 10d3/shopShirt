// lib/actions/products.ts
"use server";

import stripe from "@/lib/actions/stripe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
	name: z.string().min(2),
	description: z.string().optional(),
	price: z.string().regex(/^\d+(\.\d{1,2})?$/),
	currency: z.string().length(3),
});

export async function getProducts() {
	const products = await stripe.products.list({ limit: 100 });
	return products.data;
}

export async function getProduct(id: string) {
	const product = await stripe.products.retrieve(id);
	const prices = await stripe.prices.list({ product: id });
	return { ...product, prices: prices.data };
}

export async function createProduct(formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());
	const validated = ProductSchema.parse(rawData);

	const product = await stripe.products.create({
		name: validated.name,
		description: validated.description,
	});

	await stripe.prices.create({
		product: product.id,
		unit_amount: Math.round(parseFloat(validated.price) * 100),
		currency: validated.currency.toLowerCase(),
	});

	revalidatePath("/dashboard?step=products");
	redirect("/dashboard?step=products");
}

export async function updateProduct(id: string, formData: FormData) {
	const rawData = Object.fromEntries(formData.entries());
	const validated = ProductSchema.parse(rawData);

	await stripe.products.update(id, {
		name: validated.name,
		description: validated.description,
	});

	revalidatePath("/dashboard?step=products");
	redirect("/dashboard?step=products");
}

// lib/actions/products.ts
export async function deleteProduct(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
	const id = formData.get("id") as string;

	try {
		// Delete all prices first
		const prices = await stripe.prices.list({ product: id });
		await Promise.all(prices.data.map((price) => stripe.prices.update(price.id, { active: false })));

		// Archive the product
		await stripe.products.update(id, { active: false });

		revalidatePath("/dashboard?step=products");
		return {};
	} catch (error) {
		return { error: "Failed to delete product" };
	}
}
