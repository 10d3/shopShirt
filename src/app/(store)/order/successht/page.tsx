import { Badge } from "@/components/ui/badge";
import { getLocale, getTranslations } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import type { ComponentProps } from "react";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/order.metadata");
	return {
		title: t("title"),
	};
};

export default async function OrderDetailsPage({ searchParams }: { searchParams: { order_id?: string } }) {
	const search = await searchParams;
	if (!search.order_id) {
		return <div>Invalid order ID</div>;
	}

	const order = await prisma.order.findUnique({
		where: { id: search.order_id },
		include: {
			items: true,
			verification: true,
			user: true,
		},
	});

	if (!order) {
		return <div>Order not found</div>;
	}

	const t = await getTranslations("/order.page");
	const locale = await getLocale();

	return (
		<article className="max-w-3xl pb-32">
			<h1 className="mt-4 inline-flex items-center text-3xl font-bold leading-none tracking-tight">
				{t("title")}
				<OrderStatus status={order.status} />
			</h1>
			<p className="mt-2">{t("description")}</p>
			<dl className="mt-12 space-y-2 text-sm">
				<dt className="font-semibold text-foreground">{t("orderNumberTitle")}</dt>
				<dd className="text-accent-foreground">{order.id.slice(-8)}</dd>
			</dl>

			<h2 className="sr-only">{t("productsTitle")}</h2>
			<ul role="list" className="my-8 divide-y border-y">
				{order.items.map((item) => (
					<li key={item.id} className="py-8">
						<article className="grid grid-cols-[auto_1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
							<h3 className="row-start-1 font-semibold leading-none text-neutral-700">{item.productName}</h3>
							{item.productImage && (
								<Image
									className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 rounded-lg object-cover object-center transition-opacity sm:mt-0 sm:w-32"
									src={item.productImage}
									width={128}
									height={128}
									alt={item.productName}
								/>
							)}
							<div className="prose row-start-2 text-secondary-foreground">{item.productDescription}</div>
							<footer className="row-start-3 mt-2 self-end">
								<dl className="grid grid-cols-[max-content_auto] gap-2 sm:grid-cols-3">
									<div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
										<dt className="text-sm font-semibold text-foreground">{t("price")}</dt>
										<dd className="text-sm text-accent-foreground">
											{formatMoney({
												amount: item.price.toNumber(),
												currency: "USD",
												locale,
											})}
										</dd>
									</div>

									<div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
										<dt className="text-sm font-semibold text-foreground">{t("quantity")}</dt>
										<dd className="text-sm text-accent-foreground">{item.quantity}</dd>
									</div>

									<div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
										<dt className="text-sm font-semibold text-foreground">{t("total")}</dt>
										<dd className="text-sm text-accent-foreground">
											{formatMoney({
												amount: item.price.toNumber() * item.quantity,
												currency: "USD",
												locale,
											})}
										</dd>
									</div>
								</dl>
							</footer>
						</article>
					</li>
				))}
			</ul>

			<div className="pl-20 sm:pl-40">
				<div className="grid gap-8 sm:grid-cols-2">
					{order.verification && (
						<div className="border-t pt-8 sm:col-span-2">
							<h3 className="font-semibold leading-none text-neutral-700">{t("paymentMethod")}</h3>
							<p className="mt-3 text-sm capitalize">{order.verification.paymentMethod}</p>
							<p className="mt-1.5 text-sm">Transaction ID: {order.verification.txd}</p>
						</div>
					)}

					<div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
						<h3 className="font-semibold leading-none text-neutral-700">{t("total")}</h3>
						<p>
							{formatMoney({
								amount: order.totalAmount.toNumber(),
								currency: "USD",
								locale,
							})}
						</p>
					</div>
				</div>
			</div>
		</article>
	);
}

const OrderStatus = async ({ status }: { status: string }) => {
	// const t = await getTranslations("/order.status");
	const statusToVariant = {
		pending: "secondary",
		processing: "secondary",
		completed: "default",
		canceled: "destructive",
	} satisfies Record<string, ComponentProps<typeof Badge>["variant"]>;

	return (
		<Badge
			className="ml-2 capitalize"
			variant={statusToVariant[status as keyof typeof statusToVariant] || "default"}
		>
			{status}
			{/* {t("status")} */}
		</Badge>
	);
};
