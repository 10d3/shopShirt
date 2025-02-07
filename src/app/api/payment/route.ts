import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const { transactionId, amount, senderNumber, serviceProvider } = (await req.json()) as {
		transactionId: string;
		amount: string;
		senderNumber: string;
		serviceProvider: string;
	};

	//convert txd. amount, sender to numbers
	const txdNum = Number(transactionId);
	const amountNum = Number(amount);
	const senderNum = Number(senderNumber);

	console.log(txdNum, amountNum, senderNum, serviceProvider);

	if (!txdNum || !amountNum || !senderNum) {
		return new Response("Missing parameters", { status: 400 });
	}

	try {
		await prisma.verification.create({
			data: {
				txd: transactionId,
				amount: amountNum,
				sender: senderNumber,
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
