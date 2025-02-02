import Pagination from "@/app/dashboard/_components/pagination";
import { OrderActions } from "@/app/dashboard/managements/_components/order-action";
import { OrderItemsDialog } from "@/app/dashboard/managements/_components/order-items-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { pointDeRelais } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
// import { formatMoney } from "commerce-kit/currencies";
import { ArrowUpDown, Download, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderManagementPage(props: {
	searchParams: {
		page?: string;
		search?: string;
		status?: string;
		sort?: "asc" | "desc";
	};
}) {
	const session = await auth();
	const user = session?.user;
	const searchParams = await props.searchParams;
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

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<Card className="shadow-lg">
				<CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-7">
					<CardTitle className="text-3xl font-bold">Order Management</CardTitle>
					<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
						<div className="relative w-full sm:w-auto">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search orders..."
								className="pl-9 w-full sm:w-[300px]"
								defaultValue={searchParams.search}
							/>
						</div>
						<Select defaultValue={searchParams.status || "all"}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="received">Received</SelectItem>
								<SelectItem value="preparing">Preparing</SelectItem>
								<SelectItem value="ready_for_pickup">Ready for Pickup</SelectItem>
								<SelectItem value="picked_up">Picked Up</SelectItem>
								<SelectItem value="canceled">Canceled</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" className="w-full sm:w-[180px]">
							<ArrowUpDown className="mr-2 h-4 w-4" />
							{searchParams.sort === "asc" ? "Oldest First" : "Newest First"}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Items</TableHead>
									<TableHead>POS</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Payment</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.map((order) => (
									<TableRow key={order.id} className="hover:bg-gray-50">
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
										<TableCell>
											<OrderItemsDialog items={order.items} />
										</TableCell>
										<TableCell className="font-medium">
											{(order.pointOfSales &&
												pointDeRelais.find((pos) => pos.value === order.pointOfSales)?.name) ||
												order.pointOfSales}
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
					</div>
				</CardContent>
			</Card>

			<div className="mt-6 flex justify-between items-center">
				<Button variant="outline" className="flex items-center gap-2">
					<Download className="h-4 w-4" />
					Export Orders
				</Button>
				<Pagination currentPage={currentPage} totalItems={totalOrders} itemsPerPage={pageSize} />
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const statusConfig = {
		received: { color: "bg-blue-100 text-blue-800", label: "Received" },
		preparing: { color: "bg-orange-100 text-orange-800", label: "Preparing" },
		ready_for_pickup: { color: "bg-green-100 text-green-800", label: "Ready for Pickup" },
		picked_up: { color: "bg-purple-100 text-purple-800", label: "Picked Up" },
		canceled: { color: "bg-red-100 text-red-800", label: "Canceled" },
	};

	const { color, label } = statusConfig[status as keyof typeof statusConfig] || statusConfig.received;

	return <Badge className={`capitalize ${color}`}>{label}</Badge>;
}
