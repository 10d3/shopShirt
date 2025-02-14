import { resend } from "@/lib/actions/stripe";
import MagicLink from "@/ui/templatesEmails/MagicLink";

export async function sendVerificationRequest(params: {
	identifier: string;
	url: string;
	expires: Date;
	// provider: EmailConfig;
	token: string;
	// theme: Theme;
	request: Request;
}) {
	const { identifier: to, url } = params;

	const { host } = new URL(url);
	const res = await resend.emails.send({
		from: "Fort&Fier <info@fortetfier.com>",
		to,
		subject: `Sign in to ${host}`,
		react: MagicLink({ url, host }),
		text: text({ url, host }),
	});

	if (res.error) {
		throw new Error("Resend error: " + JSON.stringify(await res.error));
	}
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
export function text({ url, host }: { url: string; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`;
}
