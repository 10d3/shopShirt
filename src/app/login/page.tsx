import { LoginForm } from "@/ui/login-form";
// import { ShirtIcon } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					{/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<ShirtIcon className="size-4" />
					</div> */}
					{/* ACME Inc. */}
					<Image src="/logo.png" alt="Logo" width={100} height={100} />
				</a>
				<LoginForm />
			</div>
		</div>
	);
}
