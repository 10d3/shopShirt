import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { productBrowse } from "@/lib/kit/commerce";
import { ProductList } from "@/ui/products/product-list";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/products.metadata");
	return {
		title: t("title"),
		alternates: { canonical: `${publicUrl}/products` },
	};
};

export default async function AllProductsPage() {
	// const products = await Commerce.productBrowse({ first: 100 });
	const products = await productBrowse({ first: 100 });
	const t = await getTranslations("/products.page");

	console.log("products", products);

	return (
		<main className="pb-8">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{t("title")}</h1>
			<ProductList products={products} />
		</main>
	);
}
