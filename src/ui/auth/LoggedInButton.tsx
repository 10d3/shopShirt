// import SignInButton from './SignInButton'
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { AuthModal } from "@/ui/auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/avatar";
import React from "react";
import { SignOutButton } from "./SignOutButton";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const LoggedInButton = async () => {
	const user = await auth();

	if (!user) {
		// return <LoginButton />
		return <AuthModal />;
	}
	return (
		<SignOutButton>
			<Button variant="outline" size="sm" className="p-2 py-2">
				<Avatar className="size-8">
					<AvatarFallback>{user.user?.name?.[0]}</AvatarFallback>
					{user.user?.image ? (
						<AvatarImage src={user.user.image} alt={`${user.user.name ?? "-"}'s profile pic`} />
					) : null}
				</Avatar>
			</Button>
		</SignOutButton>
	);
};
