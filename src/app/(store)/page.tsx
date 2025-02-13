import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
// import { getProducts, publishProduct } from "@/lib/kit/printify";
import StoreConfig from "@/store.config";
import BlogTestimonial from "@/ui/blog-animated";
import { CategoryBox } from "@/ui/category-box";
import { ProductList } from "@/ui/products/product-list";
import { YnsLink } from "@/ui/yns-link";
import * as Commerce from "commerce-kit";
import Image from "next/image";
import type { Metadata } from "next/types";

export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;

export default async function Home() {
	const allProducts = await Commerce.productBrowse({ first: 100 });
	const t = await getTranslations("/");

	const categories = ["heritage", "memoires", "essentiels"];
	const products = categories.flatMap((category) =>
		allProducts.filter((product) => product.metadata.category === category).slice(0, 3),
	);

	// const productsP = await getProducts("20672498");
	// const allProductsP = productsP.data.map((product) => {
	// 	const enabledVariants = product.variants.filter((v) => v.is_enabled === true);

	// 	return {
	// 		productId: product.id, // Assuming the product has an 'id' property
	// 		productName: product.title, // Assuming the product has a 'name' property
	// 		variants: enabledVariants.map((variant) => ({
	// 			id: variant.id, // Assuming each variant has an 'id' property
	// 			title: variant.title, // Assuming each variant has a 'title' property
	// 		})),
	// 	};
	// });

	// const test = allProductsP.forEach(async (product) => {
	// 	const result = await publishProduct("20672498", product.productId.toString());
	// 	console.log(result);
	// 	return result;
	// });

	// console.log(test);

	// const dleteTest = await deleteProduct("20672498", "67ab6563090afd919b0b9e16");
	// console.log(dleteTest);

	// // Log the result as JSON
	// console.log(JSON.stringify(allProductsP, null, 2));

	return (
		<main>
			<section className="rounded bg-neutral-100 py-8 sm:py-12">
				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
					<div className="max-w-md space-y-4">
						<h2 className="text-balance text-4xl font-bold tracking-tight md:text-4xl">{t("hero.title")}</h2>
						<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
						<YnsLink
							className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
							// href={t("hero.link")}
							href={`/products`}
						>
							{t("hero.action")}
						</YnsLink>
					</div>
					<div className="image-container">
						<Image
							alt="Cup of Coffee"
							loading="eager"
							priority={true}
							className="rounded"
							height={450}
							width={450}
							src="https://6ay8a7s9vf.ufs.sh/f/XID4kzR81z3MJRINodV41NkXFyAgWqjM7O05UGTdLJnvuzhY"
							style={{
								objectFit: "cover",
								// Vertical fade (bottom transparency)
								WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
								maskImage: "linear-gradient(to bottom, black 70%, transparent 95%)",
							}}
							sizes="(max-width: 640px) 70vw, 450px"
						/>
					</div>
				</div>
			</section>

			<ProductList products={products} />

			<section className="w-full py-8">
				<div className="grid gap-8 lg:grid-cols-3">
					{StoreConfig.categories.map(({ name, slug, image: src }) => (
						<CategoryBox key={slug} name={name} categorySlug={slug} src={src} />
					))}
				</div>
			</section>
			<section className="w-full py-8">
				<BlogTestimonial />
			</section>
		</main>
	);
}
