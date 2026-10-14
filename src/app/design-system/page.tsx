import type { Metadata } from "next";
import { DesignSystemScreen } from "@/presentation/screens/DesignSystemScreen";

export const metadata: Metadata = { title: "Design System", robots: { index: false } };

export default function DesignSystemPage() {
  return <DesignSystemScreen />;
}
