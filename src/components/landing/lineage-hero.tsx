"use client";

import Image from "next/image";
import { ArrowRight, Code2, GitBranch, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
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
            href="#start"
            data-analytics-event="hero_start_click"
            data-analytics-label="Start locally"
            className="secondary-action"
          >
            Start locally
          </a>
        </div>
      </div>

      <div className="compare-shell" aria-label="Swissifier lineage visual and JSON comparison">
        <div className="compare-toolbar">
          <span>
            <GitBranch aria-hidden="true" size={16} />
            Real Swissifier lineage
          </span>
          <span>
            {position < 50 ? <Code2 aria-hidden="true" size={16} /> : <ImageIcon aria-hidden="true" size={16} />}
            {position < 50 ? "JSON tree view" : "Visual graph view"}
          </span>
        </div>
        <div className="compare-frame">
          <Image
            src="/swissifier-lineage-json.png"
            alt="JSON representation of the Swissifier lineage tree"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 1040px"
            className="compare-image"
          />
          <div
            className="compare-overlay"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src="/swissifier-lineage-app.png"
              alt="Lineage app screenshot showing the Swissifier image seed graph"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1040px"
              className="compare-image"
            />
          </div>
          <div className="compare-divider" style={{ left: `${position}%` }} aria-hidden="true" />
        </div>
        <div className="compare-control">
          <span>Design surface</span>
          <input
            aria-label="Compare visual lineage graph with JSON lineage tree"
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
          />
          <span>Agent JSON</span>
        </div>
      </div>
    </section>
  );
}
