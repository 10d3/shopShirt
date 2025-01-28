"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/lib/auth/auth.action";
import { YnsLink } from "@/ui/yns-link";
import { LogOut, ShoppingBasket } from "lucide-react";
import type { PropsWithChildren } from "react";

export type SignOutButtonProps = PropsWithChildren;

export const SignOutButton = (props: SignOutButtonProps) => {
	const handleSignOut = async () => {
		// Optionally show a loading state or confirmation dialog here
		await signOutAction();
		// Optionally show a success message or redirect
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="hover:cursor-pointer" asChild>
				{props.children}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-white shadow-lg rounded-md">
				<DropdownMenuLabel className="font-semibold text-gray-800">My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<YnsLink
						href="/home/profile"
						className="flex flex-row gap-2 items-center hover:bg-gray-100 p-2 rounded-md transition-colors"
					>
						<ShoppingBasket className="size-4" />
						<span>Orders</span>
					</YnsLink>
				</DropdownMenuItem>
				{/* Uncomment and enhance as needed */}
				{/* <DropdownMenuItem>
					<Link className="flex flex-row gap-2 items-center hover:bg-gray-100 p-2 rounded-md transition-colors" href="/home/profile">
						<DollarSign size={15} /> Billing
					</Link>
				</DropdownMenuItem> */}
				{/* <DropdownMenuItem>Team</DropdownMenuItem> */}
				{/* <DropdownMenuItem>
					<Link className="flex flex-row gap-2 items-center hover:bg-gray-100 p-2 rounded-md transition-colors" href="/home/settings">
						<Settings size={15} />
						Settings
					</Link>
				</DropdownMenuItem> */}
				<DropdownMenuItem
					onClick={handleSignOut}
					className="text-red-600 hover:bg-red-100 p-2 rounded-md transition-colors cursor-pointer"
					aria-label="Sign Out"
				>
					<LogOut size={15} className="mr-2" />
					<span>Sign Out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
