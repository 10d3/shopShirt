// app/api/stripe/products/route.ts
import stripe from "@/lib/actions/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const variantSchema = z.object({
	price: z.string(),
	currency: z.string(),
	image: z.string().optional(),
	attributes: z.record(z.string()).optional(),
	metadata: z.record(z.string()).optional(),
});

const productSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	category: z.string(),
	active: z.boolean(),
	metadata: z.record(z.string()).optional(),
	variants: z.array(variantSchema),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validatedBody = productSchema.parse(body);

		// console.log(validatedBody);

		// Create Stripe product with metadata
		const product = await stripe.products.create({
			name: validatedBody.name,
			description: validatedBody.description,
			active: validatedBody.active,
			metadata: {
				// category: validatedBody.category,
				...validatedBody.metadata,
			},
		});

		// Create prices with variant metadata
		const prices = await Promise.all(
			validatedBody.variants.map(async (variant) => {
				return stripe.prices.create({
					product: product.id,
					unit_amount: Math.round(parseFloat(variant.price) * 100),
					currency: variant.currency.toLowerCase(),
					metadata: {
						image: variant.image || "",
						attributes: JSON.stringify(variant.attributes || {}),
						...variant.metadata,
					},
				});
			}),
		);

		return NextResponse.json({
			id: product.id,
			prices: prices.map((p: Stripe.Price) => p.id),
		});
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			// console.log(error);
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		if (error instanceof Stripe.errors.StripeError) {
			return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
		}

		return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
	}
}
