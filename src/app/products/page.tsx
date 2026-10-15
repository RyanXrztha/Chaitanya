import type { Metadata } from "next";
import { ProductsScreen } from "@/presentation/screens/ProductsScreen";

export const metadata: Metadata = {
  title: "Natural Wellness Products",
  description:
    "Herbal powders, cold-pressed oils and natural skincare — the same pure ingredients Chaitanya uses in its therapies.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  return <ProductsScreen searchParams={await searchParams} />;
}
