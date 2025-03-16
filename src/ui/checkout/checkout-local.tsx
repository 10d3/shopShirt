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
	Receipt,
	Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useActionState } from "react";

const EXCHANGE_RATE = 136.5; // HTG to USD

export const CheckoutLocal = ({ cart }: { cart: Commerce.Cart }) => {
	const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
	const [copiedText, setCopiedText] = useState<string | null>(null);
	const [activeStep, setActiveStep] = useState<number>(1);

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
			<Card className="border-none shadow-xl overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-primary/90 to-primary text-white py-6">
					<CardTitle className="text-2xl font-bold flex items-center justify-between">
						<span className="flex items-center gap-2">
							<Receipt className="h-6 w-6" />
							Finaliser votre commande
						</span>
						<Badge variant="secondary" className="text-primary bg-white font-bold px-3 py-1.5">
							{amountUTGN} HTG
						</Badge>
					</CardTitle>
				</CardHeader>

				{/* Progress Steps */}
				<div className="flex justify-between px-6 -mt-3 relative z-10">
					<div className="w-full flex justify-between items-center">
						{[1, 2, 3].map((step) => (
							<div
								key={step}
								className={`flex flex-col items-center ${step < 3 ? "w-1/3" : ""}`}
								onClick={() => setActiveStep(step)}
							>
								<div
									className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
											activeStep >= step
												? "bg-primary text-white shadow-lg shadow-primary/30"
												: "bg-muted text-muted-foreground"
										}`}
								>
									{step}
								</div>
								<div
									className={`h-1 ${step < 3 ? "w-full" : "w-0"} ${activeStep > step ? "bg-primary" : "bg-muted"} mt-2`}
								/>
							</div>
						))}
					</div>
				</div>

				<CardContent className="pt-8 pb-6 px-6 space-y-6">
					{/* Step 1: Instructions */}
					<div className={`space-y-4 transition-all duration-300 ${activeStep === 1 ? "block" : "hidden"}`}>
						<h3 className="font-semibold text-xl mb-3 flex items-center gap-2 text-primary">
							<Smartphone className="w-5 h-5" />
							Instructions de paiement
						</h3>

						<div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-5 border border-primary/20">
							<ol className="list-decimal list-inside space-y-3 text-sm pl-1">
								<li className="pb-2 border-b border-primary/10">
									<span className="font-medium">Composez le code USSD</span> sur votre téléphone
								</li>
								<li className="pb-2 border-b border-primary/10">
									<span className="font-medium">Suivez les instructions à l'écran</span> pour effectuer le
									paiement
								</li>
								<li>
									<span className="font-medium">Notez le TransactionId</span> fourni après le paiement
								</li>
							</ol>
						</div>

						<Button className="w-full mt-4" onClick={() => setActiveStep(2)}>
							Continuer
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					{/* Step 2: Payment Codes */}
					<div className={`space-y-4 transition-all duration-300 ${activeStep === 2 ? "block" : "hidden"}`}>
						<h3 className="font-semibold text-xl mb-3 flex items-center gap-2 text-primary">
							<CreditCard className="w-5 h-5" />
							Codes de paiement
						</h3>

						<div className="space-y-4">
							<div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20 relative">
								<div className="flex flex-col gap-3">
									<div className="flex justify-between items-center">
										<span className="text-sm font-bold text-primary uppercase tracking-wider">NatCash</span>
										<Button
											variant="outline"
											size="sm"
											className="h-8 gap-1 border-primary/30 hover:bg-primary/10"
											onClick={() => copyToClipboard(`50932784343`, "natcash")}
										>
											{copiedText === "natcash" ? (
												<CheckCircle2 className="w-4 h-4 text-green-500" />
											) : (
												<Copy className="w-4 h-4" />
											)}
											{copiedText === "natcash" ? "Copié" : "Copier"}
										</Button>
									</div>
									<div className="bg-white/80 rounded-lg p-3 border border-primary/10">
										<code className="font-mono text-sm font-medium block space-y-1">
											<div>• *202#</div>
											<div>• Choisir 1. Transfert</div>
											<div>• Ensuite 1. Transfert</div>
											<div>
												• Ajouter le numéro: <span className="text-primary font-bold">50932784343</span>
											</div>
											<div>
												• Montant: <span className="text-primary font-bold">{amountUTGN}</span>
											</div>
											<div>• Contenu: "votre produit"</div>
											<div>• Ajouter votre code pin</div>
											<div>• Choisir 1 pour confirmer</div>
										</code>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20 relative">
								<div className="flex flex-col gap-3">
									<div className="flex justify-between items-center">
										<span className="text-sm font-bold text-primary uppercase tracking-wider">MonCash</span>
										<Button
											variant="outline"
											size="sm"
											className="h-8 gap-1 border-primary/30 hover:bg-primary/10"
											onClick={() => copyToClipboard(`*202*5093166230*${amountUTGN}*code secret#`, "moncash")}
										>
											{copiedText === "moncash" ? (
												<CheckCircle2 className="w-4 h-4 text-green-500" />
											) : (
												<Copy className="w-4 h-4" />
											)}
											{copiedText === "moncash" ? "Copié" : "Copier"}
										</Button>
									</div>
									<div className="bg-white/80 rounded-lg p-3 border border-primary/10">
										<code className="font-mono text-sm font-medium">
											*202*5093166230*{amountUTGN}*codeSecret#
										</code>
									</div>
								</div>
							</div>
						</div>

						<div className="flex gap-3 mt-4">
							<Button variant="outline" className="w-1/2" onClick={() => setActiveStep(1)}>
								Retour
							</Button>
							<Button className="w-1/2" onClick={() => setActiveStep(3)}>
								Continuer
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Step 3: Verification */}
					<div className={`space-y-4 transition-all duration-300 ${activeStep === 3 ? "block" : "hidden"}`}>
						<h3 className="font-semibold text-xl mb-3 flex items-center gap-2 text-primary">
							<CheckCircle2 className="w-5 h-5" />
							Vérification du paiement
						</h3>

						{paymentStatus !== "idle" && (
							<Alert
								variant={paymentStatus === "success" ? "default" : "destructive"}
								className="animate-in fade-in-50 border-2"
							>
								{paymentStatus === "success" ? (
									<CheckCircle2 className="h-4 w-4" />
								) : (
									<AlertCircle className="h-4 w-4" />
								)}
								<AlertTitle>
									{paymentStatus === "success" ? "Paiement réussi" : "Échec du paiement"}
								</AlertTitle>
								<AlertDescription>
									{paymentStatus === "success"
										? "Votre paiement a été effectué avec succès."
										: "Votre paiement n'a pas été vérifié. Veuillez vérifier les informations et réessayer."}
								</AlertDescription>
							</Alert>
						)}

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
									className="border-input/50 focus:border-primary focus:ring-primary/20"
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
									className="border-input/50 focus:border-primary focus:ring-primary/20"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="pointRelais" className="text-sm font-medium flex items-center gap-2">
									<MapPin className="w-4 h-4 text-primary" />
									Point de relais
								</Label>
								<Select name="pointRelais" required>
									<SelectTrigger className="border-input/50 focus:border-primary focus:ring-primary/20">
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

							<div className="flex gap-3 mt-6">
								<Button variant="outline" className="w-1/3" onClick={() => setActiveStep(2)} type="button">
									Retour
								</Button>
								<Button
									type="submit"
									className="w-2/3 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
									disabled={isPending as boolean}
								>
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
							</div>
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
