"use client";

import { clearCartCookieAction } from "@/actions/cart-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/lib/actions/order";
import { calculateCartTotalPossiblyWithTax, getFee, pointDeRelais } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/ui/shadcn/select";
// import { SelectContent, SelectLabel, SelectValue } from "@radix-ui/react-select";
import type * as Commerce from "commerce-kit";
import { CreditCard, Loader2, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useActionState } from "react";

const EXCHANGE_RATE = 132; // HTG to USD

export const CheckoutLocal = ({ cart }: { cart: Commerce.Cart }) => {
	const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
	// const [amountUTGN, setAmount] = useState(Math.round((cart.cart.amount * EXCHANGE_RATE) / 100));
	// const amountUTGN = Math.round(amount);

	const total = calculateCartTotalPossiblyWithTax(cart);
	// setAmount(Math.round((total * EXCHANGE_RATE) / 100));
	console.log("Total : ", total);
	const fee = getFee(total) ?? 0;
	const amountUTGN = Math.round((total * EXCHANGE_RATE) / 100 + fee);

	// useEffect(() => {
	// 	async function test() {
	// 		const cart = await getCartFromCookiesAction();
	// 		if (!cart) return;
	// 		setAmount(Math.round((cart.cart.amount * EXCHANGE_RATE) / 100));
	// 	}
	// 	// const cart = await getCartFromCookiesAction();
	// 	// setAmount(Math.round((cart.cart.amount * EXCHANGE_RATE) / 100));
	// 	test();
	// }, [cart.cart.amount]);

	console.log("Amount : ", cart.cart.amount);

	// console.log(amountUTGN);
	console.log("Details : ", amountUTGN);

	const router = useRouter();

	async function verifyPayment(prevState: unknown, formData: FormData) {
		const transactionId = formData.get("transactionId") as string;
		const senderNum = formData.get("senderNum") as string;
		const relais = formData.get("pointRelais") as string;
		console.log(transactionId, senderNum, relais);

		try {
			const response = await fetch("/api/verify-payment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					txd: transactionId,
					amount: amountUTGN.toString(),
					sender: senderNum,
				}),
			});

			if (!response.ok) throw new Error("Network response was not ok");

			const data = (await response.json()) as { isVerified: boolean; verificationId: string };
			setPaymentStatus(data.isVerified ? "success" : "error");
			const dataFromFormData = {
				txd: transactionId,
				amount: amountUTGN.toString(),
				phone: senderNum,
				pointRelais: relais,
				status: paymentStatus,
				verificationId: data.verificationId,
			};
			// return data.isVerified;
			if (data.isVerified) {
				await clearCartCookieAction();
				const test = transformOrderDataToPrisma({ cart, data: dataFromFormData });
				const order = await createOrder(test);
				if (!order) {
					return false;
				}
				console.log(test);
				router.push("/order/successht?order_id=" + order.id);
			}
		} catch (error) {
			console.error("Payment verification failed:", error);
			setPaymentStatus("error");
			return false;
		}
	}

	const [isPending, formAction] = useActionState(verifyPayment, null);

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">Paiement</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="bg-primary/10 p-4 rounded-md">
					<p className="text-sm font-medium mb-2">Montant à payer:</p>
					<p className="text-3xl font-bold text-primary">{amountUTGN} HTG</p>
				</div>

				<div className="space-y-2">
					<p className="font-medium">Instructions de paiement:</p>
					<ol className="list-decimal list-inside space-y-1 text-sm">
						<li>Composez le code USSD suivant sur votre téléphone</li>
						<li>Suivez les instructions à l'écran pour effectuer le paiement</li>
						<li>Notez le TransactionId fourni après le paiement</li>
					</ol>
				</div>

				<div className="bg-muted p-4 rounded-md">
					<p className="font-mono md:text-lg text-[1rem] font-bold">{`*202*509XXXXXXXX*${amountUTGN}*codeSecert#`}</p>
				</div>

				{paymentStatus !== "idle" && (
					<Alert variant={paymentStatus === "success" ? "default" : "destructive"}>
						<AlertTitle>{paymentStatus === "success" ? "Succès" : "Erreur"}</AlertTitle>
						<AlertDescription>
							{paymentStatus === "success"
								? "Votre paiement a été effectué avec succès."
								: "Votre paiement n'a pas été effectué. Veuillez réessayer."}
						</AlertDescription>
					</Alert>
				)}

				<form action={formAction} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="transactionId" className="flex items-center space-x-2">
							<CreditCard className="w-4 h-4" />
							<span>TransactionId</span>
						</Label>
						<Input
							type="text"
							id="transactionId"
							name="transactionId"
							placeholder="Entrez le TransactionId"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="senderNum" className="flex items-center space-x-2">
							<Phone className="w-4 h-4" />
							<span>Numéro de téléphone</span>
						</Label>
						<Input
							type="tel"
							id="senderNum"
							name="senderNum"
							placeholder="509XXXXXXX"
							pattern="509[0-9]{8}"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="pointRelais" className="flex items-center space-x-2">
							<MapPin className="w-4 h-4" />
							<span>Point de relais</span>
						</Label>
						<Select defaultValue="1" name="pointRelais" required>
							<SelectTrigger>
								<SelectValue placeholder={"Choisir un point de relais"} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Choisir un point de relais</SelectLabel>
									{pointDeRelais.map((relais, i) => (
										<SelectItem key={i} value={relais.value}>
											{relais.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<Button type="submit" className="w-full" disabled={isPending as boolean}>
						{isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Vérification du paiement...
							</>
						) : (
							"Vérifier le paiement"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export function transformOrderDataToPrisma({
	cart,
	data,
}: {
	cart: Commerce.Cart; // Updated to use the correct input type
	data: {
		phone: string;
		status: string;
		verificationId: string;
		pointRelais: string;
	};
}) {
	return {
		//   userId: data.userId, // Ensure userId is included
		pointRelais: data.pointRelais,
		phone: data.phone,
		status: data.status,
		verificationId: data.verificationId, // Include verificationId
		totalAmount: cart.cart.amount,
		items: cart.lines.map((item) => ({
			productId: item.product.id,
			productImage: item.product.images[0],
			productName: item.product.name,
			quantity: item.quantity,
			price: item.product.default_price.unit_amount ?? 0,
			digitalAssetUrl: item.product.metadata.digitalAsset,
		})),
	};
}
