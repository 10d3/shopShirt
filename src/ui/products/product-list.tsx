import { getLocale } from "@/i18n/server";
import { formatMoney } from "@/lib/utils";
import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { YnsLink } from "@/ui/yns-link";
import type * as Commerce from "commerce-kit";
import Image from "next/image";
import { Suspense } from "react";
// import { SkeletonLoader } from "./skeleton-loader"

export const ProductList = async ({ products }: { products: Commerce.MappedProduct[] }) => {
	const locale = await getLocale();

	return (
		<>
			<ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<Suspense fallback={[...Array(8)].map((_, i) => <li key={i}>{/* <SkeletonLoader /> */}</li>)}>
					{products.map((product, idx) => (
						<li key={product.id} className="group">
							<YnsLink href={`/product/${product.metadata.slug}`}>
								<article className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
									{product.images[0] && (
										<div className="aspect-square w-full overflow-hidden bg-gray-100">
											<Image
												className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
												src={product.images[0] || "/placeholder.svg"}
												width={500}
												height={500}
												loading={idx < 4 ? "eager" : "lazy"}
												priority={idx < 4}
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
												alt={product.name}
											/>
										</div>
									)}
									<div className="p-4">
										<h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
										{product.default_price.unit_amount && (
											<p className="text-xl font-bold text-gray-900">
												{formatMoney({
													amount: product.default_price.unit_amount,
													currency: product.default_price.currency,
													locale,
												})}
											</p>
										)}
										{/* {product.metadata.isNew && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    )} */}
									</div>
								</article>
							</YnsLink>
						</li>
					))}
				</Suspense>
			</ul>
			<JsonLd jsonLd={mappedProductsToJsonLd(products)} />
		</>
	);
};
