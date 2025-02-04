import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { productBrowse } from "@/lib/kit/commerce";
import { deslugify } from "@/lib/utils";
import { ProductList } from "@/ui/products/product-list";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const products = await productBrowse({
		first: 100,
		filter: { category: params.slug },
	});

	if (products.length === 0) {
		return notFound();
	}

	const t = await getTranslations("/category.metadata");

	return {
		title: t("title", { categoryName: deslugify(params.slug) }),
		alternates: { canonical: `${publicUrl}/category/${params.slug}` },
	};
};

export default async function CategoryPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	console.log(params.slug);
	const products = await productBrowse({
		first: 100,
		filter: { category: params.slug },
	});

	// console.log("products", products);

	if (products.length === 0) {
		return notFound();
	}

	const uniqueProducts = Array.from(
		products
			.reduce((map, product) => {
				if (!map.has(product.metadata.slug)) {
					map.set(product.metadata.slug, product);
				}
				return map;
			}, new Map<string, (typeof products)[0]>())
			.values(),
	);

	const t = await getTranslations("/category.page");

	return (
		<main className="pb-8">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{deslugify(params.slug)}
				<div className="text-lg font-semibold text-muted-foreground">
					{t("title", { categoryName: deslugify(params.slug) })}
				</div>
			</h1>
			<ProductList products={uniqueProducts} />
		</main>
	);
}
