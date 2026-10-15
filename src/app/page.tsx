import type { Metadata } from "next";
import { HomeScreen } from "@/presentation/screens/HomeScreen";

export const metadata: Metadata = {
  title: { absolute: "Chaitanya Health & Wellness — Naturopathy & Spa in Lalitpur" },
  description:
    "Personalized naturopathy, Ayurvedic therapies and holistic spa care in Bakhundol, Lalitpur. Book signature treatments, shop natural products and join our wellness membership.",
};

export default function HomePage() {
  return <HomeScreen />;
}
