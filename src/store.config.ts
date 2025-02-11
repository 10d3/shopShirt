import AccessoriesImage from "@/images/essentiels.png";
import ApparelImage from "@/images/heritage.png";

export const config = {
	categories: [
		{ name: "Mode inspirée de Fort-Liberté", slug: "heritage", image: ApparelImage },
		{ name: "Accessoires qui font la différence", slug: "essentiels", image: AccessoriesImage },
		{ name: "Souvenirs emblématiques", slug: "memoires", image: AccessoriesImage },
	],

	social: {
		x: "https://x.com/yourstore",
		facebook: "https://facebook.com/yourstore",
	},

	contact: {
		email: "support@yourstore.com",
		phone: "+1 (555) 111-4567",
		address: "123 Store Street, City, Country",
	},
};

export type StoreConfig = typeof config;
export default config;
