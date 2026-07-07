import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LineageHero } from "@/components/landing/lineage-hero";
import {
  homeDescription,
  organizationSchema,
  pageMetadata,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Lineage - Design UX for human and agent collaboration",
    description: homeDescription,
    path: "/",
  }),
  keywords: [
    "Lineage",
    "agent collaboration UX",
    "design lineage",
    "image asset workflow",
    "generated asset history",
    "AI design tooling",
    "human agent collaboration",
  ],
};

export default function Home() {
  return (
    <main>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <LineageHero />
    </main>
  );
}
