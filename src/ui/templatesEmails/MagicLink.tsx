import type * as React from "react";

interface EmailTemplateProps {
	url: string;
	host: string;
}

export default function MagicLink({ url, host }: EmailTemplateProps): React.ReactElement {
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
						Connectez-vous à {host}
					</h1>

					<p
						style={{
							color: "#4a5568",
							fontSize: "16px",
							lineHeight: "1.5",
							textAlign: "center",
							margin: "0 0 32px",
						}}
					>
						Cliquez sur le bouton ci-dessous pour vous connecter en toute sécurité à votre compte.
					</p>

					<div
						style={{
							textAlign: "center",
							margin: "32px 0",
						}}
					>
						<a
							href={url}
							style={{
								backgroundColor: "#4f46e5",
								borderRadius: "8px",
								color: "#ffffff",
								fontSize: "18px",
								fontWeight: "bold",
								textDecoration: "none",
								textAlign: "center",
								display: "inline-block",
								padding: "14px 32px",
								margin: "0 auto",
								transition: "all 0.3s ease",
								boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							}}
						>
							Se connecter à Fort&Fier
						</a>
					</div>

					<p
						style={{
							color: "#4a5568",
							fontSize: "14px",
							lineHeight: "1.6",
							textAlign: "center",
							margin: "32px 0 16px",
						}}
					>
						Si vous n&apos;avez pas demandé cet e-mail, vous pouvez l&apos;ignorer en toute sécurité.
					</p>
					<p
						style={{
							color: "#4a5568",
							fontSize: "14px",
							lineHeight: "1.6",
							textAlign: "center",
							margin: "0 0 16px",
						}}
					>
						Si le bouton ne fonctionne pas, cliquez sur le lien ci-dessous :
					</p>
					<a
						href={url}
						style={{
							color: "#4f46e5",
							fontSize: "14px",
							textDecoration: "underline",
							display: "block",
							textAlign: "center",
							wordBreak: "break-all",
							marginBottom: "32px",
						}}
					>
						{url}
					</a>

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
