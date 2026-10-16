import type { Metadata } from "next";
import { ContactScreen } from "@/presentation/screens/ContactScreen";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp or write to Chaitanya Health & Wellness in Bakhundole, Lalitpur — open 8:00 AM to 8:00 PM. Get directions and send us a message.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  return <ContactScreen searchParams={await searchParams} />;
}
