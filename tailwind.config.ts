import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
	darkMode: ["class", ".dark-mode"],
	content: [
		"./src/**/*.{js,ts,jsx,tsx, mdx}", // Adjust this path based on your project structure
		"./content/**/*.{md,mdx}",
	],
	theme: {
		extend: {
			colors: {
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
		},
	},
	plugins: [],
};

export default withUt(config);
