import { getProduct, getProducts } from "@/lib/actions/product";
import { cn } from "@/lib/utils";
// app/dashboard/page.tsx
import { Box, FileText, LayoutDashboard, Settings } from "lucide-react";
import ProductEditor from "./_components/product-editor";
import ProductList from "./_components/product-list";

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ step?: string; id?: string }>;
}) {
	const searchP = await searchParams;
	const currentStep = searchP.step || "dashboard";
	const editId = searchP.id;

	// Only fetch product if we're editing an existing product
	const shouldFetchProduct = editId && currentStep === "products" && editId !== "new";

	const [products, currentProduct] = await Promise.all([
		currentStep === "products" && !editId ? getProducts() : [],
		shouldFetchProduct ? getProduct(editId) : null,
	]);

	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div className="w-64 border-r bg-muted/50 p-4">
				<div className="space-y-4">
					<h2 className="text-lg font-semibold px-2">Dashboard</h2>
					<nav className="space-y-1">
						{[
							{ name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
							{ name: "Blog Posts", key: "blog", icon: FileText },
							{ name: "Products", key: "products", icon: Box },
							{ name: "Settings", key: "settings", icon: Settings },
						].map((item) => (
							<a
								key={item.key}
								href={`/dashboard?step=${item.key}`}
								className={cn(
									"w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
									currentStep === item.key ? "bg-primary text-primary-foreground" : "hover:bg-accent/50",
								)}
							>
								<item.icon className="h-5 w-5" />
								<span>{item.name}</span>
							</a>
						))}
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-8 overflow-auto">
				<div className="max-w-6xl mx-auto">
					{currentStep === "products" && editId && (
						<ProductEditor initialData={editId === "new" ? null : currentProduct} isNew={editId === "new"} />
					)}

					{/* {currentStep === "products" && !editId && <ProductList products={products} />} */}
					{currentStep === "products" && !editId && (
						<ProductList
							products={products as { id: string; name: string; prices: { unit_amount: number }[] }[]}
						/>
					)}

					{currentStep === "dashboard" && (
						<div className="text-center py-12">
							<h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
							<p className="text-muted-foreground">Select a section from the sidebar to get started</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
