"use client";

import { YnsLink } from "@/ui/yns-link";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { signIn } from "next-auth/react";
// import { useLocale, useTranslations } from "next-intl";
// import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
// import Link from "next/link";
// import { getTranslations } from "@/i18n/server";

// type Inputs = {
//   email: string;
//   password: string;
// };

export function AuthModal() {
	//   const locale = useLocale();
	//   const t = getTranslations("Global.authModal");
	return (
		<YnsLink href={`/login`}>
			<UserIcon className="hover:text-neutral-500" />
		</YnsLink>
	);
}
