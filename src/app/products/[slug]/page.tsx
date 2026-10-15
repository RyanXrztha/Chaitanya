import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNotFoundError } from "@/domain";
import { container } from "@/infrastructure/container";
import { ProductDetailView } from "@/presentation/components/features/products/ProductDetailView";

async function load(slug: string) {
  try {
    return await container.getProductDetail.execute(slug);
  } catch (e) {
    if (isNotFoundError(e)) notFound();
    throw e;
  }
}

export async function generateStaticParams() {
  return (await container.getProductDetail.slugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { product } = await load((await params).slug);
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { product, sizes, related } = await load((await params).slug);
  return <ProductDetailView product={product} sizes={sizes} related={related} />;
}
