"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { HeroScenarioPlayer } from "@/components/landing/hero-scenario-player";
import { GITHUB_REPO_URL } from "@/lib/links";

export function LineageHero() {
  const [position, setPosition] = useState(58);

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">The design UX for human and agent collaboration.</h1>
        <p className="hero-lede">
          Visual lineage for humans. JSON continuity for agents. Lineage turns
          generated design work into a shared record that people can inspect and
          agents can continue.
        </p>
        <div className="hero-actions">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="hero_github_click"
            data-analytics-label="View Lineage on GitHub"
            className="primary-action"
          >
            View on GitHub
            <ArrowRight aria-hidden="true" size={18} />
          </a>
          <a
            href="/swissifier-lineage-tree.json"
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="hero_json_click"
            data-analytics-label="Open JSON tree"
            className="secondary-action"
          >
            Open JSON tree
          </a>
        </div>
      </div>

      <div className="compare-shell" aria-label="Swissifier lineage visual and JSON comparison">
        <HeroScenarioPlayer position={position} onPositionChange={setPosition} />
      </div>
    </section>
  );
}
