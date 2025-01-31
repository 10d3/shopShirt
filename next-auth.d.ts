// types/next-auth.d.ts

import type { DefaultUser } from "next-auth";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: string;
	}

	interface Session {
		user: User & {
			id: string;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
	}
}
