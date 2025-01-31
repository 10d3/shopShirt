// app/dashboard/_components/product-editor.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/ui/shadcn/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

type StripeProduct = {
	id: string;
	name: string;
	active: boolean;
	description?: string | null;
	metadata?: Record<string, string>;
	images?: string[];
	// Add other Stripe-specific fields if needed
};

// Form schema remains the same
const productSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().optional(),
	category: z.string().min(2, "Category is required"),
	tags: z.array(z.string()).optional(),
	images: z.array(z.string().url("Invalid URL")).optional(),
	metadata: z.record(z.string()).optional(),
	active: z.boolean().default(true),
	variants: z
		.array(
			z.object({
				price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
				currency: z.string().length(3, "Must be 3-letter currency code"),
				image: z.string().url("Invalid image URL").optional(),
				attributes: z.record(z.string()).optional(),
			}),
		)
		.min(1, "At least one variant required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Transformation function
const transformStripeProduct = (product: StripeProduct | null): ProductFormValues => {
	if (!product) {
		return {
			name: "",
			description: "",
			category: "",
			active: true,
			variants: [
				{
					price: "",
					currency: "usd",
					image: "",
					attributes: {},
				},
			],
		};
	}

	return {
		name: product.name,
		description: product.description || "",
		category: product.metadata?.category || "",
		tags: product.metadata?.tags?.split(",") || [],
		images: product.images || [],
		metadata: product.metadata || {},
		active: product.active,
		variants: [
			{
				price: "0.00", // Replace with actual price from your Stripe data
				currency: "usd", // Replace with actual currency from your Stripe data
				image: product.images?.[0] || "",
				attributes: product.metadata || {},
			},
		],
	};
};

export default function ProductEditor({
	initialData,
	isNew,
}: {
	initialData?: StripeProduct | null;
	isNew?: boolean;
}) {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: transformStripeProduct(initialData || null),
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "variants",
	});

	async function onSubmit(values: ProductFormValues) {
		try {
			const method = isNew ? "POST" : "PUT";
			const response = await fetch("/api/stripe/products", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

			const data: { id: string; prices: string[] } = (await response.json()) as {
				id: string;
				prices: string[];
			};

			toast({
				title: isNew ? "Product created!" : "Product updated!",
				description: `Product ID: ${data.id}`,
			});

			router.refresh();
			router.push("/dashboard?step=products");
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
				{/* Product Information */}
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Name</FormLabel>
								<FormControl>
									<Input placeholder="Product name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input placeholder="Product description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="category"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Input placeholder="Product category" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="active"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel>Active Product</FormLabel>
									<FormDescription>This product will be visible to customers</FormDescription>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{/* Variants Section */}
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium">Variants</h3>
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								append({
									price: "",
									currency: "usd",
									image: "",
									attributes: {},
								})
							}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Variant
						</Button>
					</div>

					{fields.map((field, index) => (
						<div key={field.id} className="space-y-4 border p-4 rounded-lg">
							<div className="flex justify-between items-center">
								<h4 className="font-medium">Variant {index + 1}</h4>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => remove(index)}
									disabled={fields.length === 1}
								>
									<Trash className="h-4 w-4 text-destructive" />
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name={`variants.${index}.price`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input placeholder="0.00" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`variants.${index}.currency`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Currency</FormLabel>
											<FormControl>
												<Input placeholder="USD" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`variants.${index}.image`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image URL</FormLabel>
											<FormControl>
												<Input placeholder="https://example.com/image.jpg" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="space-y-2">
								<FormLabel>Attributes</FormLabel>
								<div className="grid grid-cols-2 gap-4">
									<Input
										placeholder="Attribute name (e.g., color)"
										onChange={(e) => {
											const currentAttributes = form.getValues(`variants.${index}.attributes`) || {};
											form.setValue(`variants.${index}.attributes`, {
												...currentAttributes,
												[e.target.value]: "",
											});
										}}
									/>

									<Input
										placeholder="Attribute value (e.g., red)"
										onChange={(e) => {
											const currentAttributes = form.getValues(`variants.${index}.attributes`) || {};
											const keys = Object.keys(currentAttributes);
											const lastKey = keys[keys.length - 1];

											if (lastKey) {
												form.setValue(`variants.${index}.attributes`, {
													...currentAttributes,
													[lastKey]: e.target.value,
												});
											}
										}}
									/>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="flex gap-4">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Processing..." : "Save Product"}
					</Button>
					<Button type="button" variant="outline" onClick={() => router.push("/dashboard?step=products")}>
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}
