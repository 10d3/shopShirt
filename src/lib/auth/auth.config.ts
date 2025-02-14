import { sendVerificationRequest } from "@/lib/auth/sendVerificationRequest";
import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export default {
	providers: [
		Google,
		Github,
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: "Fort&Fier <info@fortetfier.com>",
			sendVerificationRequest,
		}),
	],
	pages: { verifyRequest: "/login/verify-request" },
	trustHost: true,
} satisfies NextAuthConfig;
