import { env } from "@/env.mjs";
import * as Commerce from "commerce-kit";
import { Resend } from "resend";

export const stripe = Commerce.provider({
	secretKey: env.STRIPE_SECRET_KEY,
	tagPrefix: undefined,
});

export default stripe;

//fetch stripe products

export async function getStripeProducts() {
	return stripe.products.list({
		limit: 100,
	});
}

export const resend = new Resend(env.RESEND_API_KEY);
