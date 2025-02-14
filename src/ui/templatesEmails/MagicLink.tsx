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
				backgroundColor: "#f9fafb",
				padding: "48px 0",
				margin: "0 auto",
			}}
		>
			<div
				style={{
					background: "#ffffff",
					borderRadius: "16px",
					padding: "48px",
					margin: "0 auto",
					maxWidth: "580px",
					boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
				}}
			>
				<img
					src="https://cb1u117vvu.ufs.sh/f/4lPHsyh67qxbFHeKAlofmo5ahkcYyOpiAl7tNeRWJ9ISnbGT"
					alt="Fortetfier Logo"
					width="150"
					style={{
						display: "block",
						margin: "0 auto 40px",
					}}
				/>

				<h1
					style={{
						color: "#111827",
						fontSize: "24px",
						fontWeight: "bold",
						textAlign: "center",
						margin: "0 0 24px",
					}}
				>
					Sign in to {host}
				</h1>

				<p
					style={{
						color: "#6b7280",
						fontSize: "16px",
						lineHeight: "24px",
						textAlign: "center",
						margin: "0 0 24px",
					}}
				>
					Click the button below to securely sign in to your account.
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
							fontSize: "16px",
							fontWeight: "bold",
							textDecoration: "none",
							textAlign: "center",
							display: "inline-block",
							padding: "12px 32px",
							margin: "0 auto",
						}}
					>
						Sign in to {`Fort&Fier`}
					</a>
				</div>

				<p
					style={{
						color: "#6b7280",
						fontSize: "14px",
						lineHeight: "20px",
						textAlign: "center",
						margin: "32px 0 0",
					}}
				>
					If you didn&apos;t request this email, you can safely ignore it.
				</p>
				<p>if the button didn&apos;t work click the link below</p>
				<a href={url}>{url}</a>

				<div
					style={{
						borderTop: "1px solid #e5e7eb",
						marginTop: "32px",
						paddingTop: "32px",
						textAlign: "center",
					}}
				>
					<p
						style={{
							color: "#9ca3af",
							fontSize: "12px",
							margin: "0",
						}}
					>
						{`Fort&Fier`} - {`Votre partenaire de confiance`}
					</p>
				</div>
			</div>
		</div>
	);
}
