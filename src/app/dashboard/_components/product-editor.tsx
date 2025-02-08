"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/lib/actions/product";
import { UploadButton } from "@/lib/uploadthing";
import { useToast } from "@/ui/shadcn/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

export interface StripeProduct {
	id?: string;
	name?: string;
	description: string | null;
	price?: string;
	active?: boolean;
	image?: string[];
	variants?: {
		price: string;
		currency: string;
		image: string[];
		attributes: { key: string; value: string };
		variant: string;
		stock: number;
	}[];
	metadata?: { key: string; value: string }[];
}

const productSchema = z.object({
	name: z.string().min(1),
	category: z.string().min(1),
	description: z.string().min(1),
	// price: z.number().min(0),
	price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
	active: z.boolean(),
	image: z.array(z.string()),
	variants: z.array(
		z.object({
			// price: z.string().min(1),
			price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
			currency: z.string().min(1),
			image: z.array(z.string()),
			attributes: z.object({
				key: z.string(),
				value: z.string(),
			}),
			variant: z.string(),
			stock: z.number().min(0),
		}),
	),
	metadata: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		}),
	),
});

export type ProductFormValues = z.infer<typeof productSchema>;

function transformStripeProduct(product: StripeProduct | null): ProductFormValues {
	if (!product) {
		return {
			name: "",
			category: "",
			description: "",
			price: "0",
			active: false,
			image: [],
			variants: [],
			metadata: [],
		};
	}

	return {
		name: product.name || "",
		category: "",
		description: product.description || "",
		price: product.price?.toString() || "0",
		active: product.active || false,
		image: product.image || [],
		variants: product.variants || [],
		metadata: product.metadata || [],
	};
}

export default function ProductEditor({
	initialData,
	isNew,
}: {
	initialData: StripeProduct | null;
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

	const {
		fields: fieldsList1,
		append: appendList1,
		remove: removeList1,
	} = useFieldArray({
		control: form.control,
		name: "metadata",
	});

	async function onSubmit(values: ProductFormValues) {
		try {
			const res = await createProduct(values);

			if (res.id) {
				toast({
					title: "Product saved",
					description: "Your product has been saved successfully.",
				});
				router.push("/dashboard?step=products");
			} else {
				throw new Error("Failed to save product");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save product. Please try again later.",
			});
			console.error(error);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>{isNew ? "Create New Product" : "Edit Product"}</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="basic" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="basic">Basic Info</TabsTrigger>
								<TabsTrigger value="variants">Variants</TabsTrigger>
								<TabsTrigger value="metadata">Metadata</TabsTrigger>
							</TabsList>
							<TabsContent value="basic" className="space-y-4 mt-4">
								<div className="grid grid-cols-2 gap-4">
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
								</div>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea placeholder="Product description" {...field} rows={4} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Product Price</FormLabel>
												<FormControl>
													<Input placeholder="99.99" {...field} />
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
								<FormField
									control={form.control}
									name="image"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Product Images</FormLabel>
											<FormControl>
												<div className="border rounded-md p-4">
													<UploadButton
														endpoint="imageUploader"
														onClientUploadComplete={(res) => {
															const urls = res.map((file) => file.url);
															field.onChange(urls);
															form.setValue("image", urls);
														}}
														onUploadError={(error: Error) => {
															console.error("Upload error:", error);
															form.setError("image", {
																type: "manual",
																message: error.message,
															});
														}}
														appearance={{
															button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed",
															allowedContent: "text-muted-foreground",
														}}
													/>
													{field.value?.length > 0 && (
														<div className="grid grid-cols-4 gap-4 mt-4">
															{field.value.map((url, index) => (
																<div key={index} className="relative group">
																	<Image
																		src={url || "/placeholder.svg"}
																		alt={`Product image ${index}`}
																		width={200}
																		height={200}
																		className="rounded-md object-cover w-full h-32"
																	/>
																	<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
																		<Button
																			variant="destructive"
																			size="icon"
																			onClick={() => {
																				const newUrls = field.value?.filter((_, i) => i !== index) || [];
																				field.onChange(newUrls);
																				form.setValue("image", newUrls);
																			}}
																		>
																			<Trash className="h-4 w-4" />
																		</Button>
																	</div>
																</div>
															))}
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
							<TabsContent value="variants" className="space-y-4 mt-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-medium">Variants</h3>
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											append({
												price: "",
												currency: "usd",
												image: [],
												attributes: { key: "", value: "" },
												variant: "",
												stock: 0,
											})
										}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Variant
									</Button>
								</div>
								{fields.map((field, index) => (
									<Card key={field.id}>
										<CardContent className="pt-6">
											<div className="flex justify-between items-center mb-4">
												<h4 className="font-medium">Variant {index + 1}</h4>
												<Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
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
															<FormLabel>Product Images</FormLabel>
															<FormControl>
																<div className="border rounded-md p-4">
																	<UploadButton
																		endpoint="imageUploader"
																		onClientUploadComplete={(res) => {
																			const urls = res.map((file) => file.url);
																			field.onChange(urls);
																			form.setValue("image", urls);
																		}}
																		onUploadError={(error: Error) => {
																			console.error("Upload error:", error);
																			form.setError("image", {
																				type: "manual",
																				message: error.message,
																			});
																		}}
																		appearance={{
																			button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed",
																			allowedContent: "text-muted-foreground",
																		}}
																	/>
																	{field.value?.length > 0 && (
																		<div className="grid grid-cols-4 gap-4 mt-4">
																			{field.value.map((url, index) => (
																				<div key={index} className="relative group">
																					<Image
																						src={url || "/placeholder.svg"}
																						alt={`Product image ${index}`}
																						width={200}
																						height={200}
																						className="rounded-md object-cover w-full h-32"
																					/>
																					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
																						<Button
																							variant="destructive"
																							size="icon"
																							onClick={() => {
																								const newUrls =
																									field.value?.filter((_, i) => i !== index) || [];
																								field.onChange(newUrls);
																								form.setValue("image", newUrls);
																							}}
																						>
																							<Trash className="h-4 w-4" />
																						</Button>
																					</div>
																				</div>
																			))}
																		</div>
																	)}
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.variant`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Variant</FormLabel>
															<FormControl>
																<Input placeholder="small, medium, large" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<div className="grid grid-cols-2 gap-4 mt-4">
												<FormField
													control={form.control}
													name={`variants.${index}.attributes.key`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Attribute Key</FormLabel>
															<FormControl>
																<Input placeholder="Key (e.g., color)" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`variants.${index}.attributes.value`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Attribute Value</FormLabel>
															<FormControl>
																<Input placeholder="Value (e.g., red)" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</CardContent>
									</Card>
								))}
							</TabsContent>
							<TabsContent value="metadata" className="space-y-4 mt-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-medium">Metadata</h3>
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendList1({
												key: "",
												value: "",
											})
										}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Metadata
									</Button>
								</div>
								{fieldsList1.map((field, index) => (
									<Card key={field.id}>
										<CardContent className="pt-6">
											<div className="flex justify-between items-center mb-4">
												<h4 className="font-medium">Metadata {index + 1}</h4>
												<Button type="button" variant="ghost" size="sm" onClick={() => removeList1(index)}>
													<Trash className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<FormField
													control={form.control}
													name={`metadata.${index}.key`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Key</FormLabel>
															<FormControl>
																<Input placeholder="Key (e.g., color)" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`metadata.${index}.value`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Value</FormLabel>
															<FormControl>
																<Input placeholder="Value (e.g., red)" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</CardContent>
									</Card>
								))}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<div className="flex gap-4 justify-end">
					<Button type="button" variant="outline" onClick={() => router.push("/dashboard?step=products")}>
						Cancel
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Processing..." : "Save Product"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
