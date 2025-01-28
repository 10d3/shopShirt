import { LoggedInButton } from "@/ui/auth/LoggedInButton";
import { CartSummaryNav } from "@/ui/nav/cart-summary-nav";
import { NavMenu } from "@/ui/nav/nav-menu";
import { SearchNav } from "@/ui/nav/search-nav";
// import { SeoH1 } from "@/ui/seo-h1";
import { YnsLink } from "@/ui/yns-link";
// import { UserIcon } from "lucide-react";
import Image from "next/image";

export const Nav = async () => {
	return (
		<header className="z-50 py-4 sticky top-0 bg-white/90 backdrop-blur-xs nav-border-reveal">
			<div className="mx-auto flex max-w-7xl items-center gap-2 px-4 flex-row sm:px-6 lg:px-8">
				<YnsLink href="/">
					{/* <SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">Your Next Store</SeoH1> */}
					<Image className="w-[11rem]" src="/logo.png" alt="Your Next Store" width={100} height={100} />
				</YnsLink>

				<div className="max-w-full flex shrink w-auto sm:mr-auto overflow-auto max-sm:order-2">
					<NavMenu />
				</div>
				<div className="mr-3 ml-auto sm:ml-0">
					<SearchNav />
				</div>
				<CartSummaryNav />
				{/* <YnsLink href="/login">
					<UserIcon className="hover:text-neutral-500" />
				</YnsLink> */}
				<LoggedInButton />
			</div>
		</header>
	);
};
