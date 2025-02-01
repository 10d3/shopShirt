"use server";
import { resend } from "@/lib/actions/stripe";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import OrderStatusEmail from "@/ui/templatesEmails/orderStatusEmail";
import type { Prisma } from "@prisma/client";

export type orderFull = Prisma.OrderGetPayload<{
	include: {
		items: true;
		verification: true;
	};
}>;

interface order {
	id?: string;
	userId?: string;
	phone?: string;
	status: string;
	verificationId: string;
	totalAmount: number;
	items: item[];
	pointRelais: string;
	// verification: verification;
}
interface item {
	productId: string;
	productImage?: string;
	productName: string;
	quantity: number;
	price: number;
	digitalAssetUrl?: string;
}

export const createOrder = async (data: order) => {
	const session = await auth();
	const user = session?.user ?? null;
	if (!user) return null;
	try {
		const test = await prisma.order.create({
			data: {
				userId: user.id,
				phone: data.phone,
				status: data.status,
				totalAmount: data.totalAmount,
				pointOfSales: data.pointRelais,
				items: {
					createMany: {
						data: data.items.map((item) => {
							return {
								productId: item.productId,
								productImage: item.productImage,
								productName: item.productName,
								quantity: item.quantity,
								price: item.price,
							};
						}),
					},
				},
			},
		});
		await prisma.verification.update({
			where: { id: data.verificationId },
			data: { orderId: test.id, status: "success" },
		});
		return test;
	} catch (error) {
		console.warn(error);
	}
};

// app/actions/orders.ts
export async function updateOrderStatus(orderId: string, status: string) {
	const order = await prisma.order.update({
		where: { id: orderId },
		data: { status },
		include: { user: true, items: true },
	});

	if (order.user?.email) {
		const subjectMap = {
			ready_for_pickup: `Your Order #${order.id.slice(-8)} is Ready for Pickup!`,
			picked_up: `Order #${order.id.slice(-8)} Picked Up`,
			canceled: `Order #${order.id.slice(-8)} Canceled`,
			default: `Order Status Update for #${order.id.slice(-8)}`,
		};

		await resend.emails.send({
			// from: "POS System <pos@yourdomain.com>",
			from: "POS System <info@allobillet.app>",
			to: order.user.email,
			subject: subjectMap[status as keyof typeof subjectMap] || subjectMap.default,
			react: OrderStatusEmail({ order, status }),
			// text: OrderStatusEmail({ order, status }),
		});
	}

	return true;
}

export async function transformOrderData(order: orderFull) {
	return {
		id: order.id,
		userId: order.userId,
		phone: order.phone ?? "",
		status: order.status,
		totalAmount: order.totalAmount,
		createdAt: order.createdAt,
		updatedAt: order.updatedAt,
		items: order.items.map((item) => ({
			productId: item.productId,
			productImage: item.productImage,
			productName: item.productName,
			quantity: item.quantity,
			price: item.price,
			digitalAssetUrl: item.digitalAssetUrl,
		})),
		verification: order.verification,
	};
}

// export function transformOrderDataToPrisma({
// 	cart,
// 	data,
// }: {
// 	cart: Commerce.Cart; // Updated to use the correct input type
// 	data: {
// 		phone: string;
// 		status: string;
// 		verificationId: string;
// 	};
// }) {
// 	return {
// 		//   userId: data.userId, // Ensure userId is included
// 		phone: data.phone,
// 		status: data.status,
// 		verificationId: data.verificationId, // Include verificationId
// 		totalAmount: cart.cart.amount,
// 		items: cart.lines.map((item) => ({
// 			productId: item.product.id,
// 			productImage: item.product.images[0],
// 			productName: item.product.name,
// 			quantity: item.quantity,
// 			price: item.product.default_price.unit_amount ?? 0,
// 			digitalAssetUrl: item.product.metadata.digitalAsset,
// 		})),
// 	};
// }
