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

	try {
		await prisma.verification.create({
			data: {
				txd: txd,
				amount: amountNum,
				sender: sender,
				paymentMethod: "local",
			},
		});
		return new Response("Payment adding success", { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Error creating payment", { status: 500 });
	}

	// return new Response("Payment verified", { status: 200 });
}
