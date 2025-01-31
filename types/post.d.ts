// types/post.d.ts
export type Post = {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt?: string; // Using undefined instead of null
	published: boolean;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
};
