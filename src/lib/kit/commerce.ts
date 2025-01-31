import stripe from "@/lib/actions/stripe";
import type Stripe from "stripe";

export async function productBrowse(params: {
	first?: number;
	last?: number;
	offset?: number;
	filter?: {
		category?: string;
	};
}): Promise<
	Array<{
		default_price: Stripe.Price;
		marketing_features: string[];
		metadata: {
			slug: string;
			stock: number;
			category?: string;
			order?: number;
			variant?: string;
			digitalAsset?: string;
			preview?: string;
		};
		id: string;
		object: "product";
		active: boolean;
		created: number;
		deleted?: void;
		description: string | null;
		images: string[];
		livemode: boolean;
		name: string;
		package_dimensions: Stripe.Product.PackageDimensions | null;
		shippable: boolean | null;
		statement_descriptor?: string | null;
		tax_code: string | Stripe.TaxCode | null;
		type: Stripe.Product.Type;
		unit_label?: string | null;
		updated: number;
		url: string | null;
	}>
> {
	const { first = 10, filter } = params;

	// Build search query
	let query = "active:'true'";
	if (filter?.category) {
		query += ` AND metadata[\'category\']:\'${filter.category}\'`;
	}

	// Search products with metadata filter
	const { data: products } = await stripe.products.search({
		query,
		limit: first,
		expand: ["data.default_price", "data.tax_code"],
	});

	// Map and validate products
	return products.map((product) => {
		// Validate required metadata
		if (!product.metadata.slug || !product.metadata.stock) {
			throw new Error(`Product ${product.id} missing required metadata: slug or stock`);
		}

		// Parse marketing features
		const marketingFeatures = product.metadata.marketing_features?.split(",") || [];

		// Build return object
		return {
			default_price: product.default_price as Stripe.Price,
			marketing_features: marketingFeatures,
			metadata: {
				slug: product.metadata.slug,
				stock: parseInt(product.metadata.stock, 10),
				category: product.metadata.category,
				order: product.metadata.order ? parseInt(product.metadata.order, 10) : undefined,
				variant: product.metadata.variant,
				digitalAsset: product.metadata.digitalAsset,
				preview: product.metadata.preview,
			},
			id: product.id,
			object: product.object as "product",
			active: product.active,
			created: product.created,
			description: product.description,
			images: product.images,
			livemode: product.livemode,
			name: product.name,
			package_dimensions: product.package_dimensions,
			shippable: product.shippable,
			statement_descriptor: product.statement_descriptor || null,
			tax_code: product.tax_code as string | Stripe.TaxCode | null,
			type: product.type,
			unit_label: product.unit_label || null,
			updated: product.updated,
			url: product.url,
		};
	});
}
