import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { getTranslations } from "@/i18n/server";
import { CheckoutCard } from "@/ui/checkout/checkout-card";
import { CheckoutLocal } from "@/ui/checkout/checkout-local";
import { headers } from "next/headers";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/cart.metadata");
	return {
		title: t("title"),
	};
};

export default async function CartPage() {
	const cart = await getCartFromCookiesAction();
	const headersList = await headers();

	console.log("Cart from CartPage", cart);

	// Get country code from Vercel's edge headers
	const countryCode = headersList.get("x-vercel-ip-country") || "US";

	if (!cart) {
		return null;
	}

	// Determine which checkout to show based on country code
	const isLocalCheckout = countryCode === "US"; // HT is Haiti's country code

	return <>{isLocalCheckout ? <CheckoutLocal cart={cart} /> : <CheckoutCard cart={cart} />}</>;
}
