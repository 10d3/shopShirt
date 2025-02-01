import Pagination from "@/app/dashboard/_components/pagination";
import { OrderActions } from "@/app/dashboard/managements/_components/order-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { formatMoney } from "commerce-kit/currencies";
import { ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderManagementPage(props: {
	searchParams: Promise<{
		page?: string;
		search?: string;
		status?: string;
		sort?: "asc" | "desc";
	}>;
}) {
	const session = await auth();
	const user = session?.user;
	if (!user) {
		return redirect("/login");
	}
	const admin = await prisma.user.findUnique({
		where: { id: user.id },
		select: { role: true },
	});

	if (admin?.role !== "Admin") {
		return redirect("/");
	}
	const searchParams = await props.searchParams;
	const currentPage = Number(searchParams.page) || 1;
	const pageSize = 10;
	const skip = (currentPage - 1) * pageSize;

	const where: Prisma.OrderWhereInput = {
		AND: [
			searchParams.search
				? {
						OR: [
							{ id: { contains: searchParams.search } },
							{ user: { name: { contains: searchParams.search } } },
							{ user: { email: { contains: searchParams.search } } },
						],
					}
				: {},
			searchParams.status ? { status: searchParams.status } : {},
		],
	};

	// In your server component (page.tsx)
	const [orders, totalOrders] = await Promise.all([
		prisma.order
			.findMany({
				where,
				include: {
					user: { select: { name: true, email: true } },
					items: true,
					verification: true,
				},
				orderBy: { createdAt: searchParams.sort || "desc" },
				skip,
				take: pageSize,
			})
			.then((orders) =>
				orders.map((order) => ({
					...order,
					totalAmount: order.totalAmount.toNumber(),
					items: order.items.map((item) => ({
						...item,
						price: item.price.toNumber(),
					})),
				})),
			),
		prisma.order.count({ where }),
	]);

	const getTotalItems = (items: (typeof orders)[number]["items"]) =>
		items.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
					<CardTitle className="text-2xl font-bold">Order Management</CardTitle>
					<div className="flex items-center space-x-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search orders..."
								className="pl-9 w-[300px]"
								defaultValue={searchParams.search}
							/>
						</div>
						<Select defaultValue={searchParams.status || "all"}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="canceled">Canceled</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="w-[180px]">
							<ArrowUpDown className="mr-2 h-4 w-4" />
							{searchParams.sort === "asc" ? "Oldest First" : "Newest First"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium">
										<Link href={`/admin/orders/${order.id}`} className="hover:underline text-blue-600">
											#{order.id.slice(-8)}
										</Link>
									</TableCell>
									<TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium">{order.user?.name}</span>
											<span className="text-sm text-muted-foreground">{order.user?.email}</span>
										</div>
									</TableCell>
									<TableCell>{getTotalItems(order.items)}</TableCell>
									<TableCell className="font-medium">
										{formatMoney({
											amount: order.totalAmount,
											currency: "USD",
										})}
									</TableCell>
									<TableCell>
										<StatusBadge status={order.status} />
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="capitalize">
											{order.verification?.paymentMethod}
										</Badge>
									</TableCell>
									<TableCell>
										<OrderActions order={order} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className="mt-6 flex justify-center">
				<Pagination currentPage={currentPage} totalItems={totalOrders} itemsPerPage={pageSize} />
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const statusColors = {
		received: "bg-blue-100 text-blue-800",
		preparing: "bg-orange-100 text-orange-800",
		ready_for_pickup: "bg-green-100 text-green-800",
		picked_up: "bg-purple-100 text-purple-800",
		canceled: "bg-red-100 text-red-800",
	};

	const statusLabels = {
		received: "Received",
		preparing: "Preparing",
		ready_for_pickup: "Ready for Pickup",
		picked_up: "Picked Up",
		canceled: "Canceled",
	};

	return (
		<Badge className={`capitalize ${statusColors[status as keyof typeof statusColors]}`}>
			{statusLabels[status as keyof typeof statusLabels]}
		</Badge>
	);
}
