// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { publicUrl } from "@/env.mjs";
import { getLocale, getTranslations } from "@/i18n/server";
import { getRecommendedProducts } from "@/lib/search/trieve";
import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils";
import type { TrieveProductMetadata } from "@/scripts/upload-trieve";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import { Markdown } from "@/ui/markdown";
import { MainProductImage } from "@/ui/products/main-product-image";
import { Badge } from "@/ui/shadcn/badge";
import { StickyBottom } from "@/ui/sticky-bottom";
import { YnsLink } from "@/ui/yns-link";
import * as Commerce from "commerce-kit";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> => {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const variants = await Commerce.productGet({ slug: params.slug });

	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);
	if (!product) {
		return notFound();
	}
	console.log("product", product);
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${product.metadata.slug}`);
	if (selectedVariant) {
		canonical.searchParams.set("variant", selectedVariant);
	}

	const productName = formatProductName(product.name, product.metadata.variant);

	return {
		title: t("title", { productName }),
		description: product.description,
		keywords: [product.metadata.category, product.metadata.variant, product.name].filter(Boolean),
		alternates: { canonical },
		openGraph: {
			title: t("title", { productName }),
			description: product.description as string,
			images: product.images.map((image) => ({ url: image })),
			url: `https://fortetfier.com/product/${product.metadata.slug}`,
		},
		robots: {
			index: true,
			follow: true,
		},
		twitter: {
			card: "summary_large_image",
			title: t("title", { productName }),
			description: product.description as string,
			images: product.images.map((image) => ({ url: image })),
		},
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; image?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const variants = await Commerce.productGet({ slug: params.slug });
	const selectedVariant = (variants.length > 1 && searchParams.variant) || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.metadata.category;
	const images = product.images;

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className="inline-flex min-h-12 min-w-12 items-center justify-center">
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink className="inline-flex min-h-12 min-w-12 items-center justify-center" asChild>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
					{selectedVariant && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{deslugify(selectedVariant)}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<StickyBottom product={product} locale={locale}>
				<div className="mt-4 grid gap-4 lg:grid-cols-12">
					<div className="lg:col-span-5 lg:col-start-8">
						<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{product.name}</h1>
						{product.default_price.unit_amount && (
							<div className="flex items-baseline space-x-4 my-4">
								<span className="text-3xl font-bold text-gray-900">
									{formatMoney({
										amount: product.default_price.unit_amount,
										currency: product.default_price.currency,
										locale,
									})}
								</span>
								<span className="ml-2 text-lg font-medium text-gray-500 line-through">
									{formatMoney({
										amount: Number.parseInt(
											Math.round(
												product.default_price.unit_amount *
													discountPercentageToApply[product.metadata.category as Category],
											).toString(),
										),
										currency: product.default_price.currency,
										locale,
									})}
								</span>
							</div>
						)}
						<div className="mt-2">
							{product.metadata.stock <= 0 ? (
								<Badge variant="secondary" className="text-sm">
									En rupture de stock
								</Badge>
							) : (
								<Badge variant="secondary" className="text-sm">
									En stock
								</Badge>
							)}
						</div>
					</div>

					<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
						<h2 className="sr-only">{t("imagesTitle")}</h2>

						<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
							{/* {product.metadata.preview && (
								<ProductModel3D model3d={product.metadata.preview} imageSrc={product.images[0]} />
							)} */}
							{images.map((image, idx) => {
								const params = new URLSearchParams({
									image: idx.toString(),
								});
								if (searchParams.variant) {
									params.set("variant", searchParams.variant);
								}
								return (
									<YnsLink key={idx} href={`?${params}`} scroll={false}>
										{idx === 0 && !product.metadata.preview ? (
											<MainProductImage
												key={image}
												className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
												src={image}
												loading="eager"
												priority
												alt=""
											/>
										) : (
											<Image
												key={image}
												className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
												src={image}
												width={700 / 3}
												height={700 / 3}
												sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
												loading="eager"
												priority
												alt=""
											/>
										)}
									</YnsLink>
								);
							})}
						</div>
					</div>

					<div className="grid gap-8 lg:col-span-5">
						<section>
							<h2 className="sr-only">{t("descriptionTitle")}</h2>
							<div className="prose text-secondary-foreground">
								<Markdown source={product.description || ""} />
							</div>
						</section>

						{variants.length > 1 && (
							<div className="grid gap-2">
								<p className="text-base font-medium" id="variant-label">
									{t("variantTitle")}
								</p>
								<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
									{variants.map((variant) => {
										const isSelected = selectedVariant === variant.metadata.variant;
										return (
											variant.metadata.variant && (
												<li key={variant.id}>
													<YnsLink
														scroll={false}
														prefetch={true}
														href={`/product/${variant.metadata.slug}?variant=${variant.metadata.variant}`}
														className={cn(
															"flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-neutral-100",
															isSelected && "border-black bg-neutral-50 font-medium",
														)}
														aria-selected={isSelected}
													>
														{deslugify(variant.metadata.variant)}
													</YnsLink>
												</li>
											)
										);
									})}
								</ul>
							</div>
						)}

						<AddToCartButton productId={product.id} disabled={product.metadata.stock <= 0} />
					</div>
				</div>
			</StickyBottom>

			<Suspense>
				<SimilarProducts id={product.id} />
			</Suspense>

			<Suspense>
				<ProductImageModal images={images} />
			</Suspense>

			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	const products = await getRecommendedProducts({ productId: id, limit: 4 });

	if (!products) {
		return null;
	}

	return (
		<section className="py-12">
			<div className="mb-8">
				<h2 className="text-2xl font-bold tracking-tight">Vous pouvez aussi aimer</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => {
					const trieveMetadata = product.metadata as TrieveProductMetadata;
					return (
						<div key={product.tracking_id} className="bg-card rounded overflow-hidden shadow-sm group">
							{trieveMetadata.image_url && (
								<YnsLink href={`${publicUrl}${product.link}`} className="block" prefetch={false}>
									<Image
										className={
											"w-full rounded-lg bg-neutral-100 object-cover object-center group-hover:opacity-80 transition-opacity"
										}
										src={trieveMetadata.image_url}
										width={300}
										height={300}
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
										alt=""
									/>
								</YnsLink>
							)}
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">
									<YnsLink href={product.link || "#"} className="hover:text-primary" prefetch={false}>
										{trieveMetadata.name}
									</YnsLink>
								</h3>
								<div className="flex items-center justify-between">
									<span>
										{formatMoney({
											amount: trieveMetadata.amount,
											currency: trieveMetadata.currency,
										})}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

const discountPercentageToApply = {
	heritage: 1.167,
	memoires: 1.5,
	essentiels: 1.25,
} as const;

type Category = keyof typeof discountPercentageToApply;
