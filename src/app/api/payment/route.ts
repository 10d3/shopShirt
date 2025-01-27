export async function POST(req: Request) {
	const { txd, amount, sender } = (await req.json()) as { txd: string; amount: string; sender: string };

	//convert txd. amount, sender to numbers
	const txdNum = Number(txd);
	const amountNum = Number(amount);
	const senderNum = Number(sender);

	if (!txdNum || !amountNum || !senderNum) {
		return new Response("Missing parameters", { status: 400 });
	}

	//we gonna store them in a db later using prisma
}
