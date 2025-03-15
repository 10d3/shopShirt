import { prisma } from "@/lib/prisma";

export async function getVerficationCode() {
	try {
		const verifications = await prisma.verification.findMany();
		return verifications;
	} catch (error) {
		console.error(error);
	}
}
