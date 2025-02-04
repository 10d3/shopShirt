export type NestedPick<
	TObj,
	TObjectKey extends string,
> = TObjectKey extends `${infer TKeyPrefix}.${infer TKeyRest}`
	? TKeyPrefix extends keyof TObj
		? { [NewKey in TKeyPrefix]: NestedPick<TObj[TKeyPrefix], TKeyRest> }
		: never
	: TObjectKey extends keyof TObj
		? { [NewKey in TObjectKey]: TObj[TObjectKey] }
		: never;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

export type Pretty2<T> = {
	[K in keyof T]: T[K] extends object ? { [K2 in keyof T[K]]: T[K][K2] } : T[K];
};

// types/stripe.d.ts
export type StripePrice = {
	id: string;
	object: "price";
	active: boolean;
	currency: string;
	unit_amount: number | null;
	unit_amount_decimal: string | null;
	product: string; // Product ID
	type: "one_time" | "recurring";
	// Add other price properties you need
};

export type StripeProduct = {
	id: string;
	object: "product";
	active: boolean;
	name: string;
	description: string | null;
	images: string[];
	metadata: Record<string, string>;
	created: number;
	updated: number;
	default_price: string | StripePrice | null;
	prices?: StripePrice[]; // If you expand prices in the API call
	// Add other product properties you need
};
