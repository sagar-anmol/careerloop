import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mains Test | CareerLoop Pro",
  description: "Timed, server-verified mains practice sets for placements.",
};

export default function ExamLayout({ children }: { children: ReactNode }) {
  return children;
}
