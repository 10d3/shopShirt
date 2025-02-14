"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { useState } from "react";

export default function VerifyRequest() {
	const router = useRouter();
	//   const searchParams = useSearchParams();
	//   const [email, setEmail] = useState<string>("");
	//   const [countdown, setCountdown] = useState(60);

	// useEffect(() => {
	//   const emailParam = searchParams.get('email');
	//   console.log(emailParam);
	//   if (emailParam) {
	//     setEmail(decodeURIComponent(emailParam));
	//   }

	//   // Countdown timer
	//   if (countdown > 0) {
	//     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
	//     return () => clearTimeout(timer);
	//   }
	// }, [searchParams, countdown]);

	// const handleResendEmail = async () => {
	//   try {
	//     // Reset countdown
	//     setCountdown(60);

	//     // Implement your resend logic here
	//     await fetch("/api/auth/resend-verification", {
	//       method: "POST",
	//       headers: {
	//         "Content-Type": "application/json",
	//       },
	//       body: JSON.stringify({ email }),
	//     });
	//   } catch (error) {
	//     console.error("Failed to resend verification email:", error);
	//   }
	// };

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				{/* Logo */}
				<div className="flex justify-center">
					<Image
						className="hidden w-auto h-10 dark:block "
						src="/logo.png"
						height={1000}
						width={1000}
						alt="logo of fortetfier"
					/>
					<Image
						className="block w-auto h-10 dark:hidden"
						src="/logo.png"
						height={1000}
						width={1000}
						alt="logo of sayit"
					/>
				</div>

				<Card className="w-full">
					<CardHeader>
						<div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-full">
							<Mail className="w-6 h-6 text-primary" />
						</div>
						<CardTitle className="text-center mt-4">Check your email</CardTitle>
						<CardDescription className="text-center">
							We&apos;ve sent a verification link to your email
							{/* <span className="font-semibold ">{email}</span> */}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						<Alert>
							<AlertDescription>
								The link in the email will expire after 24 hours. If you don&apos;t see the email, check your
								spam folder.
							</AlertDescription>
						</Alert>

						<div className="flex flex-col space-y-2">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => window.open("https://gmail.com", "_blank")}
							>
								Open Gmail
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => window.open("https://outlook.com", "_blank")}
							>
								Open Outlook
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</CardContent>

					{/* <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Didn&apos;t receive the email?
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleResendEmail}
              disabled={countdown > 0}
            >
              {countdown > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resend in {countdown}s
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          </CardFooter> */}
				</Card>

				<div className="text-center">
					<Button variant="link" className="text-sm text-muted-foreground" onClick={() => router.push("/")}>
						Use a different email address
					</Button>
				</div>
			</div>
		</div>
	);
}
