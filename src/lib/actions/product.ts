// lib/actions/products.ts
"use server";

import type { ProductFormValues } from "@/app/dashboard/_components/product-editor";
import stripe from "@/lib/actions/stripe";
import type { StripePrice } from "@/lib/types";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
import type Stripe from "stripe";
// import { z } from "zod";

// const ProductSchema = z.object({
// 	name: z.string().min(2),
// 	description: z.string().optional(),
// 	price: z.string().regex(/^\d+(\.\d{1,2})?$/),
// 	currency: z.string().length(3),
// });

export async function getProducts() {
	const products = await stripe.products.list({ limit: 100 });
	return products.data;
}

export async function getProduct(id: string) {
	try {
		const product = await stripe.products.retrieve(id);
		const prices = await stripe.prices.list({ product: id });

		const transformDefaultPrice = (): string | StripePrice | null => {
			if (!product.default_price) return null;
			if (typeof product.default_price === "string") return product.default_price;

			const price = product.default_price as Stripe.Price;
			return {
				id: price.id,
				object: "price",
				active: price.active,
				currency: price.currency,
				unit_amount: price.unit_amount,
				unit_amount_decimal: price.unit_amount_decimal,
				product: typeof price.product === "string" ? price.product : price.product.id,
				type: price.type,
				//   created: price.created
			};
		};

		return {
			...product,
			// Convert metadata Record<string, string> to { key: string; value: string }[]
			metadata: product.metadata
				? Object.entries(product.metadata).map(([key, value]) => ({ key, value }))
				: [],
			default_price: transformDefaultPrice(),
			prices: prices.data.map((price) => ({
				id: price.id,
				object: "price" as const,
				active: price.active,
				currency: price.currency,
				unit_amount: price.unit_amount,
				unit_amount_decimal: price.unit_amount_decimal,
				product: typeof price.product === "string" ? price.product : price.product.id,
				type: price.type,
				created: price.created,
			})),
		};
	} catch (error) {
		console.error("Error fetching product:", error);
		return null;
	}
}

// export async function createProduct(formData: FormData) {
// 	const rawData = Object.fromEntries(formData.entries());
// 	const validated = ProductSchema.parse(rawData);

// 	const product = await stripe.products.create({
// 		name: validated.name,
// 		description: validated.description,
// 	});

// 	await stripe.prices.create({
// 		product: product.id,
// 		unit_amount: Math.round(parseFloat(validated.price) * 100),
// 		currency: validated.currency.toLowerCase(),
// 	});

// 	revalidatePath("/dashboard?step=products");
// 	redirect("/dashboard?step=products");
// }

export const updateProduct = async (productId: string, values: ProductFormValues) => {
	try {
		// Update main product
		const mainProduct = await stripe.products.update(productId, {
			name: values.name,
			description: values.description,
			images: values.image,
			active: values.active,
			metadata: Object.fromEntries(values.metadata.map((m) => [m.key, m.value])),
		});

		// Update or create price if price has changed
		if (mainProduct.default_price && typeof mainProduct.default_price === "string") {
			const currentPrice = await stripe.prices.retrieve(mainProduct.default_price);
			if (currentPrice.unit_amount !== Number(values.price) * 100) {
				const newPrice = await stripe.prices.create({
					product: productId,
					currency: "usd",
					unit_amount: Number(values.price) * 100,
				});

				await stripe.products.update(productId, {
					default_price: newPrice.id,
				});

				// Archive old price
				await stripe.prices.update(currentPrice.id, { active: false });
			}
		}

		// Convert to plain object
		const plainProduct = {
			id: mainProduct.id,
			name: mainProduct.name,
			description: mainProduct.description,
			active: mainProduct.active,
			metadata: mainProduct.metadata,
			default_price: mainProduct.default_price,
			images: mainProduct.images,
			created: mainProduct.created,
			updated: mainProduct.updated,
		};

		// Handle variants
		if (values.variants.length > 0) {
			// Get existing variants
			const existingVariants = await stripe.products.search({
				query: `metadata['parent_id']:'${productId}'`,
			});

			// Create a map of existing variants by their attribute combination
			const existingVariantsMap = new Map(
				existingVariants.data.map((variant) => [
					`${variant.metadata.variant_key}:${variant.metadata.variant_value}`,
					variant,
				]),
			);

			// Update or create variants
			await Promise.all(
				values.variants.map(async (variant) => {
					const variantKey = `${variant.attributes.key}:${variant.attributes.value}`;
					const existingVariant = existingVariantsMap.get(variantKey);

					if (existingVariant) {
						// Update existing variant
						const updatedVariant = await stripe.products.update(existingVariant.id, {
							name: `${values.name}`,
							description: values.description,
							images: variant.image,
							active: values.active,
							metadata: {
								...Object.fromEntries(values.metadata.map((m) => [m.key, m.value])),
								variant_key: variant.attributes.key,
								variant_value: variant.attributes.value,
								parent_id: productId,
							},
						});

						// Update price if changed
						if (existingVariant.default_price && typeof existingVariant.default_price === "string") {
							const currentPrice = await stripe.prices.retrieve(existingVariant.default_price);
							if (currentPrice.unit_amount !== Number(variant.price) * 100) {
								const newPrice = await stripe.prices.create({
									product: existingVariant.id,
									currency: variant.currency,
									unit_amount: Number(variant.price) * 100,
								});

								await stripe.products.update(existingVariant.id, {
									default_price: newPrice.id,
								});

								// Archive old price
								await stripe.prices.update(currentPrice.id, { active: false });
							}
						}

						return updatedVariant;
					} else {
						// Create new variant
						return await stripe.products.create({
							name: `${values.name}`,
							description: values.description,
							images: variant.image,
							default_price_data: {
								currency: variant.currency,
								unit_amount: Number(variant.price) * 100,
							},
							active: values.active,
							metadata: {
								...Object.fromEntries(values.metadata.map((m) => [m.key, m.value])),
								variant_key: variant.attributes.key,
								variant_value: variant.attributes.value,
								parent_id: productId,
							},
						});
					}
				}),
			);

			// Archive removed variants
			const newVariantKeys = new Set(
				values.variants.map((variant) => `${variant.attributes.key}:${variant.attributes.value}`),
			);

			await Promise.all(
				existingVariants.data
					.filter(
						(variant) =>
							!newVariantKeys.has(`${variant.metadata.variant_key}:${variant.metadata.variant_value}`),
					)
					.map((variant) => stripe.products.update(variant.id, { active: false })),
			);
		}

		return plainProduct;
	} catch (error) {
		console.error("Error updating product:", error);
		throw new Error("Failed to update product");
	}
};

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

export const createProduct = async (values: ProductFormValues) => {
	try {
		// Create main product with simplified response
		const mainProduct = await stripe.products.create({
			name: values.name,
			description: values.description,
			images: values.image,
			active: values.active,
			default_price_data: {
				currency: "usd",
				unit_amount: Number(values.price) * 100,
			},
			metadata: Object.fromEntries(values.metadata.map((m) => [m.key, m.value])),
		});

		// Convert to plain object
		const plainProduct = {
			id: mainProduct.id,
			name: mainProduct.name,
			description: mainProduct.description,
			active: mainProduct.active,
			metadata: mainProduct.metadata,
			default_price: mainProduct.default_price,
			images: mainProduct.images,
			created: mainProduct.created,
			updated: mainProduct.updated,
		};

		// Handle variants with Promise.all
		if (values.variants.length > 0) {
			await Promise.all(
				values.variants.map(async (variant) => {
					const variantProduct = await stripe.products.create({
						name: `${values.name}`,
						description: values.description,
						images: variant.image,
						default_price_data: {
							currency: variant.currency,
							unit_amount: Number(variant.price) * 100,
						},
						active: values.active,
						metadata: {
							...Object.fromEntries(values.metadata.map((m) => [m.key, m.value])),
							[variant.attributes.key]: variant.attributes.value,
						},
					});

					return {
						id: variantProduct.id,
						name: variantProduct.name,
						price: variantProduct.default_price,
						metadata: variantProduct.metadata,
						images: variantProduct.images,
					};
				}),
			);
		}

		return plainProduct; // Return simplified object
	} catch (error) {
		console.error("Error creating product:", error);
		throw new Error("Failed to create product");
	}
};
