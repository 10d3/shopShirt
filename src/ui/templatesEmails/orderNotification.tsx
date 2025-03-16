import type * as React from "react";

interface OrderEmailTemplateProps {
	orderNumber: string;
	customerName: string;
	orderDetails: {
		items: Array<{
			name: string;
			quantity: number;
			price: number;
		}>;
		total: number;
	};
	customerEmail: string;
	orderDate: Date;
}

export default function OrderNotification({
	orderNumber,
	customerName,
	orderDetails,
	customerEmail,
	orderDate,
}: OrderEmailTemplateProps): React.ReactElement {
	return (
		<div
			style={{
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
				margin: "0 auto",
			}}
		>
			<div
				style={{
					backgroundColor: "#f0f4f8",
					color: "#1a202c",
					padding: "48px 0",
				}}
			>
				<div
					style={{
						background: "#ffffff",
						borderRadius: "16px",
						padding: "48px",
						margin: "0 auto",
						maxWidth: "580px",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					}}
				>
					<img
						src="https://cb1u117vvu.ufs.sh/f/4lPHsyh67qxbFHeKAlofmo5ahkcYyOpiAl7tNeRWJ9ISnbGT"
						alt="Logo Fort&Fier"
						width="150"
						style={{
							display: "block",
							margin: "0 auto 40px",
						}}
					/>

					<h1
						style={{
							fontSize: "28px",
							fontWeight: "bold",
							textAlign: "center",
							margin: "0 0 24px",
							color: "#2d3748",
						}}
					>
						Nouvelle Commande #{orderNumber}
					</h1>

					<div
						style={{
							color: "#4a5568",
							fontSize: "16px",
							lineHeight: "1.5",
							margin: "0 0 32px",
						}}
					>
						<p>Une nouvelle commande a été passée avec les détails suivants :</p>

						<div style={{ margin: "20px 0" }}>
							<p>
								<strong>Client :</strong> {customerName}
							</p>
							<p>
								<strong>Email :</strong> {customerEmail}
							</p>
							<p>
								<strong>Date :</strong> {orderDate.toLocaleDateString("fr-FR")}
							</p>
						</div>

						<div style={{ margin: "20px 0" }}>
							<h2 style={{ fontSize: "18px", color: "#2d3748" }}>Détails de la commande :</h2>
							{orderDetails.items.map((item, index) => (
								<div key={index} style={{ margin: "10px 0" }}>
									{item.name} x{item.quantity} - {item.price.toFixed(2)}€
								</div>
							))}
							<div
								style={{
									marginTop: "20px",
									paddingTop: "10px",
									borderTop: "1px solid #e2e8f0",
									fontWeight: "bold",
								}}
							>
								Total : {orderDetails.total.toFixed(2)}€
							</div>
						</div>
					</div>

					<div
						style={{
							borderTop: "1px solid #e2e8f0",
							marginTop: "32px",
							paddingTop: "32px",
							textAlign: "center",
						}}
					>
						<p
							style={{
								color: "#718096",
								fontSize: "12px",
								margin: "0",
							}}
						>
							Fort&Fier - Votre partenaire de confiance
						</p>
						<p
							style={{
								color: "#718096",
								fontSize: "12px",
								margin: "8px 0 0",
							}}
						>
							© {new Date().getFullYear()} Fort&Fier. Tous droits réservés.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
