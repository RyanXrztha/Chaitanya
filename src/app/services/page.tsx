import type { Metadata } from "next";
import { ServicesScreen } from "@/presentation/screens/ServicesScreen";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse Chaitanya’s therapies — Ayurvedic and relaxation massages, body retreats, facials, hydrotherapy and wellness packages — with prices and durations.",
};

export default async function ServicesPage({ searchParams }: PageProps<"/services">) {
  return <ServicesScreen searchParams={await searchParams} />;
}
