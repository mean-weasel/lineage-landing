import type { Metadata } from "next";
import {
  ArrowUpRight,
  Braces,
  GitBranch,
  MousePointerClick,
  PackageOpen,
  Route,
  Terminal,
} from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { LineageHero } from "@/components/landing/lineage-hero";
import { GITHUB_REPO_URL, GITHUB_WEB_REPO_URL } from "@/lib/links";
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
    icon: PackageOpen,
    title: "Generate the asset set",
    body: "Start with image assets, app screens, UX variants, or any generated output that needs a memory.",
  },
  {
    icon: Route,
    title: "Inspect the lineage graph",
    body: "See seeds, branches, rerolls, selected nodes, and asset relationships in a visual design surface.",
  },
  {
    icon: MousePointerClick,
    title: "Choose the next branch",
    body: "A human can pick what is promising, mark what should continue, and keep context attached to the choice.",
  },
  {
    icon: Braces,
    title: "Hand off the JSON trace",
    body: "The same lineage becomes structured state an agent can parse, resume from, or use for the next variation.",
  },
];

const surfaces = [
  "Image asset exploration",
  "App and UX iteration",
  "Agent-authored design traces",
  "Human review and selection",
];

const startCommands = [
  "git clone git@github.com:mean-weasel/lineage.git",
  "cd lineage",
  "npm install",
  "npm run dev",
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
          <h2 id="workflow-title">A shared design record for people and agents.</h2>
          <p>
            The interface is not just a gallery and the JSON is not just an export.
            They are two views of the same collaboration state.
          </p>
        </div>

        <div className="workflow-rail">
          {workflow.map((item, index) => (
            <article key={item.title} className="workflow-step">
              <span className="step-index">{String(index + 1).padStart(2, "0")}</span>
              <item.icon aria-hidden="true" size={22} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" aria-labelledby="surfaces-title">
        <div>
          <h2 id="surfaces-title">From seed to Swissifier, without losing the thread.</h2>
          <p>
            The hero uses real Swissifier lineage artifacts from the app: the
            rendered graph screenshot and the corresponding JSON tree.
          </p>
        </div>
        <div className="surface-panel">
          <GitBranch aria-hidden="true" size={24} />
          <p>
            Lineage is most useful when creative work is branching faster than a
            person can narrate it by hand.
          </p>
          <div className="surface-list">
            {surfaces.map((surface) => (
              <span key={surface}>{surface}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="start-section" aria-labelledby="start-title">
        <div className="start-copy">
          <h2 id="start-title">Start with the app repo. Deploy the landing site separately.</h2>
          <p>
            The landing page now lives in its own repository, while the app and
            Swissifier demo fixture stay in the main Lineage repo.
          </p>
          <div className="start-actions">
            <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="primary-action">
              App repo
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
            <a href={GITHUB_WEB_REPO_URL} target="_blank" rel="noopener noreferrer" className="secondary-action">
              Landing repo
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </div>
        <div className="terminal-panel" aria-label="Local development commands">
          <div className="terminal-title">
            <Terminal aria-hidden="true" size={17} />
            local app
          </div>
          <pre>
            <code>{startCommands.map((command) => `$ ${command}`).join("\n")}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
