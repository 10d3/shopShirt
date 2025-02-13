import { env } from "@/env.mjs";

// API configuration
const PRINTIFY_API_URL = env.PRINTIFY_ENDPOINT;
const PRINTIFY_API_KEY = env.PRINTIFY_API_KEY;

// Common headers
const headers = {
	Authorization: `Bearer ${PRINTIFY_API_KEY}`,
	"Content-Type": "application/json",
	// "User-Agent": "Printify-API-Client/1.0",
};

// Type definitions
interface Address {
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	country: string;
	region?: string;
	address1: string;
	address2?: string;
	city: string;
	zip: string;
}

interface ShippingOption {
	id: number;
	title: string;
}

interface ProductVariant {
	id: number;
	price: number;
	title: string;
	sku: string;
	options: number[];
	placeholder?: string;
}

interface Product {
	id: string;
	title: string;
	description: string;
	tags: string[];
	variants: ProductVariant[];
	images: Array<{ src: string }>;
	created_at: string;
	updated_at: string;
}

interface OrderLineItem {
	product_id: string;
	variant_id: number;
	quantity: number;
	print_provider_id?: number;
	blueprint_id?: number;
	sku?: string;
}

export enum OrderStatus {
	PENDING = "pending",
	ON_HOLD = "onhold",
	CANCELED = "canceled",
	FAILED = "failed",
	COMPLETED = "completed",
}

interface Order {
	id: string;
	address_to: Address;
	line_items: OrderLineItem[];
	metadata: {
		order_type: string;
		shop_order_id?: string;
		shop_order_label?: string;
	};
	shipping_method: number;
	send_shipping_notification: boolean;
	status: OrderStatus;
	created_at: string;
	updated_at: string;
}

interface PaginationParams {
	page?: number;
	limit?: number;
}

// Error handling types
interface ApiErrorResponse {
	message?: string;
	errors?: unknown;
	[key: string]: unknown;
}

class PrintifyError extends Error {
	status: number;
	details: unknown;

	constructor(message: string, status: number, details?: unknown) {
		super(message);
		this.name = "PrintifyError";
		this.status = status;
		this.details = details;
		Object.setPrototypeOf(this, PrintifyError.prototype);
	}
}

// Type guard for error response
function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
	return typeof error === "object" && error !== null && ("message" in error || "errors" in error);
}

// Request handler
async function handleRequest<T>(response: Response): Promise<T> {
	const contentType = response.headers.get("content-type");
	let data: unknown;

	try {
		data = contentType?.includes("application/json") ? await response.json() : await response.text();
	} catch (error) {
		throw new PrintifyError("Failed to parse response", response.status, error);
	}

	if (!response.ok) {
		const errorMessage = isApiErrorResponse(data)
			? data.message || `HTTP error ${response.status}`
			: `HTTP error ${response.status}`;

		const errorDetails = isApiErrorResponse(data) ? (data.errors ?? data) : data;

		throw new PrintifyError(errorMessage, response.status, errorDetails);
	}

	return data as T;
}

// API methods
export const getProducts = async (shopId: string, params?: PaginationParams): Promise<Product[]> => {
	try {
		const url = new URL(`${PRINTIFY_API_URL}/shops/${shopId}/products.json`);

		if (params) {
			url.search = new URLSearchParams({
				page: params.page?.toString() ?? "1",
				limit: params.limit?.toString() ?? "10",
			}).toString();
		}

		const response = await fetch(url.toString(), { method: "GET", headers });
		return await handleRequest<Product[]>(response);
	} catch (error) {
		console.error("[Printify] Error fetching products:", error);
		throw error;
	}
};

export const getProduct = async (shopId: string, productId: string): Promise<Product> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest<Product>(response);
	} catch (error) {
		console.error("[Printify] Error fetching product:", error);
		throw error;
	}
};

export const deleteProduct = async (shopId: string, productId: string): Promise<void> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}.json`, {
			method: "DELETE",
			headers,
		});

		if (response.status !== 204) {
			await handleRequest<unknown>(response);
		}
	} catch (error) {
		console.error("[Printify] Error deleting product:", error);
		throw error;
	}
};

export const createOrder = async (shopId: string, orderData: Order): Promise<Order> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders.json`, {
			method: "POST",
			headers,
			body: JSON.stringify(orderData),
		});
		return await handleRequest<Order>(response);
	} catch (error) {
		console.error("[Printify] Error creating order:", error);
		throw error;
	}
};

export const getOrderDetails = async (shopId: string, orderId: string): Promise<Order> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders/${orderId}.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest<Order>(response);
	} catch (error) {
		console.error("[Printify] Error fetching order details:", error);
		throw error;
	}
};

export const updateOrder = async (
	shopId: string,
	orderId: string,
	updateData: Partial<Order>,
): Promise<Order> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders/${orderId}.json`, {
			method: "PUT",
			headers,
			body: JSON.stringify(updateData),
		});
		return await handleRequest<Order>(response);
	} catch (error) {
		console.error("[Printify] Error updating order:", error);
		throw error;
	}
};

export const deleteOrder = async (shopId: string, orderId: string): Promise<void> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/orders/${orderId}.json`, {
			method: "DELETE",
			headers,
		});

		if (response.status !== 204) {
			await handleRequest<unknown>(response);
		}
	} catch (error) {
		console.error("[Printify] Error deleting order:", error);
		throw error;
	}
};

export const getShippingOptions = async (shopId: string, productId: string): Promise<ShippingOption[]> => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}/shipping.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest<ShippingOption[]>(response);
	} catch (error) {
		console.error("[Printify] Error fetching shipping options:", error);
		throw error;
	}
};

export const getShops = async () => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest(response);
	} catch (error) {
		console.error("[Printify] Error fetching shops:", error);
		throw error;
	}
};

export const getBlueprints = async () => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/blueprints.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest(response);
	} catch (error) {
		console.error("[Printify] Error fetching blueprints:", error);
		throw error;
	}
};

export const getBlueprint = async (blueprintId: string) => {
	try {
		const response = await fetch(`${PRINTIFY_API_URL}/blueprints/${blueprintId}.json`, {
			method: "GET",
			headers,
		});
		return await handleRequest(response);
	} catch (error) {
		console.error("[Printify] Error fetching blueprint:", error);
		throw error;
	}
};

export const publishProduct = async (shopId: string, productId: string): Promise<void> => {
	const publishData = {
		title: true,
		description: true,
		images: true,
		variants: true,
		tags: true,
		keyFeatures: true,
		shipping_template: true,
	};

	try {
		const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}/publish.json`, {
			method: "POST",
			headers,
			body: JSON.stringify(publishData),
		});

		if (response.status !== 204) {
			await handleRequest<unknown>(response);
		}
	} catch (error) {
		console.error("[Printify] Error publishing product:", error);
		throw error;
	}
};
