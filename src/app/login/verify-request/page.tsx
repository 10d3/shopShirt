"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/ui/shadcn/hooks/use-toast";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerifyRequest() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState<string>("");
	const [countdown, setCountdown] = useState(60);
	const toast = useToast();

	useEffect(() => {
		const emailParam = searchParams.get("email");
		if (emailParam) {
			setEmail(decodeURIComponent(emailParam));
		}

		// Countdown timer
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [searchParams, countdown]);

	const handleResendEmail = async () => {
		try {
			setCountdown(60);
			await fetch("/api/auth/resend-verification", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			toast.toast({
				title: "Email envoyé",
				description: "Un nouveau lien de vérification a été envoyé à votre adresse email.",
			});
		} catch (error) {
			console.error("Failed to resend verification email:", error);
			toast.toast({
				title: "Erreur",
				description: "Impossible d'envoyer l'email de vérification. Veuillez réessayer plus tard.",
				variant: "destructive",
			});
		}
	};

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
				<div className="w-full max-w-md space-y-8">
					<div className="flex justify-center">
						<Image
							className="w-auto h-12 transition-transform duration-300 ease-in-out hover:scale-110"
							src="/logo.png"
							height={1000}
							width={1000}
							alt="logo of fortetfier"
						/>
					</div>

					<Card className="w-full shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
						<CardHeader>
							<div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full transition-transform duration-300 ease-in-out hover:scale-110">
								<Mail className="w-8 h-8 text-primary" />
							</div>
							<CardTitle className="text-center mt-4 text-2xl font-bold">Vérifiez votre email</CardTitle>
							<CardDescription className="text-center text-lg">
								Nous avons envoyé un lien de vérification à
								<span className="font-semibold block mt-1">{email || "votre adresse email"}</span>
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<Alert className="bg-primary/10 border-primary/20">
								<AlertDescription className="text-sm">
									Le lien dans l'email expirera après 24 heures. Si vous ne voyez pas l'email, vérifiez votre
									dossier de spam.
								</AlertDescription>
							</Alert>

							<div className="flex flex-col space-y-3">
								<Button
									variant="outline"
									className="w-full transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
									onClick={() => window.open("https://gmail.com", "_blank")}
								>
									Ouvrir Gmail
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="w-full transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
									onClick={() => window.open("https://outlook.com", "_blank")}
								>
									Ouvrir Outlook
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</CardContent>

						<CardFooter className="flex flex-col space-y-4">
							<div className="text-sm text-center text-muted-foreground">Vous n'avez pas reçu l'email ?</div>
							<Button
								variant="ghost"
								className="w-full transition-all duration-300 ease-in-out hover:bg-primary/10"
								onClick={handleResendEmail}
								disabled={countdown > 0}
							>
								{countdown > 0 ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Renvoyer dans {countdown}s
									</>
								) : (
									"Renvoyer l'email de vérification"
								)}
							</Button>
						</CardFooter>
					</Card>

					<div className="text-center">
						<Button
							variant="link"
							className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out hover:text-primary"
							onClick={() => router.push("/")}
						>
							Utiliser une autre adresse email
						</Button>
					</div>
				</div>
			</div>
		</Suspense>
	);
}
