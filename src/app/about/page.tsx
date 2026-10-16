import type { Metadata } from "next";
import { AboutScreen } from "@/presentation/screens/AboutScreen";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Chaitanya Health & Wellness is a naturopathy clinic in Bakhundole, Lalitpur — fifteen years of personalised Ayurvedic and clinical care from a small, BAMS-qualified team.",
};

export default function AboutPage() {
  return <AboutScreen />;
}
