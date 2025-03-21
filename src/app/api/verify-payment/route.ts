//we gonna make a post endpoind to verify a payment if the txd, amount and sender are in the db

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const { txd, amount, sender } = (await req.json()) as { txd: string; amount: string; sender: string };

	//convert txd. amount, sender to numbers
	const txdNum = Number(txd);
	const amountNum = Number(amount);
	const senderNum = Number(sender);

	if (!txdNum || !amountNum || !senderNum) {
		return new Response("Missing parameters", { status: 400 });
	}

	console.log(txdNum, amountNum, senderNum);

	//we gonna verify if their txd, amount and sender are in the db
	//if they are, we gonna return true
	//if they are not, we gonna return false

	const payment = await prisma.verification.findUnique({
		where: {
			txd: txd,
			amount: amountNum,
			sender: sender,
		},
	});

	console.log(payment);

	if (!payment) {
		return Response.json({ isVerified: false });
	}

	switch (payment.status) {
		case "pending":
			return Response.json({ isVerified: true, verificationId: payment.id });
			break;
		case "success":
			return Response.json({ isVerified: false });
			break;
		default:
			break;
	}

	// return Response.json({ success: true });
}
