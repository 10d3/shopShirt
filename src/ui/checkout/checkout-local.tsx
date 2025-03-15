"use client";

import { clearCartCookieAction } from "@/actions/cart-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/lib/actions/order";
import { calculateCartTotalPossiblyWithTax, getFee, pointDeRelais } from "@/lib/utils";
import type * as Commerce from "commerce-kit";
import {
	AlertCircle,
	ArrowRight,
	CheckCircle2,
	Copy,
	CreditCard,
	Loader2,
	MapPin,
	Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useActionState } from "react";

const EXCHANGE_RATE = 136.5; // HTG to USD

export const CheckoutLocal = ({ cart }: { cart: Commerce.Cart }) => {
	const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
	const [copiedText, setCopiedText] = useState<string | null>(null);

	const total = calculateCartTotalPossiblyWithTax(cart);
	const fee = getFee(total) ?? 0;
	const amountUTGN = Math.round((total * EXCHANGE_RATE) / 100 + fee);

	const router = useRouter();

	const copyToClipboard = (text: string, type: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopiedText(type);
				setTimeout(() => setCopiedText(null), 2000);
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
			});
	};

	async function verifyPayment(prevState: unknown, formData: FormData) {
		const transactionId = formData.get("transactionId") as string;
		const senderNum = formData.get("senderNum") as string;
		const relais = formData.get("pointRelais") as string;

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

			const data = (await response.json()) as {
				isVerified: boolean;
				verificationId: string;
			};
			setPaymentStatus(data.isVerified ? "success" : "error");
			const dataFromFormData = {
				txd: transactionId,
				amount: amountUTGN.toString(),
				phone: senderNum,
				pointRelais: relais,
				status: paymentStatus,
				verificationId: data.verificationId,
			};

			if (data.isVerified) {
				await clearCartCookieAction();
				const orderData = transformOrderDataToPrisma({
					cart,
					data: dataFromFormData,
				});
				const order = await createOrder(orderData);
				if (!order) {
					return false;
				}
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
		<div className="max-w-md mx-auto">
			<Card className="border-none shadow-lg">
				<CardHeader className="bg-gradient-to-r from-primary/90 to-primary text-white rounded-t-lg">
					<CardTitle className="text-2xl font-bold flex items-center justify-between">
						Finaliser votre commande
						<Badge variant="secondary" className="text-primary bg-white">
							{amountUTGN} HTG
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					<div className="rounded-lg bg-muted p-4 border border-muted-foreground/20">
						<h3 className="font-medium text-lg mb-3 flex items-center">
							<span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
								1
							</span>
							Instructions de paiement
						</h3>
						<ol className="list-decimal list-inside space-y-2 text-sm pl-8">
							<li>Composez le code USSD suivant sur votre téléphone</li>
							<li>Suivez les instructions à l'écran pour effectuer le paiement</li>
							<li>Notez le TransactionId fourni après le paiement</li>
						</ol>
					</div>

					<div className="space-y-3">
						<h3 className="font-medium text-lg flex items-center">
							<span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
								2
							</span>
							Codes de paiement
						</h3>

						<div className="space-y-3">
							<div className="bg-primary/5 p-4 rounded-lg border border-primary/20 relative">
								<div className="flex justify-between items-center">
									<div>
										<span className="text-xs font-semibold text-primary/70 uppercase block mb-1">
											NatCash
										</span>
										<code className="font-mono text-sm md:text-base font-medium">
											*202*50932784343*{amountUTGN}*codeSecert#
										</code>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1"
										onClick={() => copyToClipboard(`*202*50932784343*${amountUTGN}*code secret#`, "natcash")}
									>
										{copiedText === "natcash" ? (
											<CheckCircle2 className="w-4 h-4" />
										) : (
											<Copy className="w-4 h-4" />
										)}
										{copiedText === "natcash" ? "Copié" : "Copier"}
									</Button>
								</div>
							</div>

							<div className="bg-primary/5 p-4 rounded-lg border border-primary/20 relative">
								<div className="flex justify-between items-center">
									<div>
										<span className="text-xs font-semibold text-primary/70 uppercase block mb-1">
											MonCash
										</span>
										<code className="font-mono text-sm md:text-base font-medium">
											*202*5093166230*{amountUTGN}*codeSecert#
										</code>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="h-8 gap-1"
										onClick={() => copyToClipboard(`*202*5093166230*${amountUTGN}*code secret#`, "moncash")}
									>
										{copiedText === "moncash" ? (
											<CheckCircle2 className="w-4 h-4" />
										) : (
											<Copy className="w-4 h-4" />
										)}
										{copiedText === "moncash" ? "Copié" : "Copier"}
									</Button>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{paymentStatus !== "idle" && (
						<Alert
							variant={paymentStatus === "success" ? "default" : "destructive"}
							className="animate-in fade-in-50"
						>
							{paymentStatus === "success" ? (
								<CheckCircle2 className="h-4 w-4" />
							) : (
								<AlertCircle className="h-4 w-4" />
							)}
							<AlertTitle>{paymentStatus === "success" ? "Paiement réussi" : "Échec du paiement"}</AlertTitle>
							<AlertDescription>
								{paymentStatus === "success"
									? "Votre paiement a été effectué avec succès."
									: "Votre paiement n'a pas été vérifié. Veuillez vérifier les informations et réessayer."}
							</AlertDescription>
						</Alert>
					)}

					<div>
						<h3 className="font-medium text-lg mb-4 flex items-center">
							<span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
								3
							</span>
							Vérification du paiement
						</h3>

						<form action={formAction} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="transactionId" className="text-sm font-medium flex items-center gap-2">
									<CreditCard className="w-4 h-4 text-primary" />
									TransactionId
								</Label>
								<Input
									type="text"
									id="transactionId"
									name="transactionId"
									placeholder="Entrez le TransactionId"
									className="border-input/50 focus:border-primary"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="senderNum" className="text-sm font-medium flex items-center gap-2">
									<Phone className="w-4 h-4 text-primary" />
									Numéro de téléphone
								</Label>
								<Input
									type="tel"
									id="senderNum"
									name="senderNum"
									placeholder="509XXXXXXX"
									pattern="509[0-9]{8}"
									className="border-input/50 focus:border-primary"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="pointRelais" className="text-sm font-medium flex items-center gap-2">
									<MapPin className="w-4 h-4 text-primary" />
									Point de relais
								</Label>
								<Select name="pointRelais" required>
									<SelectTrigger className="border-input/50 focus:border-primary">
										<SelectValue placeholder="Choisir un point de relais" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Points de relais disponibles</SelectLabel>
											{pointDeRelais.map((relais, i) => (
												<SelectItem key={i} value={relais.value}>
													{relais.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<Button type="submit" className="w-full gap-2 mt-2" disabled={isPending as boolean}>
								{isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Vérification en cours...
									</>
								) : (
									<>
										Vérifier et finaliser
										<ArrowRight className="h-4 w-4" />
									</>
								)}
							</Button>
						</form>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export function transformOrderDataToPrisma({
	cart,
	data,
}: {
	cart: Commerce.Cart;
	data: {
		phone: string;
		status: string;
		verificationId: string;
		pointRelais: string;
	};
}) {
	return {
		pointRelais: data.pointRelais,
		phone: data.phone,
		status: data.status,
		verificationId: data.verificationId,
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
