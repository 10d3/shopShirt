import { encodePlusCode, pointDeRelais } from "@/lib/utils";
import type { ReactElement } from "react";

interface OrderStatusEmailProps {
	order: { id: string };
	status: string;
	pointOfSales?: string;
}

export default function OrderStatusEmail({
	order,
	status,
	pointOfSales,
}: OrderStatusEmailProps): ReactElement {
	const statusMessages: Record<string, { message: string; color: string; icon: string }> = {
		received: {
			message: "Nous avons bien reçu votre commande et nous la préparons avec soin pour vous.",
			color: "#3B82F6",
			icon: "📦",
		},
		preparing: {
			message: "Votre commande est en cours de préparation avec toute notre attention.",
			color: "#10B981",
			icon: "🔧",
		},
		ready_for_pickup: {
			message: `Votre commande est prête à être retirée chez ${
				pointDeRelais.find((pos) => pos.value === pointOfSales)?.name || pointOfSales
			}. Nous avons hâte de vous y accueillir !`,
			color: "#F59E0B",
			icon: "✅",
		},
		picked_up: {
			message: "Votre commande a été récupérée avec succès. Merci de votre confiance, et à très bientôt !",
			color: "#6366F1",
			icon: "🎉",
		},
		canceled: {
			message:
				"Votre commande a été annulée. Nous sommes navrés de ce désagrément et restons à votre écoute pour toute question.",
			color: "#EF4444",
			icon: "❌",
		},
	};

	const test = statusMessages[status as keyof typeof statusMessages] as {
		message: string;
		color: string;
		icon: string;
	};

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
								src="https://cb1u117vvu.ufs.sh/f/4lPHsyh67qxbFHeKAlofmo5ahkcYyOpiAl7tNeRWJ9ISnbGT"
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
									fontSize: "28px",
									fontWeight: "bold",
									margin: "0",
									lineHeight: "1.2",
								}}
							>
								Mise à jour de votre commande
							</h1>
						</td>
					</tr>
					<tr>
						<td
							style={{
								backgroundColor: test.color,
								borderRadius: "8px",
								color: "#FFFFFF",
								fontSize: "18px",
								fontWeight: "bold",
								padding: "24px",
								textAlign: "center",
							}}
						>
							<div style={{ fontSize: "36px", marginBottom: "16px" }}>{test.icon}</div>
							{test.message}
						</td>
					</tr>
					<tr>
						<td style={{ padding: "24px 0", textAlign: "center" }}>
							<p
								style={{
									color: "#4B5563",
									fontSize: "18px",
									lineHeight: "1.5",
									margin: "0 0 16px",
								}}
							>
								N° de commande: <strong style={{ color: "#111827" }}>#{order.id.slice(-8)}</strong>
							</p>
							{status === "ready_for_pickup" && (
								<>
									<p
										style={{
											color: "#4B5563",
											fontSize: "16px",
											lineHeight: "1.5",
											margin: "0 0 16px",
										}}
									>
										Instructions de retrait : Apportez votre téléphone pour le scan de vérification.
									</p>
									<a
										href={`https://www.google.com/maps/dir/?api=1&destination=${encodePlusCode((pointDeRelais.find((pos) => pos.value === pointOfSales)?.adresse as string) || "")}`}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											backgroundColor: "#3B82F6",
											color: "#FFFFFF",
											padding: "12px 24px",
											borderRadius: "4px",
											textDecoration: "none",
											fontWeight: "bold",
											display: "inline-block",
										}}
									>
										Obtenir l'itinéraire
									</a>
								</>
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
							<p style={{ margin: "0 0 8px" }}>Fort&Fier - Votre magasin de souvenirs</p>
							<p style={{ margin: "0", color: "#9CA3AF", fontSize: "12px" }}>
								© 2023 Fort&Fier. Tous droits réservés.
							</p>
						</td>
					</tr>
				</table>
			</div>
		</div>
	);
}
