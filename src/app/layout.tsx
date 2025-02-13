import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { env, publicUrl } from "@/env.mjs";
import { IntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("Global.metadata");
	return {
		title: t("title"),
		description: t("description"),
		metadataBase: new URL(publicUrl),
	};
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className="h-full antialiased">
			<body className="flex min-h-full flex-col">
				<SessionProvider>
					<IntlClientProvider messages={messages} locale={locale}>
						<div className="flex min-h-full flex-1 flex-col bg-white" vaul-drawer-wrapper="">
							{children}
						</div>
						<Toaster position="top-center" offset={10} />
					</IntlClientProvider>
				</SessionProvider>
				{env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						async
						src="/stats/script.js"
						data-host-url={publicUrl + "/stats"}
						data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					/>
				)}
				<Script
					defer
					data-domain="fortetfier.com"
					src="https://plausible.amherley.dev/js/script.hash.outbound-links.pageview-props.tagged-events.js"
				/>
				<Script id="plausible-script">
					{`
            window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments)
            }
          `}
				</Script>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
