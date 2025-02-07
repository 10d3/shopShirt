import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const { transactionId, amount, sender } = (await req.json()) as {
		transactionId: string;
		amount: string;
		sender: string;
	};

	//convert txd. amount, sender to numbers
	const txdNum = Number(transactionId);
	const amountNum = Number(amount);
	const senderNum = Number(sender);

	console.log(txdNum, amountNum, senderNum);

	if (!txdNum || !amountNum || !senderNum) {
		return new Response("Missing parameters", { status: 400 });
	}

	try {
		await prisma.verification.create({
			data: {
				txd: transactionId,
				amount: amountNum,
				sender: sender,
				paymentMethod: "local",
			},
		});
		return new Response("Payment adding success", { status: 200 });
	} catch (error) {
		// console.log(error);
		return new Response("Error creating payment", { status: 500 });
	}

	// return new Response("Payment verified", { status: 200 });
}
