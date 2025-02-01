import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type orderFull = Prisma.OrderGetPayload<{
	include: {
		items: true;
		verification: true;
	};
}>;

interface order {
	id: string;
	userId?: string;
	phone?: string;
	status: string;
	verificationId: string;
	totalAmount: number;
	createdAt: Date;
	updatedAt: Date;
	items: item[];
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
	try {
		const test = await prisma.order.create({
			data: {
				userId: data.userId,
				phone: data.phone,
				status: data.status,
				totalAmount: data.totalAmount,
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

export const updateOrder = async (id: string, data: Partial<order>) => {
	try {
		const test = await prisma.order.update({
			where: {
				id,
			},
			data: {
				status: data.status,
			},
		});
		return test;
	} catch (error) {
		console.warn(error);
	}
};

export function transformOrderData(order: orderFull) {
	return {
		id: order.id,
		userId: order.userId,
		phone: order.phone,
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
