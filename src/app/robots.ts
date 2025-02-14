import { publicUrl } from "@/env.mjs";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api", "/dashboard", "/dashboard/*"],
		},
		sitemap: [publicUrl + "/sitemap.xml", publicUrl + "/blog/sitemap.xml"],
	};
}
