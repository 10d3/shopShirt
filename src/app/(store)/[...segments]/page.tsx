import { MDXRemote } from "next-mdx-remote/rsc";
import Link, { type LinkProps } from "next/link";
import { notFound } from "next/navigation";
import type React from "react";

// Custom MDX components with Tailwind styling
const mdxComponents = {
	// Use Next.js Link for anchor tags
	a: (props: LinkProps) => <Link {...props} />,
	// Headings
	h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1 className="mt-8 mb-4 text-4xl font-bold text-center" {...props} />
	),
	h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2 className="mt-6 mb-3 text-3xl font-semibold text-gray-800" {...props} />
	),
	h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3 className="mt-5 mb-2 text-2xl font-medium text-gray-700" {...props} />
	),
	// Paragraphs
	p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p className="my-4 text-lg leading-relaxed" {...props} />
	),
	// Lists
	ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className="list-disc list-inside my-4 space-y-1" {...props} />
	),
	ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className="list-decimal list-inside my-4 space-y-1" {...props} />
	),
	li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mb-1" {...props} />,
	// Horizontal rule
	hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
		<hr className="my-8 border-t border-gray-300" {...props} />
	),
	// Blockquote (if needed)
	blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
		<blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
	),
};

const pages: Record<string, { content: string }> = {
	"/about": {
		content: `
# A propos de Fort & Fier

### Présentation de Fort & Fier

Fort & Fier est un blog-shop dédié à la célébration de l’héritage culturel et historique de Fort-Liberté, une ville emblématique d’Haïti. Notre plateforme allie contenu culturel et créations inspirées, offrant à nos visiteurs une expérience à la fois éducative et immersive.

---

### Notre mission
Notre mission est de :
- Raconter les histoires méconnues de Fort-Liberté à travers notre blog Chroniques.
- Célébrer la fierté locale en proposant des produits uniques qui reflètent l’esprit et l’identité de cette ville.
- Connecter la communauté locale, la diaspora haïtienne et les amoureux de la culture à travers des récits et des créations inspirantes.

---

### Ce que nous offrons :
1. **Le blog "Chroniques"** :
   - Un espace éditorial où nous explorons l’histoire, les traditions et les récits de Fort-Liberté.
   - Des articles riches en contenu qui mettent en lumière des figures historiques, des événements marquants et des anecdotes culturelles.
   - Une ressource éducative pour ceux qui souhaitent en savoir plus sur cette ville unique.

2. **La boutique en ligne** :
   - Une sélection de produits inspirés par Fort-Liberté : t-shirts, accessoires, posters et bien plus encore.
   - Chaque produit est conçu avec soin pour raconter une histoire ou représenter un symbole culturel.
   - Des éditions limitées et des collaborations avec des artistes locaux pour offrir des pièces uniques.

---

### Pourquoi un blog-shop ?
Chez Fort & Fier, nous croyons que la culture et le commerce peuvent coexister harmonieusement. Notre blog-shop est conçu pour :
- **Éduquer** : À travers nos articles, nous partageons des connaissances sur Fort-Liberté et son héritage.
- **Inspirer** : Nos produits sont bien plus que des objets – ce sont des supports d’expression culturelle.
- **Engager** : Nous créons une communauté autour de valeurs communes : la fierté, l’histoire et la culture.

---

### Notre vision
Nous aspirons à devenir une référence culturelle pour tous ceux qui s’intéressent à Fort-Liberté et à Haïti. À travers notre blog-shop, nous souhaitons :
- Valoriser l’héritage de Fort-Liberté en le rendant accessible à tous.
- Soutenir les artistes et créateurs locaux en leur offrant une plateforme pour exprimer leur talent.
- Créer un pont entre le passé et le présent, en reliant les générations à travers des récits et des créations.

---

### Rejoignez-nous
Que vous soyez passionné d’histoire, amateur de culture haïtienne, ou simplement curieux de découvrir Fort-Liberté, Fort & Fier est votre destination pour :
- Lire des articles captivants dans notre section Chroniques.
- Découvrir des produits uniques qui célèbrent l’esprit de Fort-Liberté.
- Participer à une communauté engagée et fière de ses racines.

---

### Contact
Pour en savoir plus, collaborer ou simplement échanger, n’hésitez pas à nous contacter :
- Email : [contact@fortetfier.com](mailto:contact@fortetfier.com)

---

### Fort & Fier : Bien plus qu’un blog, bien plus qu’une boutique
Nous sommes un espace où la culture prend vie, où les histoires se transforment en créations, et où la fierté de Fort-Liberté s’exprime à travers chaque mot et chaque produit. Bienvenue dans notre univers !
`,
	},
};

export default async function Page(props: { params: Promise<{ segments?: string[] }> }) {
	const params = await props.params;
	if (!params.segments) {
		return notFound();
	}

	const path = `/${params.segments.join("/")}`;
	const page = pages[path];

	if (!page) {
		return notFound();
	}

	return (
		<div className="prose pb-8 pt-4 lg:prose-lg xl:prose-xl">
			<MDXRemote source={page.content} components={mdxComponents} />
		</div>
	);
}
