import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNotFoundError } from "@/domain";
import { container } from "@/infrastructure/container";
import { ServiceDetailView } from "@/presentation/components/features/services/ServiceDetailView";

async function load(slug: string) {
  try {
    return await container.getServiceDetail.execute(slug);
  } catch (e) {
    if (isNotFoundError(e)) notFound();
    throw e;
  }
}

export async function generateStaticParams() {
  return (await container.getServiceDetail.slugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { service } = await load((await params).slug);
  return { title: service.name, description: service.description };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { service } = await load((await params).slug);
  return <ServiceDetailView service={service} />;
}
