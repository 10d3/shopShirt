import type { ReactElement } from "react";

interface OrderStatusEmailProps {
	order: { id: string };
	status: string;
}

export default function OrderStatusEmail({ order, status }: OrderStatusEmailProps): ReactElement {
	const statusMessages: Record<string, { message: string; color: string }> = {
		received: {
			message: "We've received your order and are preparing it for you.",
			color: "#3B82F6", // Blue
		},
		preparing: {
			message: "Your order is currently being prepared.",
			color: "#10B981", // Green
		},
		ready_for_pickup: {
			message: "Your order is ready for pickup!",
			color: "#F59E0B", // Yellow
		},
		picked_up: {
			message: "Your order has been successfully picked up.",
			color: "#6366F1", // Indigo
		},
		canceled: {
			message: "Your order has been canceled.",
			color: "#EF4444", // Red
		},
	};

	const test = statusMessages[status as keyof typeof statusMessages] || statusMessages.received;

	return (
		<div
			style={{
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
				backgroundColor: "#F3F4F6",
				padding: "48px 0",
				margin: "0 auto",
			}}
		>
			<div
				style={{
					background: "#FFFFFF",
					borderRadius: "8px",
					padding: "40px",
					margin: "0 auto",
					maxWidth: "600px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
					<tr>
						<td style={{ textAlign: "center", padding: "0 0 32px" }}>
							<img
								src="https://fortetfier.com/logoxl.svg"
								alt="Fort&Fier Logo"
								style={{ maxWidth: "150px", height: "auto" }}
							/>
						</td>
					</tr>
					<tr>
						<td style={{ textAlign: "center", padding: "0 0 24px" }}>
							<h1
								style={{
									color: "#111827",
									fontSize: "24px",
									fontWeight: "bold",
									margin: "0",
								}}
							>
								Order Update
							</h1>
						</td>
					</tr>
					<tr>
						<td
							style={{
								backgroundColor: test?.color,
								borderRadius: "4px",
								color: "#FFFFFF",
								fontSize: "18px",
								fontWeight: "bold",
								padding: "16px",
								textAlign: "center",
							}}
						>
							{test?.message}
						</td>
					</tr>
					<tr>
						<td style={{ padding: "24px 0", textAlign: "center" }}>
							<p
								style={{
									color: "#4B5563",
									fontSize: "16px",
									lineHeight: "24px",
									margin: "0 0 16px",
								}}
							>
								Order ID: <strong>#{order.id.slice(-8)}</strong>
							</p>
							{status === "ready_for_pickup" && (
								<p
									style={{
										color: "#4B5563",
										fontSize: "16px",
										lineHeight: "24px",
										margin: "0",
									}}
								>
									Pickup Instructions: Bring your ID to the checkout counter during business hours.
								</p>
							)}
						</td>
					</tr>
					<tr>
						<td
							style={{
								borderTop: "1px solid #E5E7EB",
								color: "#6B7280",
								fontSize: "14px",
								padding: "24px 0 0",
								textAlign: "center",
							}}
						>
							<p style={{ margin: "0 0 8px" }}>Fort&Fier - Votre magasin de souvenirs de Fort-Liberté</p>
							<p style={{ margin: "0", color: "#9CA3AF", fontSize: "12px" }}>
								© 2023 Fort&Fier. All rights reserved.
							</p>
						</td>
					</tr>
				</table>
			</div>
		</div>
	);
}
