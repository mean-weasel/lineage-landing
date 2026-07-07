import type { Metadata } from "next";
import { Braces, Eye, History, Layers3 } from "lucide-react";
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

const workflow = [
  {
    icon: Eye,
    title: "Inspect the work visually",
    body: "Review generated images, app screens, and UX variants as a living graph instead of a pile of files.",
  },
  {
    icon: Braces,
    title: "Keep the trace machine-readable",
    body: "Every decision can remain available as structured lineage that an agent can parse, resume, or revise.",
  },
  {
    icon: History,
    title: "Move through iterations",
    body: "Branch, reroll, compare, and preserve why each asset exists as the design conversation evolves.",
  },
];

const surfaces = [
  "Image asset exploration",
  "App and UX iteration",
  "Agent-authored design traces",
  "Human review and selection",
];

export default function Home() {
  return (
    <main>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <LineageHero />

      <section id="workflow" className="section-band" aria-labelledby="workflow-title">
        <div className="section-heading">
          <p className="eyebrow">One lineage, two readers</p>
          <h2 id="workflow-title">A shared design record for people and agents.</h2>
          <p>
            Lineage treats design artifacts as collaboration state. The human sees
            a navigable creative surface; the agent keeps a precise tree of inputs,
            outputs, prompts, and choices.
          </p>
        </div>

        <div className="workflow-grid">
          {workflow.map((item) => (
            <article key={item.title} className="workflow-card">
              <item.icon aria-hidden="true" size={22} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" aria-labelledby="surfaces-title">
        <div>
          <p className="eyebrow">Built for messy creative work</p>
          <h2 id="surfaces-title">From seed to Swissifier, without losing the thread.</h2>
        </div>
        <div className="surface-panel">
          <Layers3 aria-hidden="true" size={24} />
          <p>
            The landing page hero uses real Swissifier lineage artifacts from the
            app: the rendered graph screenshot and the corresponding JSON tree.
          </p>
          <div className="surface-list">
            {surfaces.map((surface) => (
              <span key={surface}>{surface}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
