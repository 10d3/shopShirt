import React from "react";

//will receive params slug
export default async function SingleBlogPage(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;
	//then we gonna fetch the blog with the slug params from the db through prisma
	return <div>page {slug}</div>;
}
